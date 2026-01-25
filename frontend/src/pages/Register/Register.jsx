import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearErrors } from "../../features/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Register.css";

// IMPORT THE IMAGE FROM ASSETS
import defaultAvatar from "../../assets/Profile.png";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.user
  );

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  // Use imported image as default state
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [avatarPreview, setAvatarPreview] = useState(defaultAvatar);

  const registerSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("avatar", avatar);

    dispatch(registerUser(myForm));
  };

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      // Check if file exists to prevent error
      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
      }
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      toast.success("Account Created Successfully");
      navigate("/");
    }
  }, [dispatch, error, isAuthenticated, navigate]);

  return (
    <div className="register-wrapper">
      {/* 🔥 FLOATING KIDS ITEMS - SAME AS LOGIN */}
      <div className="floating-dress"></div>
      <div className="floating-toy1"></div>
      <div className="floating-toy2"></div>
      <div className="floating-toy3"></div>

      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <div className="logo-circle">
              <span className="logo-text">🆕</span>
            </div>
            <h2>Join Musera Today!</h2>
            <p>Create your account to start shopping</p>
          </div>

          <form
            className="register-form"
            encType="multipart/form-data"
            onSubmit={registerSubmit}
          >
            <div className="input-wrapper">
              <div className="input-field">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  name="name"
                  value={name}
                  onChange={registerDataChange}
                />
                <span className="input-icon">👤</span>
              </div>
            </div>

            <div className="input-wrapper">
              <div className="input-field">
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  name="email"
                  value={email}
                  onChange={registerDataChange}
                />
                <span className="input-icon">✉️</span>
              </div>
            </div>

            <div className="input-wrapper">
              <div className="input-field">
                <input
                  type="password"
                  placeholder="Create Password"
                  required
                  name="password"
                  value={password}
                  onChange={registerDataChange}
                />
                <span className="input-icon">🔒</span>
              </div>
            </div>

            {/* 🔥 BEAUTIFUL AVATAR UPLOAD */}
            <div className="avatar-upload">
              <div className="avatar-preview">
                <img src={avatarPreview} alt="Avatar Preview" />
                <div className="avatar-overlay">
                  <span>📷</span>
                  <p>Change Photo</p>
                </div>
              </div>
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={registerDataChange}
                id="avatar-input"
              />
              <label htmlFor="avatar-input" className="avatar-label">
                Choose Avatar
              </label>
            </div>

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                "Create Account ✨"
              )}
            </button>
          </form>

          <div className="login-prompt">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
