import React from "react";
import "../common/FooterPageLayout.css";

const Careers = () => {
  return (
    <div className="fp-wrapper">
      <div className="fp-hero">
        <h1 className="fp-title">Careers</h1>
        <p className="fp-subtitle">
          Musera is imagined as a small, thoughtful team building everyday
          comfort for kids — and a calm shopping experience for parents.
        </p>
      </div>

      <div className="fp-content">
        <div className="fp-section">
          <h3 className="fp-section-title">Work at a kids-first brand</h3>
          <p className="fp-section-text">
            From fabric selection to product photography, every decision at
            Musera starts with a simple question: “Will this feel good for a
            child to wear every day?” This page is a demo, but it reflects the
            kind of roles you might open in design, operations and customer
            care.
          </p>
        </div>

        <div className="fp-section">
          <h3 className="fp-section-title">Sample roles you could list here</h3>
          <p className="fp-section-text">
            • Product & Merchandising – planning age‑wise collections and
            drops.  
            • Brand & Content – shooting lookbooks, writing copy that feels
            warm and simple.  
            • Customer Experience – helping parents with sizing, shipping and
            returns in a friendly way.
          </p>
        </div>

        <div className="fp-section">
          <h3 className="fp-section-title">How to apply (demo)</h3>
          <p className="fp-section-text">
            When you are ready to hire, you can list open roles here or link to
            a separate careers form. For now, consider this page a placeholder
            that shows structure and tone; no real applications are collected.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Careers;
