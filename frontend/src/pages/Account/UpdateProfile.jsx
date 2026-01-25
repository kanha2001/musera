import React, { useState, useEffect } from "react";
import "./Account.css";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProfile,
  clearErrors,
  resetUpdate,
  loadUser,
} from "../../features/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import AccountLayout from "../../components/Account/AccountLayout";

// --- CONFIGURATION ---
// IMPORTANT: Yahan 4000 hi rehne dena agar aapka backend 4000 par hai
const SERVER_URL = "http://localhost:4000";
const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(DEFAULT_AVATAR);

  const updateProfileSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.append("name", name);
    myForm.append("email", email);
    if (avatar) {
      myForm.append("avatar", avatar);
    }
    dispatch(updateProfile(myForm));
  };

  const updateDataChange = (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(file);
        }
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");

      // --- SIMPLIFIED IMAGE LOGIC ---
      let userImage = DEFAULT_AVATAR;

      if (user.avatar) {
        if (typeof user.avatar === "string") {
          // Agar "http" se shuru hota hai (Google Auth etc.)
          if (user.avatar.startsWith("http")) {
            userImage = user.avatar;
          }
          // Agar local upload hai (e.g., "avatar-123.png")
          else {
            // Yahan ensure karein ki SERVER_URL 4000 hi ho
            userImage = `${SERVER_URL}/uploads/users/${user.avatar}`;
          }
        } else if (user.avatar.url) {
          userImage = user.avatar.url;
        }
      }

      // Agar user ne abhi nayi file select nahi ki hai, tabhi purani dikhao
      if (!avatar) {
        setAvatarPreview(userImage);
      }
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Profile Updated Successfully");
      dispatch(loadUser());
      navigate("/account");
      dispatch(resetUpdate());
    }
  }, [dispatch, error, navigate, user, isUpdated]);

  return (
    <AccountLayout>
      <h2 className="account-heading">Update Profile</h2>
      {loading ? (
        <Loader />
      ) : (
        <form
          className="acc-form"
          onSubmit={updateProfileSubmit}
          encType="multipart/form-data"
        >
          <div className="acc-form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="acc-form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="acc-avatar-wrapper">
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="acc-avatar-preview"
              // Agar 4000 par bhi image na mile, to Default dikhao (Error hide ho jayega)
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_AVATAR;
              }}
            />
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={updateDataChange}
              className="acc-file-input"
            />
          </div>

          <button type="submit" className="acc-btn">
            Save Changes
          </button>
        </form>
      )}
    </AccountLayout>
  );
};

export default UpdateProfile;
