import firebase from 'firebase';
import firebaseConfig from './config/secrets/firebase.json';
import firebaseStorage from './config/secrets/firebaseStorage.json';
import serviceAccount from './config/secrets/serviceAccountKey.json';
import admin from 'firebase-admin';

admin.initializeApp({
// @ts-ignore
  credential: admin.credential.cert(serviceAccount),
  storageBucket: firebaseStorage.storageBucket,
});

firebase.initializeApp(firebaseConfig);
export {firebase, admin}; 