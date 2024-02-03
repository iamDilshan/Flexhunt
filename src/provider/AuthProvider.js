import React, { createContext, useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { db } from "../configs/firebase";

const AuthContext = createContext();

const AuthProvider = (props) => {
  const auth = firebase.auth();
  const [user, setUser] = useState(null);
  const [currentUser, setcurrentUser] = useState("");
  const [userData, setUserdata] = useState([]);

  useEffect(() => {
    unsubscribe();
    fetchUserData();
  }, []);

  function unsubscribe() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setcurrentUser(user);
        setUser(true);
      } else {
        setUser(false);
      }
    });
  }
  const uid = currentUser ? currentUser.uid : null;
  if (uid === null) {
    console.log("UID is null, no user is logged in.");
  } else {
    console.log("User UID:", uid);
  }

  async function fetchUserData() {
    if (!uid) return;

    // Check the 'employees' collection first
    db.collection("employees")
      .doc(uid)
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          const userValuve = docSnapshot.data();
          setUserdata(userValuve);
        } else {
          // If not found in 'employees', check the 'clients' collection
          db.collection("clients")
            .doc(uid)
            .get()
            .then((docSnapshot) => {
              if (docSnapshot.exists) {
                const userValuve = docSnapshot.data();
                setUserdata(userValuve);
              }
            });
        }
      });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser,
        userData,
        uid,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
