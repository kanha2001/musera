import React, { useState } from "react";
import "./Shipping.css";
import { useSelector, useDispatch } from "react-redux";
import { saveShippingInfo } from "../../features/cartSlice";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../../components/CartModel/CheckoutSteps"; // Path check karlena
import { Home, MapPin, Globe, Phone, Building } from "lucide-react";
import { toast } from "react-toastify";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // LocalStorage/Redux se saved info nikalo
  const { shippingInfo } = useSelector((state) => state.cart || {});

  const [address, setAddress] = useState(shippingInfo.address || "");
  const [city, setCity] = useState(shippingInfo.city || "");
  const [state, setState] = useState(shippingInfo.state || "");
  const [country, setCountry] = useState(shippingInfo.country || "");
  const [pinCode, setPinCode] = useState(shippingInfo.pinCode || "");
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || "");

  const shippingSubmit = (e) => {
    e.preventDefault();

    if (phoneNo.length < 10) {
      toast.error("Phone Number must be valid");
      return;
    }

    // Save Data
    dispatch(
      saveShippingInfo({ address, city, state, country, pinCode, phoneNo })
    );

    // Go to Next Step
    navigate("/order/confirm");
  };

  return (
    <div className="shipping-container">
      {/* Active Step 0 = Shipping */}
      <CheckoutSteps activeStep={0} />

      <div className="shipping-box">
        <h2 className="shipping-heading">Shipping Details</h2>

        <form className="shipping-form" onSubmit={shippingSubmit}>
          <div className="form-group">
            <Home size={20} />
            <input
              type="text"
              placeholder="Address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="form-group">
            <Building size={20} />
            <input
              type="text"
              placeholder="City"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="form-group">
            <MapPin size={20} />
            <input
              type="number"
              placeholder="Pin Code"
              required
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
            />
          </div>

          <div className="form-group">
            <Phone size={20} />
            <input
              type="number"
              placeholder="Phone Number"
              required
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
            />
          </div>

          <div className="form-group">
            <Globe size={20} />
            <select
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Select Country</option>
              <option value="IN">India</option>
              <option value="US">USA</option>
              <option value="UK">UK</option>
              <option value="NL">Netherlands</option>
            </select>
          </div>

          {country && (
            <div className="form-group">
              <MapPin size={20} />
              <input
                type="text"
                placeholder="State"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          )}

          <button type="submit" className="shipping-btn">
            CONTINUE
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
