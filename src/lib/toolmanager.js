const zipDefault = (keys, modules) => keys.map((k, i) => [k, modules[i].default]);


export async function loadTools() {
  if(typeof window === "undefined")
    return

  const tools = {
    list: import('@editorjs/list'),
    image: import('@editorjs/image'),
    underline: import('@editorjs/underline'),
    header: import('@editorjs/header'),
    marker: import('@editorjs/marker'),
    table: import('@editorjs/table')
  }  

  return Object.fromEntries(zipDefault(
      Object.keys(tools), 
      await Promise.all(Object.values(tools)
    )))
}

