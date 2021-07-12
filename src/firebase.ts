import firebase from 'firebase';
import admin from 'firebase-admin';
import * as fs from 'fs';

function firebaseStorage() {
  if(fs.existsSync('./config/secrets/firebaseStorage.json')){
    return JSON.parse(fs.readFileSync('./config/secrets/firebaseStorage.json', "utf-8"))
  }
  const envVar = process.env["FIREBASE_STORAGE"]
  if(!envVar){
    throw new Error("Cannot find FIREBASE_STORAGE variable")
  }
  return JSON.parse(envVar.toString())
}

function firebaseConfig() {
  if(fs.existsSync('./config/secrets/firebase.json')){
    return JSON.parse(fs.readFileSync('./config/secrets/firebase.json', "utf-8"))
  }
  const envVar = process.env["FIREBASE_CONFIG"]
  if(!envVar){
    throw new Error("Cannot find FIREBASE_CONFIG variable")
  }
  return JSON.parse(envVar.toString())
}

function serviceAccount(): any {
  if(fs.existsSync('./config/secrets/serviceAccountKey.json')){
    return JSON.parse(fs.readFileSync('./config/secrets/serviceAccountKey.json', "utf-8"))
  }
  const envVar = process.env["SERVICE_ACCOUNT"]
  if(!envVar){
    throw new Error("Cannot find SERVICE_ACCOUNT variable")
  }
  return JSON.parse(envVar.toString())
}


admin.initializeApp({
  // @ts-ignore
  credential: admin.credential.cert(serviceAccount()),
  storageBucket: firebaseStorage().storageBucket,
});

firebase.initializeApp(firebaseConfig());
export { firebase, admin };