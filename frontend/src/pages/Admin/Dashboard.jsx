import React, { useEffect } from "react";
import Sidebar from "../../components/Admin/Sidebar"; // Sahi path se import
import "./Dashboard.css";
import { useSelector, useDispatch } from "react-redux";
// Actions
import { getAdminProduct } from "../../features/productSlice";
import { getAllOrders } from "../../features/orderSlice";
import { getAllUsers } from "../../features/userSlice";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Charts Register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const dispatch = useDispatch();

  // Redux State se data le rahe hain
  const { products } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.orders || { orders: [] }); // Safe fallback
  const { users } = useSelector((state) => state.user);

  // --- Logic Start ---
  let outOfStock = 0;
  if (products) {
    products.forEach((item) => {
      if (item.stock === 0) outOfStock += 1;
    });
  }

  let totalAmount = 0;
  let deliveredOrders = 0;
  let processingOrders = 0;
  let shippedOrders = 0;

  if (orders) {
    orders.forEach((item) => {
      if (item.orderStatus === "Delivered") {
        totalAmount += item.totalPrice;
        deliveredOrders += 1;
      }
      if (item.orderStatus === "Processing") processingOrders += 1;
      if (item.orderStatus === "Shipped") shippedOrders += 1;
    });
  }
  // --- Logic End ---

  useEffect(() => {
    // Teeno actions call kar rahe hain taaki Dashboard bhara hua dikhe
    dispatch(getAdminProduct());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  // --- Chart Data ---
  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["#e74c3c"],
        hoverBackgroundColor: ["#c0392b"],
        data: [0, totalAmount],
        borderColor: "#e74c3c",
        fill: false,
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "In Stock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, products ? products.length - outOfStock : 0],
      },
    ],
  };

  const barState = {
    labels: ["Processing", "Shipped", "Delivered"],
    datasets: [
      {
        label: "Order Status",
        backgroundColor: ["#f1c40f", "#3498db", "#2ecc71"],
        data: [processingOrders, shippedOrders, deliveredOrders],
      },
    ],
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboardContainer">
        <h1>Admin Dashboard</h1>

        <div className="dashboardSummary">
          <div className="summaryCard blue">
            <p>Total Revenue</p>
            <h3>€{totalAmount.toLocaleString()}</h3>
          </div>
          <div className="summaryCard green">
            <p>Products</p>
            <h3>{products ? products.length : 0}</h3>
          </div>
          <div className="summaryCard purple">
            <p>Orders</p>
            <h3>{orders ? orders.length : 0}</h3>
          </div>
          <div className="summaryCard red">
            <p>Users</p>
            <h3>{users ? users.length : 0}</h3>
          </div>
        </div>

        <div className="charts-grid">
          <div className="lineChart">
            <h3>Financials</h3>
            <Line data={lineState} />
          </div>
          <div className="doughnutChart">
            <h3>Stock</h3>
            <Doughnut data={doughnutState} />
          </div>
          <div className="barChart">
            <h3>Order Status</h3>
            <Bar data={barState} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
