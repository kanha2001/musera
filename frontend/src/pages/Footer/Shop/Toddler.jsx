import React from "react";
import { Link } from "react-router-dom";
import "./ShopPages.css";

const babyProducts = [
  { id: 1, name: "Playday Romper", tag: "6–24M • Easy-on", price: "€26" },
  { id: 2, name: "Everyday Leggings", tag: "2-pack", price: "€22" },
  { id: 3, name: "Sunny Day Tee", tag: "Soft jersey", price: "€15" },
  { id: 4, name: "Nap Time Set", tag: "Top + Bottom", price: "€28" },
];

const Baby = () => (
  <div className="shop-page-wrapper">
    <div className="shop-page-header">
      <h1 className="shop-page-title">Toddler (2–4Y)</h1>
      <p className="shop-page-subtitle">
        Mix-and-match outfits that move with every crawl, wobble and first
        step.
      </p>
    </div>

    <div className="shop-products-grid">
      {babyProducts.map((item) => (
        <div key={item.id} className="shop-card">
          <div className="shop-card-image">Baby outfit</div>
          <div className="shop-card-name">{item.name}</div>
          <div className="shop-card-meta">{item.tag}</div>
          <div className="shop-card-price-row">
            <span className="shop-card-price">{item.price}</span>
            <span className="shop-card-badge">Sample</span>
          </div>
        </div>
      ))}
    </div>

    <div className="shop-page-link-row">
      <Link to="/shop">View all products</Link>
    </div>
  </div>
);

export default Baby;
