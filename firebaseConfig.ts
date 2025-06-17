import firebase from "firebase/compat/app"
import "firebase/compat/auth"

const firebaseConfig = {
    apiKey: "fake-api-key",
    authDomain: "localhost",
    projectId: "juniorfirebase-d7603"
}
if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

const auth = firebase.auth()

if(__DEV__){
    auth.useEmulator("http://172.20.10.13:9099")
}

export { auth }

