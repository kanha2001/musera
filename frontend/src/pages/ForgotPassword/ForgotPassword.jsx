import React, { useState, useEffect } from "react";
import "./ForgotPassword.css";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  clearErrors,
  clearMessage,
} from "../../features/userSlice";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { error, message, loading } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");

  const forgotPasswordSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [dispatch, error, message]);

  return (
    <div className="forgot-wrapper">
      {/* 🔥 SAME FLOATING ELEMENTS */}
      <div className="floating-dress"></div>
      <div className="floating-toy1"></div>
      <div className="floating-toy2"></div>
      <div className="floating-toy3"></div>

      <div className="forgot-container">
        <div className="forgot-card">
          <div className="forgot-header">
            <div className="logo-circle">
              <span className="logo-text">📧</span>
            </div>
            <h2>Reset Password</h2>
            <p>Enter your email to receive a recovery link</p>
          </div>

          <form className="forgot-form" onSubmit={forgotPasswordSubmit}>
            <div className="input-wrapper">
              <div className="input-field">
                <input
                  type="email"
                  placeholder="Enter your Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="input-icon">✉️</span>
              </div>
            </div>

            <button type="submit" className="reset-button" disabled={loading}>
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                "Send Recovery Link ✨"
              )}
            </button>
          </form>

          <div className="back-link">
            <a href="/login">← Back to Login</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
