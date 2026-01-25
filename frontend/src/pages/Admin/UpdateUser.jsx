import React, { useEffect, useState } from "react";
import "./NewProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { Mail, User, Shield, CheckCircle } from "lucide-react";
import Sidebar from "../../components/Admin/Sidebar";
import Loader from "../../components/Loader/Loader";
import {
  getUserDetails,
  updateUser,
  clearErrors,
  resetProfile,
} from "../../features/userSlice";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { loading, error, user } = useSelector((state) => state.userDetails);
  const {
    loading: updateLoading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.profile);

  const [role, setRole] = useState("");

  // Note: Name aur Email state ki zaroorat nahi hai agar hum sirf Role update kar rahe hain
  // Hum seedha `user.name` aur `user.email` display karenge

  useEffect(() => {
    // 1. Agar user load nahi hai ya ID match nahi karti, fetch karo
    if (user && user._id !== id) {
      dispatch(getUserDetails(id));
    } else {
      // 2. Data load hone par Role set karo
      setRole(user.role);
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("User Role Updated Successfully");
      navigate("/admin/users");
      dispatch(resetProfile());
    }
  }, [dispatch, error, navigate, isUpdated, updateError, user, id]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    // Sirf Role bhejna kaafi hai agar backend allow kare,
    // par safer side ke liye teeno bhejte hain (backend logic par depend karta hai)
    myForm.set("name", user.name);
    myForm.set("email", user.email);
    myForm.set("role", role);

    dispatch(updateUser({ id, userData: myForm }));
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="newProductContainer">
        <h1 className="formHeading">Update User Role</h1>

        {loading ? (
          <Loader />
        ) : (
          <form
            className="createProductForm"
            onSubmit={updateUserSubmitHandler}
          >
            {/* NAME FIELD (Read Only) */}
            <div className="inputGroup disabledInput">
              <User />
              <input
                type="text"
                value={user && user.name ? user.name : ""}
                readOnly
                disabled
                className="readOnlyField"
              />
            </div>

            {/* EMAIL FIELD (Read Only) */}
            <div className="inputGroup disabledInput">
              <Mail />
              <input
                type="email"
                value={user && user.email ? user.email : ""}
                readOnly
                disabled
                className="readOnlyField"
              />
            </div>

            {/* ROLE FIELD (Editable) */}
            <div className="inputGroup">
              <Shield />
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Choose Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <button
              id="createProductBtn"
              type="submit"
              disabled={
                updateLoading ? true : false || role === "" ? true : false
              }
            >
              Update Role
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateUser;
