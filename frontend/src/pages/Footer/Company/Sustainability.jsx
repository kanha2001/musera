import React from "react";
import "../common/FooterPageLayout.css";

const Sustainability = () => {
  return (
    <div className="fp-wrapper">
      <div className="fp-hero">
        <h1 className="fp-title">Sustainability</h1>
        <p className="fp-subtitle">
          Little wardrobes, lighter footprint — this is the mindset that inspires
          the Musera collection.
        </p>
      </div>

      <div className="fp-content">
        <div className="fp-section">
          <p className="fp-section-text">
            In a future version of Musera, fabrics would be carefully chosen,
            packaging kept minimal and reusable, and production partners picked
            for fair working conditions. This dummy page mirrors how those
            promises could be explained to parents.
          </p>
        </div>
        <div className="fp-section">
          <p className="fp-section-text">
            For now, all the text here is placeholder content tailored for your
            brand’s tone — you can swap it later with real certifications,
            sourcing details and care tips.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sustainability;
