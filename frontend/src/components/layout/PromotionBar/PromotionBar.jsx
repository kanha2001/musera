import React, { useEffect, useState } from "react";
import "./PromotionBar.css";

const promos = [
  "On purchase above €500 get 50% OFF!",
  "Free shipping for orders above €1000!",
  "New Arrivals! Kids Fashion up to 70% OFF!",
];

function PromotionBar() {
  const [idx, setIdx] = useState(0);
  const [animClass, setAnimClass] = useState("promo-enter"); // Start with enter

  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Text ko Left bhejo (Exit)
      setAnimClass("promo-exit");

      setTimeout(() => {
        // 2. Text badlo aur Right se wapis lao (Enter)
        setIdx((prev) => (prev + 1) % promos.length);
        setAnimClass("promo-enter");
      }, 500); // Animation time 0.5s hai
    }, 3000); // 3 seconds rukega

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="promotion-bar">
      <div className={`promo-text ${animClass}`}>{promos[idx]}</div>
    </div>
  );
}

export default PromotionBar;
