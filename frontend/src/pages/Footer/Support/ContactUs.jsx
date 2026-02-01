import React, { useState } from "react";
import "./ContactPage.css";

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      "Demo only: in the live version this form will send your message to the Musera support team."
    );
  };

  return (
    <div className="ct-wrapper">
      <div className="ct-header">
        <h1 className="ct-title">Contact Us</h1>
        <p className="ct-subtitle">
          Questions about an order, size or fabric? Reach out — this is a demo
          contact page showing how Musera support could feel.
        </p>
      </div>

      <div className="ct-card">
        <div className="ct-grid">
          {/* LEFT: FORM */}
          <form className="ct-form" onSubmit={handleSubmit}>
            <div className="ct-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Parent or guardian name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="ct-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="ct-field">
              <label htmlFor="topic">Topic</label>
              <select
                id="topic"
                name="topic"
                value={form.topic}
                onChange={handleChange}
              >
                <option value="">Select a topic</option>
                <option value="order">Order or delivery</option>
                <option value="size">Size & fit</option>
                <option value="product">Product question</option>
                <option value="other">Something else</option>
              </select>
            </div>

            <div className="ct-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                placeholder="Share a few details so we can help faster…"
                value={form.message}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="ct-submit">
              Submit message
            </button>
          </form>

          {/* RIGHT: INFO */}
          <div className="ct-info">
            <h3>Customer Care</h3>
            <p>
              Email: <strong>care@musera.com</strong>
            </p>
            <p>
              Phone: <strong>+91-90000-00000</strong>
              <br />
              Mon–Sat, 10:00 am – 6:00 pm IST
            </p>
            <p>
              WhatsApp (demo): <strong>+91-90000-00001</strong>
              <br />
              Replies within 24 hours on business days.
            </p>
            <p className="ct-info-block">
              Postal address (sample):
              <br />
              85 Lake View Drive, New York, NY 10011
            </p>
            <p className="ct-note">
              This page is only for layout in your current project — no real
              support tool is connected yet. Later you can hook this form to an
              API, email service or helpdesk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
