import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../../config/firebase";
import "../Login/Login.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const register = () => {
    if (!name) alert("Please enter name");
    registerWithEmailAndPassword(name, email, password);
  };

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);

  return (
    <div className="register-form">
      {/*<div className="register__container">
        <input
          type="text"
          className="register__textBox"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Full Name"
        />
        <input
          type="text"
          className="register__textBox"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="register__textBox"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="register__btn" onClick={register}>
          Register
        </button>
        <button
          className="register__btn register__google"
          onClick={signInWithGoogle}
        >
          Register with Google
        </button>

        <div>
          Already have an account? <Link to="/">Login</Link> now.
        </div>
      </div>*/}
      <div class="login-form">
        <div class="container">
          <div class="container-wrapper">
            <h3 class="login-text">
              <i class="bi bi-person-circle ac-logo"></i>Register
            </h3>

            <div class="item">
              <input
                class="input"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div class="item">
              <input
                class="input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="E-mail Address"
              />
            </div>
            <div class="item">
              <input
                type="password"
                className="input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>

            <div class="item submit">
              <button type="button" onClick={register}>
                Submit
              </button>
            </div>

            <h2>
              <span>OR</span>
            </h2>

            <div class="social-media">
              <button className="logingoogle" onClick={signInWithGoogle}>
                <div class="icons8-google social-mediaImg"></div>
              </button>
            </div>
            <span class="ac">
              Already have an account? <Link to="/">Sign In</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
