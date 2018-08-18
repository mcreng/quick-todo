import firebase from "@firebase/app";
import "@firebase/firestore";

const config = {
    apiKey: "AIzaSyDUk6Ir2xI6lJLiq9UR8xsCu3TM5Ehx-Gs",
    authDomain: "quick-todo-bba1e.firebaseapp.com",
    databaseURL: "https://quick-todo-bba1e.firebaseio.com",
    projectId: "quick-todo-bba1e",
    storageBucket: "quick-todo-bba1e.appspot.com",
    messagingSenderId: "925892899784"
};

const app = firebase.initializeApp(config);
const firestore = firebase.firestore(app);

export default firestore;
