import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  PackagePlus,
  ListOrdered,
  Users,
  Star,
  ShoppingBag,
} from "lucide-react";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/" className="sidebar-brand">
        <h2>Musera Admin</h2>
      </Link>

      <div className="sidebar-menu">
        <Link to="/admin/dashboard" className="sidebar-item">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        <div className="sidebar-heading">Products</div>
        <Link to="/admin/products" className="sidebar-item">
          <ShoppingBag size={20} />
          <span>All Products</span>
        </Link>
        <Link to="/admin/product/new" className="sidebar-item">
          <PackagePlus size={20} />
          <span>Create Product</span>
        </Link>

        <div className="sidebar-heading">Management</div>
        <Link to="/admin/orders" className="sidebar-item">
          <ListOrdered size={20} />
          <span>Orders</span>
        </Link>
        <Link to="/admin/users" className="sidebar-item">
          <Users size={20} />
          <span>Users</span>
        </Link>
        {/* <Link to="/admin/reviews" className="sidebar-item">
          <Star size={20} />
          <span>Reviews</span>
        </Link> */}
      </div>
    </div>
  );
};

export default Sidebar;
