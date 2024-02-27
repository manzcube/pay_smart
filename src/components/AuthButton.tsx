import React from "react";
import { auth } from "../db/firebase";
import { toast } from "react-toastify";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
const provider = new GoogleAuthProvider();

const icon = require("../images/icon.png");

const AuthButton: React.FC = () => {
  const SignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        toast.success(`Welcome ${result?.user.displayName}`);
      })
      .catch((error: any) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };
  return (
    <div id="auth-button-wrap">
      <h2>
        <img src={icon} alt="paysmart_icon" />
        <p>Pay Smart</p>
      </h2>
      <div className="auth-button-letter">
        <p>Welcome to PaySmart!</p>
      </div>
      <button id="auth-button" onClick={SignIn}>
        <span>Sign In With Google</span>
      </button>
    </div>
  );
};

export default AuthButton;
