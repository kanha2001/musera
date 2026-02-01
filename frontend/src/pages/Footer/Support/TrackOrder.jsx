import React, { useState } from "react";
import "./SupportPages.css";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setSearched(true);
  };

  return (
    <div className="support-page-wrapper">
      <div className="support-header">
        <h1 className="support-title">Track Order</h1>
        <p className="support-subtitle">
          Enter your Musera order ID to see a sample status. This is a dummy
          tracker for now.
        </p>
      </div>

      <div className="support-card">
        <form className="support-form" onSubmit={handleSubmit}>
          <label className="support-label">Order ID</label>
          <input
            type="text"
            placeholder="#MUS123456"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <button type="submit">Track Order</button>
        </form>

        {searched && (
          <div className="track-result">
            <p className="track-id">
              Showing dummy status for: <span>{orderId}</span>
            </p>
            <p className="track-status">Status: Packed & ready to ship</p>
            <p className="track-meta">Estimated delivery: 3–5 business days</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
