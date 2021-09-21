import * as f from 'firebase/app';
import admin from 'firebase-admin';
import * as fs from 'fs';

function __readFromFileOrEnvVar(filepath: string, envVarName: string){
  if(fs.existsSync(filepath)){
    return JSON.parse(fs.readFileSync(filepath, "utf-8"))
  }
  const envVar = process.env[envVarName]
  if(!envVar){
    throw new Error(`Cannot find ${envVarName} variable`)
  }
  return JSON.parse(envVar.toString())
}

function firebaseStorage() {
  return __readFromFileOrEnvVar('./src/config/secrets/firebaseStorage.json', "FIREBASE_STORAGE")
}

function firebaseConfig() {
  return __readFromFileOrEnvVar('./src/config/secrets/firebase.json', "FIREBASE_CONFIG")
}

function serviceAccount(): any {
  return __readFromFileOrEnvVar('./src/config/secrets/serviceAccountKey.json', "SERVICE_ACCOUNT")
}


admin.initializeApp({
  // @ts-ignore
  credential: admin.credential.cert(serviceAccount()),
  storageBucket: firebaseStorage().storageBucket,
});


f.initializeApp(firebaseConfig());
export { f as firebase, admin };