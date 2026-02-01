import React from "react";
import { Link } from "react-router-dom";
import "./ShopPages.css";

const newbornProducts = [
  {
    id: 1,
    name: "CloudSoft Kimono Set",
    tag: "Organic Cotton",
    price: "€24",
  },
  {
    id: 2,
    name: "Snuggle Wrap Swaddle",
    tag: "Breathable Muslin",
    price: "€19",
  },
  {
    id: 3,
    name: "Dreamy Sleep Suit",
    tag: "0–6M • Unisex",
    price: "€29",
  },
  {
    id: 4,
    name: "First Hugs Bodysuit Pack",
    tag: "Pack of 3",
    price: "€32",
  },
];

const Newborn = () => {
  return (
    <div className="shop-page-wrapper">
      <div className="shop-page-header">
        <h1 className="shop-page-title">Newborn (0–6M)</h1>
        <p className="shop-page-subtitle">
          Feather–soft essentials designed for newborn skin — nothing itchy,
          nothing fussy, only pure comfort.
        </p>
      </div>

      <div className="shop-products-grid">
        {newbornProducts.map((item) => (
          <div key={item.id} className="shop-card">
            <div className="shop-card-image">Newborn style</div>
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
};

export default Newborn;
