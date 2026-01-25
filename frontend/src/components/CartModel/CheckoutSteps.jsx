import React from "react";
import { Truck, CheckCircle, CreditCard } from "lucide-react";
import "./CheckoutSteps.css";

const CheckoutSteps = ({ activeStep }) => {
  const steps = [
    { label: "Shipping", icon: <Truck size={20} /> },
    { label: "Confirm Order", icon: <CheckCircle size={20} /> },
    { label: "Payment", icon: <CreditCard size={20} /> },
  ];

  return (
    <div className="checkout-steps">
      {steps.map((item, index) => (
        <div
          key={index}
          className={`step-item ${activeStep >= index ? "active" : ""}`}
        >
          <div className="step-icon">{item.icon}</div>
          <span className="step-label">{item.label}</span>
          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`step-line ${activeStep > index ? "active-line" : ""}`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckoutSteps;
