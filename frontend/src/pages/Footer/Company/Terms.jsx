import React from "react";
import "../common/FooterPageLayout.css";

const Terms = () => {
  return (
    <div className="fp-wrapper">
      <div className="fp-hero">
        <h1 className="fp-title">Terms of Service</h1>
        <p className="fp-subtitle">
          These sample terms are written just to support your UI. Replace them
          with real legal text before going live.
        </p>
      </div>

      <div className="fp-content">
        <div className="fp-section">
          <p className="fp-section-text">
            Musera is currently in a demo state. Any reference to orders,
            payments or delivery on this site is for illustration only and does
            not represent a real commercial transaction.
          </p>
        </div>
        <div className="fp-section">
          <p className="fp-section-text">
            In production, this page would describe how customers can use the
            website, acceptable behaviour, limitations of liability and other
            standard ecommerce terms tailored to your business and jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
