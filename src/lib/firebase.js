import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

export const fb = process.browser ? firebase : require('firebase-admin')

let firebaseConfig
if(process.browser) {
  firebaseConfig = {
    projectId: 'cookbook-e20d7',
    appId: '1:408966937032:web:4032ce696f73a9ed16e8fd',
    storageBucket: 'cookbook-e20d7.appspot.com',
    locationId: 'europe-west',
    apiKey: 'AIzaSyCI3lPLvtFoK0Kdu835ApWf_M-EeJdLbTQ',
    authDomain: 'cookbook-e20d7.firebaseapp.com',
    messagingSenderId: '408966937032',
    measurementId: 'G-28D19SQLZH'
  }
} else {
  const creds = process.env.GCLOUD_CREDENTIALS
  if (!creds) {
    console.log('You must run the getKey.sh script. Read the readme for Firebase access')
  }  
  
  firebaseConfig = { credential: fb.credential.cert(JSON.parse(Buffer.from(creds, 'base64').toString())), }
}


const app = fb.initializeApp(firebaseConfig)

export const db = app.firestore()
export const auth = fb.auth()


if (db.enablePersistence) db.enablePersistence()