import React, { useState, useEffect } from "react";
import "./ResetPassword.css";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearErrors } from "../../features/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const { error, success, loading } = useSelector((state) => state.user);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetPasswordSubmit = (e) => {
    e.preventDefault();
    dispatch(
      resetPassword({ token, passwords: { password, confirmPassword } })
    );
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Password Updated Successfully");
      navigate("/login");
    }
  }, [dispatch, error, success, navigate]);

  return (
    <div className="reset-wrapper">
      {/* 🔥 SAME FLOATING ELEMENTS */}
      <div className="floating-dress"></div>
      <div className="floating-toy1"></div>
      <div className="floating-toy2"></div>
      <div className="floating-toy3"></div>

      <div className="reset-container">
        <div className="reset-card">
          <div className="reset-header">
            <div className="logo-circle">
              <span className="logo-text">🔐</span>
            </div>
            <h2>New Password</h2>
            <p>Create a strong new password for your account</p>
          </div>

          <form className="reset-form" onSubmit={resetPasswordSubmit}>
            <div className="input-wrapper">
              <div className="input-field">
                <input
                  type="password"
                  placeholder="New Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="input-icon">🔒</span>
              </div>
            </div>

            <div className="input-wrapper">
              <div className="input-field">
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span className="input-icon">🔗</span>
              </div>
            </div>

            <button type="submit" className="update-button" disabled={loading}>
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                "Update Password ✨"
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

export default ResetPassword;
