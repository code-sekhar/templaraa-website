import { useState } from "react";
import "./Faqs.css";
import faqImage from "../../assets/images/faq-image.png";

const faqItems = [
  {
    id: 1,
    question: "What is Templaraa?",
    answer:
      "Templaraa is a modern website template marketplace where users can discover clean, responsive, and professionally designed website templates for ecommerce, business, portfolio, studio, technology, and creative projects.",
  },
  {
    id: 2,
    question: "Can I use Templaraa templates for client projects?",
    answer:
      "Yes, you can use purchased templates for personal websites or client projects. Each template is structured to make customization easier for developers and designers.",
  },
  {
    id: 3,
    question: "Are the templates fully responsive?",
    answer:
      "Yes, Templaraa templates are designed to look great across desktop, tablet, and mobile devices with clean spacing, readable typography, and smooth responsive behavior.",
  },
  {
    id: 4,
    question: "Do I need coding knowledge to edit a template?",
    answer:
      "Basic knowledge of React, HTML, CSS, or JavaScript is helpful. The template files are organized clearly so you can update text, images, colors, layouts, and sections easily.",
  },
  {
    id: 5,
    question: "How do I download a purchased template?",
    answer:
      "After completing your purchase, you can access the template files from your account or download area. The package may include source files, assets, and setup instructions.",
  },
  {
    id: 6,
    question: "Can I become a seller on Templaraa?",
    answer:
      "Yes, developers and designers can apply to become sellers on Templaraa. After approval, sellers can publish high-quality website templates for customers.",
  },
];

function Faqs() {
  const [activeFaq, setActiveFaq] = useState(1);

  const handleFaqToggle = (id) => {
    setActiveFaq(id);
  };

  return (
    <main className="faq-page">
      <section className="faq-section">
        <div className="container-fluid faq-container">
          <div className="faq-breadcrumb">
            <a href="/" aria-label="Go to Templaraa home">
              <ion-icon name="home-outline"></ion-icon>
            </a>
            <span>/</span>
            <span>FAQs</span>
          </div>

          <div className="faq-layout">
            <div className="faq-content">
              <div className="faq-heading">
                <h1>Frequently Asked Questions</h1>

                <p>
                  Find quick answers about Templaraa templates, purchases,
                  customization, seller accounts, downloads, and support.
                </p>
              </div>

              <div className="faq-list">
                {faqItems.map((item) => {
                  const isActive = activeFaq === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`faq-item ${isActive ? "active" : ""}`}
                    >
                      <button
                        type="button"
                        className="faq-question"
                        onClick={() => handleFaqToggle(item.id)}
                        aria-expanded={isActive}
                      >
                        <span>{item.question}</span>

                        <ion-icon
                          name={isActive ? "remove-outline" : "add-outline"}
                        ></ion-icon>
                      </button>

                      <div className="faq-answer">
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="faq-image-area">
              <div className="faq-image-bg"></div>
              <img src={faqImage} alt="Templaraa FAQ support" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Faqs;