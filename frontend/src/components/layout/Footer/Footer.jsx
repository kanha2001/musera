import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
// import logo from "../../../assets/logo1.png"; // Image path adjust kiya hai agar future me chahiye ho
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
} from "lucide-react";

function Footer() {
  return (
    <footer className="ft-wrapper">
      <div className="ft-container">
        {/* TOP SECTION: BRAND & NEWSLETTER */}
        <div className="ft-top">
          <div className="ft-brand">
            <Link to="/" className="ft-logo-link">
              {/* <img src={logo} alt="Musera" className="ft-logo-img" /> */}
              <span className="ft-logo-text">MUSERA</span>
            </Link>
            <p className="ft-mission">
              Designing the future of comfort for the little ones. Sustainable
              fabrics, modern cuts, and pure joy.
            </p>
          </div>

          <div className="ft-newsletter">
            <h4 className="ft-heading">Join the Family</h4>
            <div className="ft-input-group">
              <input type="email" placeholder="Enter your email" />
              <button className="ft-arrow-btn">
                <ArrowRight size={20} />
              </button>
            </div>
            <p className="ft-subtext">Get 10% off your first order.</p>
          </div>
        </div>

        <div className="ft-divider"></div>

        {/* MIDDLE SECTION: LINKS */}
        <div className="ft-links-grid">
          {/* Column 1 */}
          <div className="ft-col">
            <h4 className="ft-heading">Shop</h4>
            <Link to="/newborn">Newborn (0-6M)</Link>
            <Link to="/baby">Baby (6-24M)</Link>
            <Link to="/toddler">Toddler (2-4Y)</Link>
            <Link to="/kids">Kids (4Y+)</Link>
            <Link to="/sale" className="ft-highlight">
              Sale
            </Link>
          </div>

          {/* Column 2 */}
          <div className="ft-col">
            <h4 className="ft-heading">Support</h4>
            <Link to="/track-order">Track Order</Link>
            <Link to="/returns">Returns & Exchanges</Link>
            <Link to="/shipping">Shipping Info</Link>
            <Link to="/size-guide">Size Guide</Link>
            <Link to="/contact">Contact Us</Link>
          </div>

          {/* Column 3 */}
          <div className="ft-col">
            <h4 className="ft-heading">Company</h4>
            <Link to="/about">Our Story</Link>
            <Link to="/sustainability">Sustainability</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>

          {/* Column 4: Contact & Social */}
          <div className="ft-col ft-contact-col">
            <h4 className="ft-heading">Get in Touch</h4>
            <p className="ft-address">
              85 Lake View Drive,
              <br />
              New York, NY 10011
            </p>
            <a href="mailto:hello@musera.com" className="ft-email">
              hello@musera.com
            </a>

            <div className="ft-socials">
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                target="_blank"
                rel="noreferrer"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://twitter.com"
                aria-label="Twitter"
                target="_blank"
                rel="noreferrer"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://linkedin.com"
                aria-label="LinkedIn"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="ft-divider"></div>

        {/* BOTTOM SECTION */}
        <div className="ft-bottom">
          <p className="ft-copyright">
            © {new Date().getFullYear()} Musera Inc. All rights reserved.
          </p>
          <div className="ft-payments">
            <span className="pay-icon">VISA</span>
            <span className="pay-icon">Mastercard</span>
            <span className="pay-icon">Amex</span>
            <span className="pay-icon">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
