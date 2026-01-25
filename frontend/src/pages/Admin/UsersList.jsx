import React, { useEffect } from "react";
import "./UsersList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Edit, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import Sidebar from "../../components/Admin/Sidebar";
import Loader from "../../components/Loader/Loader";
import {
  getAllUsers,
  deleteUser,
  clearErrors,
  resetProfile, // Ye action use hoga delete reset ke liye
} from "../../features/userSlice";

const UsersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, users, loading } = useSelector((state) => state.allUsers); // Store check karein
  const {
    error: deleteError,
    isDeleted,
    message,
  } = useSelector((state) => state.profile);

  const deleteUserHandler = (id) => {
    Swal.fire({
      title: "Delete User?",
      text: "User will be removed permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete user!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteUser(id));
      }
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      Swal.fire("Deleted!", message, "success");
      navigate("/admin/users");
      dispatch(resetProfile());
      dispatch(getAllUsers()); // Refresh List
    }

    dispatch(getAllUsers());
  }, [dispatch, error, deleteError, isDeleted, navigate, message]);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="productListContainer">
        <div className="productListHeader">
          <h1 id="productListHeading">All Users</h1>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="productTableContainer">
            <table className="productTable">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users.map((item) => (
                    <tr key={item._id}>
                      <td style={{ fontFamily: "monospace" }}>{item._id}</td>
                      <td>{item.email}</td>
                      <td>{item.name}</td>

                      <td>
                        <span
                          className={`statusLabel ${
                            item.role === "admin" ? "greenColor" : "blueColor"
                          }`}
                        >
                          {item.role}
                        </span>
                      </td>

                      <td>
                        <div className="actionButtons">
                          <Link to={`/admin/user/${item._id}`}>
                            <Edit size={20} color="#3498db" />
                          </Link>
                          <button onClick={() => deleteUserHandler(item._id)}>
                            <Trash2 size={20} color="#e74c3c" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {users && users.length === 0 && (
              <p className="noProducts">No Users Found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;
