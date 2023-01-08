// User Login Page

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  logInWithEmailAndPassword,
  signInWithGoogle,
} from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, loading]);

  //const handleLogin = e => {
  //  e.preventDefault();
  //  signInWithEmailAndPassword(auth, email, password)
  //    .then(userCredential => {
  //      const user = userCredential.user;
  //      dispatch({ type: "LOGIN", payload: user });
  //      navigate("/dashboard");
  //    })
  //    .catch(err => {
  //      console.error(err);
  //      alert(err.message);
  //    });
  //};

  return (
    <>
      {/*<div className="login__container">
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="login__btn"
          //onClick={handleLogin}
          onClick={() => logInWithEmailAndPassword(email, password)}
        >
          Login
        </button>
        <button className="login__btn login__google" onClick={signInWithGoogle}>
          Login with Google
        </button>
        <div>
          <Link to="/reset">Forgot Password</Link>
        </div>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>*/}

      <div class="login-form">
        <div class="container wrapper">
          <div class="container-wrapper">
            <h3 class="login-text">
              <i class="bi bi-person-circle ac-logo"></i>Login
            </h3>

            <div class="item">
              <input
                class="input"
                type="text"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div class="item">
              <input
                class="input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <span class="remember">
              <Link to="/reset">Forgot Password?</Link>{" "}
            </span>

            <div class="item submit">
              <button
                type="button"
                onClick={() => logInWithEmailAndPassword(email, password)}
              >
                Submit
              </button>
            </div>

            <h2>
              <span>OR</span>
            </h2>

            <div class="social-media">
              <button
                type="button"
                className="logingoogle"
                onClick={signInWithGoogle}
              >
                <div class="icons8-google social-mediaImg"></div>
              </button>
            </div>
            <span class="ac">
              Don't have an account? <Link to="/register">Sign Up</Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
