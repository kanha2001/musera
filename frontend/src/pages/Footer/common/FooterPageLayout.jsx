import React from "react";
import "./FooterPageLayout.css";

const FooterPageLayout = ({ title, subtitle, children }) => {
  return (
    <div className="fp-wrapper">
      <div className="fp-hero">
        <h1 className="fp-title">{title}</h1>
        {subtitle && <p className="fp-subtitle">{subtitle}</p>}
      </div>

      <div className="fp-content">
        {children || (
          <p className="fp-dummy-text">
            This is a placeholder page for <strong>{title}</strong>. Content
            will be added soon.
          </p>
        )}
      </div>
    </div>
  );
};

export default FooterPageLayout;
