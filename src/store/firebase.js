import firebase from 'firebase/app';
import 'firebase/firestore';

let fb, firebaseConfig

if (process.browser) {
  // If we're inside the browser
  fb = firebase
  firebaseConfig = {
    projectId: "cookbook-e20d7",
    appId: "1:408966937032:web:4032ce696f73a9ed16e8fd",
    storageBucket: "cookbook-e20d7.appspot.com",
    locationId: "europe-west",
    apiKey: "AIzaSyCI3lPLvtFoK0Kdu835ApWf_M-EeJdLbTQ",
    authDomain: "cookbook-e20d7.firebaseapp.com",
    messagingSenderId: "408966937032",
    measurementId: "G-28D19SQLZH"
  }
} else {
  // If we're inside the server
  fb = require('firebase-admin')
  const creds = process.env.GCLOUD_CREDENTIALS

  if (typeof creds === 'string') {
    firebaseConfig = JSON.parse(Buffer.from(creds, 'base64').toString())
  }

  firebaseConfig = {
    credential: fb.credential.cert(firebaseConfig),
  }
}

const app = fb.initializeApp(firebaseConfig)

export const db = app.firestore()
if (db.enablePersistence) db.enablePersistence()