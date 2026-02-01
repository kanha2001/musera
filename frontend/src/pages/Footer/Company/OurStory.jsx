import React from "react";
import "../common/FooterPageLayout.css";

const OurStory = () => {
  return (
    <div className="fp-wrapper">
      <div className="fp-hero">
        <h1 className="fp-title">Our Story</h1>
        <p className="fp-subtitle">
          Musera is a playful little universe for kids who live in soft tees,
          roomy joggers and everyday dresses that keep up with their energy.
        </p>
      </div>

      <div className="fp-content">
        <div className="fp-section">
          <p className="fp-section-text">
            The idea behind Musera is simple: parents should not have to choose
            between comfort, quality and design. We imagine every outfit from
            the point of view of a child, then make it easy for grown‑ups to
            shop in a calm, clutter‑free way.
          </p>
        </div>
        <div className="fp-section">
          <p className="fp-section-text">
            This page is a sample narrative crafted just for your project, based
            on the warm, minimal aesthetic of your current website. You can
            later replace it with your real founding story and team details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OurStory;
