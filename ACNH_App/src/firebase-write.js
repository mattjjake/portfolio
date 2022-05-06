
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getDatabase, ref, set, push, onValue, increment } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAj4EgEBFMlSyDZetdmk0450ZDdS3Hr6vM",
  authDomain: "accommunity-2582a.firebaseapp.com",
  projectId: "accommunity-2582a",
  storageBucket: "accommunity-2582a.appspot.com",
  messagingSenderId: "887160556873",
  appId: "1:887160556873:web:8993f66459cb0a14509e98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Write data to firebase
export const writeSearchData = name => {
  const db = getDatabase();
  const searchRef = ref(db, "searches/" + name);
  set(searchRef, {
    name,
    searches: increment(1)
  });
};

export const writeMonthData = month => {
  const db = getDatabase();
  const searchRef = ref(db, "months/" + month);
  set(searchRef, {
    month,
    searches: increment(1)
  });
};

export const writeLocData = loc => {
  const db = getDatabase();
  const searchRef = ref(db, "location/" + loc);
  set(searchRef, {
    loc,
    searches: increment(1)
  });
};
