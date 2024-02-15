import React from "react";
import { auth } from "../db/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
const provider = new GoogleAuthProvider();

const AuthButton: React.FC = () => {
  const SignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
      })
      .catch((error: any) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };
  return (
    <button id="auth-button" onClick={SignIn}>
      Sign In With Google
    </button>
  );
};

export default AuthButton;
