import React from "react";
import "./SupportPages.css";

const Returns = () => {
  return (
    <div className="support-page-wrapper">
      <div className="support-header">
        <h1 className="support-title">Returns & Exchanges</h1>
        <p className="support-subtitle">
          We design pieces to be loved. But if something does not feel quite
          right, this sample policy shows how returns could work on Musera.
        </p>
      </div>

      <div className="support-card">
        <div className="fp-section">
          <p className="fp-section-text">
            • You can request a return within 15 days of delivery for unworn,
            unwashed items with tags intact.  
            • For hygiene reasons, innerwear and
            personalized items would usually be non‑returnable.  
            • Refunds are
            typically processed as store credit once the item passes a quick
            quality check.
          </p>
        </div>
        <div className="fp-section">
          <p className="fp-section-text">
            This page is a dummy version for design and flow. The final policy
            will depend on how you structure inventory and logistics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Returns;
