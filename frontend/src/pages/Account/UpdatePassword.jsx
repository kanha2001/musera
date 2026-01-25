import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updatePassword,
  clearErrors,
  resetUpdate,
} from "../../features/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AccountLayout from "../../components/Account/AccountLayout";
import Loader from "../../components/Loader/Loader";
import "./UpdatePassword.css";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, isUpdated, loading } = useSelector((state) => state.user);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updatePasswordSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Confirm Password does not match");
      return;
    }

    if (!oldPassword || !newPassword) {
      toast.error("All fields are required");
      return;
    }

    const myForm = {
      oldPassword,
      newPassword,
      confirmPassword,
    };

    dispatch(updatePassword(myForm));
  };

  useEffect(() => {
    // Error Handling
    if (error) {
      toast.error(error);
      console.log("Error in Component:", error); // Debug Log
      dispatch(clearErrors());
    }

    // Success Handling
    if (isUpdated) {
      toast.success("Password Updated Successfully");
      navigate("/account");
      dispatch(resetUpdate());
    }
  }, [dispatch, error, isUpdated, navigate]);

  return (
    <AccountLayout>
      {loading ? (
        <div
          style={{
            height: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader />
        </div>
      ) : (
        <div className="updatePasswordContainer">
          <div className="updatePasswordBox">
            <h2 className="updatePasswordHeading">Change Password</h2>

            <form
              className="updatePasswordForm"
              onSubmit={updatePasswordSubmit}
            >
              <div className="loginPassword">
                <input
                  type="password"
                  placeholder="Current Password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>

              <div className="loginPassword">
                <input
                  type="password"
                  placeholder="New Password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="loginPassword">
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <input
                type="submit"
                value={loading ? "Updating..." : "Update Password"}
                className="updatePasswordBtn"
                disabled={loading} // Loading ke time disable
              />
            </form>
          </div>
        </div>
      )}
    </AccountLayout>
  );
};

export default UpdatePassword;
