import React from "react";
import "./SupportPages.css";

const ShippingInfo = () => {
  return (
    <div className="support-page-wrapper">
      <div className="support-header">
        <h1 className="support-title">Shipping Info</h1>
        <p className="support-subtitle">
          A simple sample of how delivery timelines and charges could look for a
          kidswear brand like Musera.
        </p>
      </div>

      <div className="support-card">
        <div className="fp-section">
          <p className="fp-section-text">
            • Standard delivery: 3–7 business days within India, depending on
            pin code.  
            • Free shipping above a certain order value, and a small
            flat fee for smaller orders.  
            • Once shipped, customers receive a tracking
            link via email and SMS.
          </p>
        </div>
        <div className="fp-section">
          <p className="fp-section-text">
            These details are placeholders to match your UI. Actual charges and
            carriers can be configured in your backend later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
