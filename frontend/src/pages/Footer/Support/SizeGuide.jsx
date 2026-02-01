import React from "react";
import "./SupportPages.css";

const SizeGuide = () => {
  return (
    <div className="support-page-wrapper">
      <div className="support-header">
        <h1 className="support-title">Size Guide</h1>
        <p className="support-subtitle">
          A quick reference so parents can roughly choose the right size. These
          are sample values – you can plug in your final chart later.
        </p>
      </div>

      <div className="support-card">
        <table className="size-table">
          <thead>
            <tr>
              <th>Age</th>
              <th>Height (cm)</th>
              <th>Chest (cm)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0–6M</td>
              <td>56–66</td>
              <td>40–44</td>
            </tr>
            <tr>
              <td>6–12M</td>
              <td>66–76</td>
              <td>44–48</td>
            </tr>
            <tr>
              <td>1–2Y</td>
              <td>76–88</td>
              <td>48–52</td>
            </tr>
            <tr>
              <td>2–4Y</td>
              <td>88–104</td>
              <td>52–56</td>
            </tr>
            <tr>
              <td>4–6Y</td>
              <td>104–116</td>
              <td>56–60</td>
            </tr>
          </tbody>
        </table>

        <p className="fp-section-text" style={{ marginTop: "12px" }}>
          We always recommend choosing the larger size if your child is in
          between measurements, so they can grow into the outfit comfortably.
        </p>
      </div>
    </div>
  );
};

export default SizeGuide;
