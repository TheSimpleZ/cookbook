import { db } from './firebase'
import { readable } from 'svelte/store'

import { throttle } from 'lodash.throttle'

const flattenData = d => ({ id: d.id, ...d.data() })

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

        function proxyMapper(doc) {
          const update = throttle(target => {
            const data = target

            delete data.id

            doc.ref.update(data)
          }, 100, { leading: true, trailing: false })

          return new Proxy(flattenData(doc), {
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
  store.add = doc => ref.add(doc)

  // Used to preload data in sapper
  store.preload = async (returnValueBuilder = data => ({ data })) =>{ 
    const data = await query.get()
    const output = data.docs ? data.docs.map(flattenData) : flattenData(data)
    return returnValueBuilder(output)
  }

  // A helper method to only access documents belonging to current user
  store.assumeRole = (userId, role='owner', path='roles.') => collection(ref, initialData, query.where(`${path}${userId}`, '==', role))
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

          return collection(ref, initialData, newQuery)
        }
      }
    } 
  })
}