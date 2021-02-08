import firebase from 'firebase';
import '@firebase/functions';
import environment from './environment';



const config = environment.firebaseConfig;

const Firebase = firebase.initializeApp(config);

export default Firebase;
