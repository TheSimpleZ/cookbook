import { db } from './firebase'
import { readable } from 'svelte/store'

const flattenData = d => ({ id: d.id, ...d.data() })

function proxyMapper(doc) {
  return new Proxy(flattenData(doc), {
    get(_, prop) {
      return prop === 'delete'
        ? doc.ref.delete.bind(doc.ref)
        : Reflect.get(...arguments)
    },
    set({ id, ...data }) {
      Reflect.set(...arguments)
      doc.ref.update(data)
      return true
    }
  })
}


export function collection(ref, initialData = [], query) {
  // If ref was passed as a string then
  // treat it as a collection path.
  if (typeof ref === 'string') {
    ref = db.collection(ref)
  }

  // If no query was given then the collection
  // reference can function as a query too.
  if (!query) query = ref

  /**
   * This block of code creates a readable Svelte store,
   * which subscribes itself to Firestore's live updating snapshots.
   *
   * And whenever a new snapshot comes in, we wrap every document in it
   * in a proxy, so that whenever we change a property on a document,
   * that change is then automatically sent back to Firestore.
   *
   * Finally we also add a delete method to every document,
   * for complete crud control.
   */
  const store = readable(initialData, set => {
    const unsubscribe = query.onSnapshot(
      snapshot => {
        if(!snapshot.docs) {
          return set(proxyMapper(snapshot))
        }

        return set(snapshot.docs.map(proxyMapper))
      },
      error => {
        throw error
      }
    )

    return () => unsubscribe()
  })

  // We also add an `add` method to our store,
  // which forwards the call to the firestore collection reference.
  store.add = doc => ref.add(doc)

  // Used to preload data in sapper
  store.preload = async (returnValueBuilder = data => ({ data })) => {
    const data = await query.get()
    const output = data.docs ? data.docs.map(flattenData) : flattenData(data)
    return returnValueBuilder(output)
  }

  /**
   * Finally we wrap the entire store in another proxy.
   * The purpose of this proxy is that you can build queries with the store.
   * And that for every additional query method you just get back a new Svelte store.
   */
  const storeProxy = new Proxy(store, {
    get(target, prop, receiver) {
      if (prop in target) {
        return Reflect.get(...arguments)
      }
      
      if (prop in query && typeof query[prop] === 'function') {
        const queryFunc = Reflect.get(query, prop, receiver).bind(query)
        
        return function() {
          const newQuery = queryFunc(...arguments)
          
          return collection(ref, initialData, newQuery)
        }
      }
    } 
  })

  // A helper method to only access documents belonging to current user
  store.asRole = (userId, role='owner', path='roles.') => storeProxy.where(`${path}${userId}`, '==', role)
  
  return storeProxy
}