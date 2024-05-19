import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

///PROD

const firebaseConfig = {
  apiKey: "AIzaSyDRv5LVfWc0icCVb0OwoUQ25jgkipjTCWU",
  authDomain: "petalosarteprod.firebaseapp.com",
  databaseURL: "https://petalosarteprod.firebaseio.com",
  projectId: "petalosarteprod",
  storageBucket: "petalosarteprod.appspot.com",
  messagingSenderId: "1039687597381",
  appId: "1:1039687597381:web:4fb27936c8f0d78f92522c"
};


/* const firebaseConfig = {
  apiKey: "AIzaSyAMiNHNKa_gzQKuivRwFydgMAZNqB8K9hs",
  authDomain: "petalos-arte.firebaseapp.com",
  databaseURL: "https://petalos-arte.firebaseio.com",
  projectId: "petalos-arte",
  storageBucket: "petalos-arte.appspot.com",
  messagingSenderId: "220047130772",
  appId: "1:220047130772:web:b70df6e5da9d328a643481"
}; */

  const firebase = initializeApp(firebaseConfig);

  const projectFirestore = getFirestore(firebase);



  export {firebase, projectFirestore};