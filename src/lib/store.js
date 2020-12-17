import { db } from './firebase'
import { readable } from 'svelte/store'

function throttle(fn, ...delays) {
  let t1, t2, activeDelay = 0

  return function() {
    if (t2) {
      clearTimeout(t2)
      t2 = undefined
    }

    if (t1) {
      return
    }

    t1 = setTimeout(() => {
      fn(...arguments)
      t1 = undefined

      // Increment the active delay each time
      // and then stick with the last one.
      activeDelay = Math.min(++activeDelay, delays.length - 1)

      // Set a 2nd `Timeout` that resets the
      // active delay back to the first one.
      t2 = setTimeout(() => {
        activeDelay = 0
        t2 = undefined
      }, delays[activeDelay])

    }, delays[activeDelay])
  }
}

export function collection(ref, query, initialData = []) {
  // If ref was passed as a string then
  // treat it as a collection path.
  if (typeof ref === 'string')
    ref = db.collection(ref)

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

        function proxyMapper(doc) {
          const update = throttle(target => {
            const data = { ...target, updated: Date.UTC() }

            delete data.id

            doc.ref.update(data)
          }, 100, 500)

          return new Proxy({ id: doc.id, ...doc.data() }, {
            get(_, prop) {
              return prop === 'delete'
                ? doc.ref.delete.bind(doc.ref)
                : Reflect.get(...arguments)
            },
            set(target) {
              Reflect.set(...arguments)
              update(target)
              return true
            }
          })
        }

        if(!snapshot.docs) {
          return set(proxyMapper(snapshot))
        }

        return set(snapshot.docs.map(proxyMapper))
      }
    )

    return () => unsubscribe()
  })

  // We also add an `add` method to our store,
  // which forwards the call to the firestore collection reference.
  store.add = doc => ref.add({ created: new Date, ...doc })

  // Used to preload data in sapper
  store.preload = async (returnValueBuilder) =>{ 
    const data = await query.get()

    if(!data.docs && typeof window === 'undefined') {
      return { id: data.id, data: data.data() }
    }
    const output = data.docs?.map(d => ({ id: d.id, ...d.data() }))
    return returnValueBuilder ? returnValueBuilder(output) : { data: output }
  }

  /**
   * Finally we wrap the entire store in another proxy.
   * The purpose of this proxy is that you can build queries with the store.
   * And that for every additional query method you just get back a new Svelte store.
   */
  return new Proxy(store, {
    get(target, prop, receiver) {
      if (prop in target) {
        return Reflect.get(...arguments)
      }

      if (prop in query && typeof query[prop] === 'function') {
        const queryFunc = Reflect.get(query, prop, receiver).bind(query)

        return function() {
          const newQuery = queryFunc(...arguments)

          return collection(ref, newQuery, initialData)
        }
      }
    } 
  })
}