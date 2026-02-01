import React from "react";
import "../common/FooterPageLayout.css";

const Privacy = () => {
  return (
    <div className="fp-wrapper">
      <div className="fp-hero">
        <h1 className="fp-title">Privacy Policy</h1>
        <p className="fp-subtitle">
          This is a placeholder privacy page, tuned to the style of your kids
          clothing brand. Do not treat it as final legal copy.
        </p>
      </div>

      <div className="fp-content">
        <div className="fp-section">
          <p className="fp-section-text">
            A real privacy policy would explain what data you collect (like
            email, shipping address and order history), how it is stored and how
            customers can request access or deletion of their information.
          </p>
        </div>
        <div className="fp-section">
          <p className="fp-section-text">
            For development and design preview, this text is enough to show
            structure and layout. When you are close to launch, work with a
            legal advisor and replace this with a proper document.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
