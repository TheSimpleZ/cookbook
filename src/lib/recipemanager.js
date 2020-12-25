import { storage } from './firebase'


export function createRecipe({ user }) {
  return {
    roles: { [user.uid]: 'owner' }, 
    instructions: {
      blocks: [
        {
          type: 'header',
          data: {
            level: 5,
            text: 'Ingredients'
          }
        },
        {
          type: 'table',
          data: {
            content: {
              0: ['<b>Name</b>', '<b>Quantity</b>', '<b>Unit</b>'], 
              1: ['','',''] 
            }, 
          }
        }
      ]
    } 
  }
}



export async function uploadImage(recipeId, file) {
  const snapshot = await storage.ref('recipes')
    .child(recipeId)
    .child(file.name)
    .put(file)

  const url = await snapshot.ref.getDownloadURL()

  return {
    success: 1,
    file: { url },
  }
}

function transformBlocks (data, transformBlock) {
  if (!data || !data.blocks) return data

  return {
    ...data,
    blocks: data.blocks.map(transformBlock),
  }
}

/**
 * Firebase firestore and storage does not like certain formatting that Editor.js outputs
 * This funciton will transform the blocks into something that firebase likes
 * @param {*} data - Data from Editor.js save method
 */
export function transformBlocksToFirebaseFriendly(data) {
  function transformBlock(block) {
    // If this piece of code is removed the image plugin will replace all
    // '&' signs with '&amp;'
    if (block.type === 'image' && block.data.file.url) {
      block.data.file.url = block.data.file.url.replace('&amp;', '&')
    }

    // Firestore does not support nested arrays.
    // hence we convert the table array to an object
    if (block.type === 'table' && block.data.content) {
      block.data.content = block.data.content.reduce((acc, val, i) => {
        acc[i] = val
        return acc
      }, {})
    }
    return block
  }

  return transformBlocks(data, transformBlock)
}

/**
 * This will revert the data to Editor.js format for display.
 * @param {*} data 
 */
export function transformBlocksToOriginal(data) {
  function transformBlock(block) {
    if (block.type === 'table' && block.data.content) {
      block.data.content = Object.values(block.data.content)
    }
    return block
  }


  return transformBlocks(data, transformBlock)
}
