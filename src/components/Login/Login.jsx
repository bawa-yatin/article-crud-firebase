import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  logInWithEmailAndPassword,
  signInWithGoogle,
} from "../../config/firebase";
//import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";
//import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  //const { dispatch } = useContext(AuthContext);

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
    <div className="login">
      <div className="login__container">
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
      </div>
    </div>
  );
};

export default Login;
