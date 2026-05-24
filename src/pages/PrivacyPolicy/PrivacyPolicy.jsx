import { useMemo, useState } from "react";
import "./PrivacyPolicy.css";

const legalTabs = [
  {
    id: "terms",
    label: "Terms and Conditions",
    icon: "document-text-outline",
    updated: "Last updated · May 24, 2026",
    title: "Terms and Conditions",
    intro:
      "These Terms and Conditions explain the rules for using Templaraa, browsing templates, creating an account, purchasing digital products, and accessing seller or buyer services.",
    sections: [
      {
        title: "1. Acceptance of Terms",
        body:
          "By accessing Templaraa, creating an account, purchasing a template, downloading files, or using any part of our marketplace, you agree to follow these terms. If you do not agree with any part of these terms, you should not use the platform.",
      },
      {
        title: "2. Use of Our Platform",
        body:
          "Templaraa provides a digital marketplace where users can explore website templates, preview product details, save items, purchase templates, and connect with seller-related opportunities. You agree to use the platform only for lawful purposes and in a way that does not harm the service, sellers, buyers, or other users.",
      },
      {
        title: "3. Account Responsibility",
        body:
          "You are responsible for keeping your account login details secure. Any activity under your account will be treated as your responsibility. If you believe your account has been accessed without permission, you should contact our support team as soon as possible.",
        list: [
          "Use a valid email address when creating your account.",
          "Do not share your login credentials with unauthorized users.",
          "Keep your account information accurate and updated.",
          "Notify support if you notice suspicious account activity.",
        ],
      },
      {
        title: "4. Digital Product Access",
        body:
          "After a successful purchase, you may receive access to template files, documentation, images, and setup instructions depending on the product package. Because templates are digital products, access and download rules may vary based on the product and seller policy.",
      },
      {
        title: "5. Template Customization",
        body:
          "Templates sold on Templaraa are intended to be customized by developers, designers, agencies, and business owners. Basic knowledge of HTML, CSS, JavaScript, React, or the required framework may be needed to properly edit and deploy a template.",
      },
      {
        title: "6. Seller Rules",
        body:
          "Sellers must upload original work, accurate product descriptions, clean files, and preview images that represent the actual template. Templaraa may review, reject, pause, or remove any product that appears low-quality, misleading, copied, unsafe, or incomplete.",
      },
      {
        title: "7. Prohibited Activities",
        body:
          "Users may not copy, resell, redistribute, scrape, reverse engineer, abuse, or misuse any part of Templaraa. Any attempt to damage the platform, bypass security, upload harmful files, or misrepresent ownership of a product may result in account restriction or removal.",
      },
      {
        title: "8. Changes to Terms",
        body:
          "We may update these terms from time to time to improve clarity, reflect new services, or meet legal requirements. Continued use of Templaraa after changes means you accept the updated terms.",
      },
    ],
  },
  {
    id: "refund",
    label: "Refund Policy",
    icon: "receipt-outline",
    updated: "Last updated · May 24, 2026",
    title: "Refund Policy",
    intro:
      "This Refund Policy explains how refund requests are reviewed for digital templates, downloadable files, and marketplace purchases on Templaraa.",
    sections: [
      {
        title: "1. Digital Product Nature",
        body:
          "Templaraa sells digital products. Once a template is purchased and access or download is provided, the product cannot be returned like a physical item. For that reason, refunds are reviewed carefully and are not automatically guaranteed.",
      },
      {
        title: "2. Eligible Refund Cases",
        body:
          "A refund may be considered if the product has a serious technical issue, the downloaded files are missing important parts, the product is significantly different from its preview, or the seller fails to provide the promised core files.",
        list: [
          "The main template files are missing or unusable.",
          "The product preview and delivered files are substantially different.",
          "A critical bug prevents the template from running as described.",
          "Duplicate purchase happened by mistake and was reported quickly.",
        ],
      },
      {
        title: "3. Non-Refundable Cases",
        body:
          "Refunds are usually not provided when a buyer changes their mind, lacks the technical knowledge to edit the template, does not like the design after download, or purchased the wrong product without checking the description and preview.",
      },
      {
        title: "4. Review Process",
        body:
          "When a refund request is submitted, our support team may ask for screenshots, error messages, purchase details, and a short explanation. We may also contact the seller to verify the issue before making a decision.",
      },
      {
        title: "5. Time Limit",
        body:
          "Refund requests should be submitted within a reasonable time after purchase. Requests made long after download or after extensive use of the template may be declined.",
      },
      {
        title: "6. Partial Refunds",
        body:
          "In some cases, a partial refund or store credit may be offered if the product is mostly usable but has a minor issue that cannot be resolved quickly.",
      },
      {
        title: "7. How to Request a Refund",
        body:
          "To request a refund, contact support with your order email, product name, purchase date, and a clear explanation of the issue. We aim to respond as quickly as possible.",
      },
    ],
  },
  {
    id: "privacy",
    label: "Privacy Policy",
    icon: "shield-checkmark-outline",
    updated: "Last updated · May 24, 2026",
    title: "Privacy Policy",
    intro:
      "This Privacy Policy explains how Templaraa collects, uses, stores, and protects information when you browse the website, create an account, purchase templates, or contact support.",
    cards: [
      {
        title: "Account Details",
        text: "Name, email address, role type, login details, and profile information used to manage your account.",
      },
      {
        title: "Order Information",
        text: "Template purchases, download access, order history, invoice data, and support references.",
      },
      {
        title: "Usage Data",
        text: "Pages visited, search terms, product views, device details, browser type, and interaction signals.",
      },
      {
        title: "Support Data",
        text: "Messages, questions, attachments, and communication details shared when contacting our team.",
      },
    ],
    sections: [
      {
        title: "1. Information We Collect",
        body:
          "We collect information that helps us provide account access, template downloads, buyer support, seller review, marketplace security, and product recommendations. This may include personal details, technical usage data, purchase records, and communication history.",
      },
      {
        title: "2. How We Use Your Data",
        body:
          "Your information is used to operate Templaraa, deliver purchased templates, improve user experience, prevent fraud, provide support, and maintain a safe marketplace for buyers and sellers.",
        list: [
          "Create and manage your Templaraa account.",
          "Process template purchases and download access.",
          "Provide support for account, purchase, and product issues.",
          "Improve search, product discovery, and marketplace quality.",
          "Protect the platform from fraud, spam, and unauthorized access.",
        ],
      },
      {
        title: "3. Payment Information",
        body:
          "Payment processing may be handled by secure third-party payment providers. Templaraa does not intentionally store full card numbers or sensitive payment credentials on its own servers.",
      },
      {
        title: "4. Cookies and Analytics",
        body:
          "We may use cookies and analytics tools to understand website performance, remember preferences, improve navigation, and provide a smoother marketplace experience. You can manage cookies from your browser settings.",
      },
      {
        title: "5. Data Sharing",
        body:
          "We do not sell your personal information. Data may be shared only with trusted service providers, payment processors, hosting providers, legal authorities when required, or sellers where necessary to complete marketplace services.",
      },
      {
        title: "6. Data Retention",
        body:
          "We keep data only as long as needed for account management, order history, legal compliance, security, and support. Some records may be retained for accounting, fraud prevention, or dispute resolution.",
      },
      {
        title: "7. Your Privacy Rights",
        body:
          "Depending on your location, you may request access, correction, deletion, export, or restriction of your personal data. You can contact us to exercise these rights.",
      },
      {
        title: "8. Security",
        body:
          "We use reasonable technical and organizational measures to protect user data. However, no online platform can guarantee absolute security, so users should also keep their login details safe.",
      },
      {
        title: "9. Contact Us",
        body:
          "For privacy-related questions, contact our support team at support@templaraa.com. We will review your request and respond as soon as reasonably possible.",
      },
    ],
  },
  {
    id: "cookie",
    label: "Cookie Policy",
    icon: "settings-outline",
    updated: "Last updated · May 24, 2026",
    title: "Cookie Policy",
    intro:
      "This Cookie Policy explains how Templaraa uses cookies and similar technologies to improve browsing, remember preferences, analyze performance, and support marketplace features.",
    sections: [
      {
        title: "1. What Are Cookies?",
        body:
          "Cookies are small files stored on your device when you visit a website. They help websites remember actions, preferences, sessions, and technical details that make browsing smoother.",
      },
      {
        title: "2. Types of Cookies We Use",
        body:
          "Templaraa may use essential cookies, preference cookies, analytics cookies, and security cookies. These help keep you signed in, improve loading behavior, understand product interest, and protect the platform from abuse.",
        list: [
          "Essential cookies for login sessions and core website features.",
          "Preference cookies for remembering selected options and UI behavior.",
          "Analytics cookies for understanding traffic and product engagement.",
          "Security cookies for detecting suspicious activity and preventing abuse.",
        ],
      },
      {
        title: "3. Essential Cookies",
        body:
          "Essential cookies are required for basic website functionality. Without them, some parts of Templaraa such as account access, cart behavior, or secure browsing may not work properly.",
      },
      {
        title: "4. Analytics Cookies",
        body:
          "Analytics cookies help us understand how users interact with pages, templates, categories, search, and product details. This information helps us improve the marketplace experience.",
      },
      {
        title: "5. Third-Party Cookies",
        body:
          "Some third-party services such as analytics providers, embedded content, or payment tools may place cookies according to their own policies. We recommend reviewing their policies for more details.",
      },
      {
        title: "6. Managing Cookies",
        body:
          "You can control or delete cookies from your browser settings. Blocking some cookies may affect website functionality, account sessions, or product browsing experience.",
      },
      {
        title: "7. Updates to This Policy",
        body:
          "We may update this Cookie Policy when our website, tools, or legal requirements change. The updated date at the top of this page will reflect the latest version.",
      },
    ],
  },
];

function PrivacyPolicy() {
  const [activeTab, setActiveTab] = useState("privacy");

  const activeContent = useMemo(() => {
    return legalTabs.find((tab) => tab.id === activeTab) || legalTabs[2];
  }, [activeTab]);

  const handlePrint = () => {
    window.print();
  };

  const handleContact = () => {
    window.location.href = "mailto:support@templaraa.com";
  };

  return (
    <main className="legal-page">
      <section className="legal-hero">
        <div className="container-fluid legal-container">
          <div className="legal-hero-content">
            <span className="legal-kicker">Legal Center</span>

            <h1>
              Terms, Policies & <span>Legal Clarity</span>
            </h1>

            <p>
              We believe in transparency. Here you will find detailed
              information about how Templaraa works, how we protect your data,
              and the rules that keep our template marketplace safe.
            </p>
          </div>
        </div>
      </section>

      <section className="legal-section">
        <div className="container-fluid legal-container">
          <div className="legal-layout">
            <aside className="legal-sidebar">
              <div className="legal-tabs-card">
                {legalTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`legal-tab ${
                      activeTab === tab.id ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <ion-icon name={tab.icon}></ion-icon>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="legal-help-card">
                <h3>Need help?</h3>
                <p>
                  Have questions about our policies? Our support team is ready
                  to help with account, purchase, seller, and template issues.
                </p>

                <button type="button" onClick={handleContact}>
                  Contact Support
                  <ion-icon name="arrow-forward-outline"></ion-icon>
                </button>
              </div>
            </aside>

            <article className="legal-content-card">
              <div className="legal-content-header">
                <div className="legal-title-icon">
                  <ion-icon name={activeContent.icon}></ion-icon>
                </div>

                <div>
                  <span>{activeContent.updated}</span>
                  <h2>{activeContent.title}</h2>
                </div>
              </div>

              <div className="legal-intro">
                <p>{activeContent.intro}</p>
              </div>

              {activeContent.cards && (
                <div className="legal-info-grid">
                  {activeContent.cards.map((card) => (
                    <div className="legal-info-card" key={card.title}>
                      <h4>{card.title}</h4>
                      <p>{card.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="legal-body">
                {activeContent.sections.map((section) => (
                  <section className="legal-body-section" key={section.title}>
                    <h3>{section.title}</h3>
                    <p>{section.body}</p>

                    {section.list && (
                      <ul>
                        {section.list.map((item) => (
                          <li key={item}>
                            <ion-icon name="checkmark-circle"></ion-icon>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>

              <div className="legal-security-box">
                <div className="legal-security-icon">
                  <ion-icon name="lock-closed-outline"></ion-icon>
                </div>

                <div>
                  <h4>Secure Marketplace Standard</h4>
                  <p>
                    Templaraa uses careful access controls, secure workflows,
                    and marketplace review practices to protect users, sellers,
                    products, and purchase information.
                  </p>
                </div>
              </div>

              <div className="legal-card-footer">
                <p>Still have legal questions?</p>

                <div className="legal-footer-actions">
                  <button type="button" onClick={handlePrint}>
                    <ion-icon name="print-outline"></ion-icon>
                    Print this page
                  </button>

                  <button type="button" onClick={handleContact}>
                    Contact Legal Team
                    <ion-icon name="arrow-forward-outline"></ion-icon>
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PrivacyPolicy;