import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearErrors } from "../../features/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.user
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (error) {
      if (error !== "Please Login to access this resource") {
        toast.error(error);
      }
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      toast.success("Logged In Successfully");
      navigate("/");
    }
  }, [dispatch, error, isAuthenticated, navigate]);

  return (
    <div className="login-wrapper">
      {/* 🔥 FLOATING KIDS ITEMS */}
      <div className="floating-dress"></div>
      <div className="floating-toy1"></div>
      <div className="floating-toy2"></div>
      <div className="floating-toy3"></div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-circle">
              <span className="logo-text">👗</span>
            </div>
            <h2>Welcome Back!</h2>
            <p>Sign in to your Musera account</p>
          </div>

          <form className="login-form" onSubmit={loginSubmit}>
            <div className="input-wrapper">
              <div className="input-field">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="input-icon">✉️</span>
              </div>
            </div>

            <div className="input-wrapper">
              <div className="input-field">
                <input
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="input-icon">🔒</span>
              </div>
            </div>

            <Link to="/password/forgot" className="forgot-password">
              Forgot Password?
            </Link>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                "Sign In Magic ✨"
              )}
            </button>
          </form>

          <div class="signup-prompt">
            <p>
              New to Musera?{" "}
              <Link to="/register" className="signup-link">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
