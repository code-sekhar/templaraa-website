import { useState } from "react";
import "./Contact.css";

const contactInfo = [
  {
    id: 1,
    icon: "mail-outline",
    title: "Email Us",
    text: "support@templaraa.com",
    link: "mailto:support@templaraa.com",
  },
  {
    id: 2,
    icon: "call-outline",
    title: "Call Us",
    text: "+1 (009) 544-7818",
    link: "tel:+10095447818",
  },
  {
    id: 3,
    icon: "location-outline",
    title: "Location",
    text: "West Bengal, India",
    link: "#templaraa-map",
  },
];

function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    setSuccessMessage("");
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!formData.subject.trim()) {
      nextErrors.subject = "Subject is required.";
    }

    if (!formData.message.trim()) {
      nextErrors.message = "Message is required.";
    } else if (formData.message.trim().length < 10) {
      nextErrors.message = "Message must be at least 10 characters.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSuccessMessage("Thank you! Your message has been submitted successfully.");

    setFormData({
      fullName: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const renderError = (key) => {
    if (!errors[key]) {
      return null;
    }

    return <p className="contact-field-error">{errors[key]}</p>;
  };

  return (
    <main className="contact-page">
      <section className="contact-section">
        <div className="container-fluid contact-container">
          <div className="contact-breadcrumb">
            <a href="/" aria-label="Go to Templaraa home">
              <ion-icon name="home-outline"></ion-icon>
            </a>

            <span>/</span>
            <span>Contact</span>
          </div>

          <div className="contact-layout">
            <div className="contact-left">
              <h1>
                Let’s Talk About <span>Your Template Needs</span>
              </h1>

              <p>
                Have questions about Templaraa templates, purchases, seller
                accounts, customization, or support? Send us a message and our
                team will get back to you as soon as possible.
              </p>

              <div className="contact-info-list">
                {contactInfo.map((item) => (
                  <a
                    key={item.id}
                    href={item.link}
                    className="contact-info-card"
                  >
                    <span className="contact-info-icon">
                      <ion-icon name={item.icon}></ion-icon>
                    </span>

                    <span className="contact-info-content">
                      <strong>{item.title}</strong>
                      <small>{item.text}</small>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="contact-right">
              <form
                className="contact-form-card"
                onSubmit={handleFormSubmit}
                noValidate
                autoComplete="off"
              >
                <div className="contact-form-heading">
                  <h2>Send Message</h2>
                  <p>Fill out the form below and we will respond shortly.</p>
                </div>

                <div className="contact-field">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    placeholder="Enter your full name"
                    className={errors.fullName ? "error" : ""}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                  {renderError("fullName")}
                </div>

                <div className="contact-field">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="abc@xyz.com"
                    className={errors.email ? "error" : ""}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                  {renderError("email")}
                </div>

                <div className="contact-field">
                  <label htmlFor="subject">Subject</label>
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    placeholder="How can we help?"
                    className={errors.subject ? "error" : ""}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                  {renderError("subject")}
                </div>

                <div className="contact-field">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    placeholder="Write your message here..."
                    className={errors.message ? "error" : ""}
                    onChange={handleInputChange}
                  ></textarea>
                  {renderError("message")}
                </div>

                {successMessage && (
                  <p className="contact-success-message">{successMessage}</p>
                )}

                <button type="submit" className="contact-submit-button">
                  Send Message
                  <ion-icon name="arrow-forward-outline"></ion-icon>
                </button>
              </form>
            </div>
          </div>

          <div className="contact-google-map-section" id="templaraa-map">
            <div className="google-map-card">
              <div className="google-map-frame">
                <iframe
                title="Templaraa location map - West Bengal India"
                src="https://www.google.com/maps?q=West%20Bengal%2C%20India&ll=22.9868,87.8550&z=4&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                ></iframe>

                <div className="google-map-overlay-top">
                  <div className="map-brand-box">
                    
                  </div>

                  <a
                    href="https://www.google.com/maps/search/?api=1&query=West+Bengal+India"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-open-button"
                  >
                    Open Map
                    <ion-icon name="open-outline"></ion-icon>
                  </a>
                </div>

                <div className="google-map-location-card">
                  <span className="google-map-location-icon">
                    <ion-icon name="business-outline"></ion-icon>
                  </span>

                  <div>
                    <strong>Templaraa Digital Marketplace</strong>
                    <p>Located in West Bengal, India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;