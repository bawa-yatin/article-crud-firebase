// Reset Password Page

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "../../config/firebase";
import "../Login/Login.css";

const Reset = () => {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);

  return (
    //<div className="reset">
    //  <div className="reset__container">
    //    <input
    //      type="text"
    //      className="reset__textBox"
    //      value={email}
    //      onChange={e => setEmail(e.target.value)}
    //      placeholder="E-mail Address"
    //    />
    //    <button className="reset__btn" onClick={() => sendPasswordReset(email)}>
    //      Send password reset email
    //    </button>

    //    <div>
    //      Don't have an account? <Link to="/register">Register</Link> now.
    //    </div>
    //  </div>
    //</div>

    <div className="reset-form">
      <div class="login-form">
        <div class="container wrapper">
          <div class="container-wrapper">
            <h3 class="login-text">
              <i class="bi bi-person-circle ac-logo"></i>Reset Password
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

            <div class="item submit">
              <button type="button" onClick={() => sendPasswordReset(email)}>
                Send Password Reset Email
              </button>
            </div>

            <span class="ac">
              Don't have an account? <Link to="/register">Sign Up</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reset;
