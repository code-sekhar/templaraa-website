import { useState } from "react";
import "./About.css";

import aboutHeroShape from "../../assets/images/about-hero-shape.png";

import serviceImgOne from "../../assets/images/about-service-01.png";
import serviceImgTwo from "../../assets/images/about-service-02.png";
import serviceImgThree from "../../assets/images/about-service-03.png";
import serviceImgFour from "../../assets/images/about-service-04.png";
import serviceImgFive from "../../assets/images/about-service-05.png";
import serviceImgSix from "../../assets/images/about-service-06.png";
import serviceImgSeven from "../../assets/images/about-service-07.png";

import JoinOpportunity from "../../components/JoinOpportunity/JoinOpportunity";

const serviceCards = [
  {
    id: 1,
    title: "Launch-ready Templates",
    description:
      "Discover polished website templates built for creators, startups, and agencies who want to launch faster with less design and development effort.",
    featured: true,
    icon: "grid-outline",
  },
  {
    id: 2,
    title: "Instant Deployment",
    description:
      "Use clean, structured, and responsive frontend layouts prepared for smooth integration, publishing, and future backend connection.",
    featured: false,
    icon: "rocket-outline",
  },
  {
    id: 3,
    title: "Complete Website Kits",
    description:
      "Get complete page sections, reusable layouts, product cards, landing pages, and business-ready components in one organized package.",
    featured: false,
    icon: "layers-outline",
  },
  {
    id: 4,
    title: "Creator Marketplace",
    description:
      "Templaraa helps designers and developers present their digital products beautifully and connect with buyers looking for ready-made solutions.",
    featured: false,
    icon: "storefront-outline",
  },
  {
    id: 5,
    title: "Trusted Support",
    description:
      "From product structure to presentation flow, our platform is designed to support sellers and buyers with a clear digital marketplace experience.",
    featured: false,
    icon: "chatbubbles-outline",
  },
];

const archiveCards = [
  {
    id: 1,
    image: serviceImgOne,
    className: "about-card-1",
  },
  {
    id: 2,
    image: serviceImgTwo,
    className: "about-card-2",
  },
  {
    id: 3,
    image: serviceImgThree,
    className: "about-card-3",
  },
  {
    id: 4,
    image: serviceImgFour,
    className: "about-card-4",
  },
  {
    id: 5,
    image: serviceImgFive,
    className: "about-card-5",
  },
  {
    id: 6,
    image: serviceImgSix,
    className: "about-card-6",
  },
  {
    id: 7,
    image: serviceImgSeven,
    className: "about-card-7",
  },
];

function About() {
  const [hoveredArchive, setHoveredArchive] = useState(null);

  const handleJoinClick = (path) => {
    console.log("Go to signup page:", path);

    /*
      Later React Router connect korle:
      navigate(path);
    */
  };

  return (
    <main className="about-page">
      <section className="about-hero-section">
        <div className="container-fluid about-hero-container">
          <div className="about-hero-content">
            <div className="about-hero-left">
              <span className="about-label">ABOUT US</span>

              <h1>
                <span>Digital Solutions</span> for
                <br />
                Your Business
              </h1>

              <p>
                Templaraa is a digital marketplace where creators, developers,
                and businesses can discover premium website templates, UI kits,
                and ready-to-launch digital products.
              </p>
            </div>

            <div className="about-hero-right">
              <img src={aboutHeroShape} alt="Templaraa digital solutions" />
            </div>
          </div>
        </div>
      </section>

      <section className="about-services-section">
        <div className="container-fluid about-services-container">
          <div className="about-services-grid">
            <div className="about-services-intro">
              <span>WE OFFER</span>

              <h2>Amazing Services</h2>

              <p>
                We make it easier to build, sell, and launch digital website
                products. Our platform focuses on clean design, flexible
                structure, and marketplace-ready presentation.
              </p>
            </div>

            {serviceCards.map((service) => (
              <article
                className={
                  service.featured
                    ? "about-service-card active"
                    : "about-service-card"
                }
                key={service.id}
              >
                <div className="about-service-title">
                  <span>
                    <ion-icon name={service.icon}></ion-icon>
                  </span>

                  <h3>{service.title}</h3>
                </div>

                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="about-archive-scene">
          <div
            className="about-archive-stack"
            onMouseLeave={() => setHoveredArchive(null)}
          >
            {archiveCards.map((card, index) => (
              <div
                className={`about-card-wrap ${card.className} ${
                  hoveredArchive === index ? "hovered" : ""
                }`}
                key={card.id}
              >
                <div className="about-face-side"></div>

                <div className="about-face-front">
                  <img src={card.image} alt={`Portfolio archive ${index + 1}`} />
                </div>
              </div>
            ))}

            {archiveCards.map((card, index) => {
              const zoneWidth = 100 / archiveCards.length;

              return (
                <button
                  type="button"
                  className="about-hit-zone"
                  key={`zone-${card.id}`}
                  style={{
                    left: `${zoneWidth * index}vw`,
                    width: `${zoneWidth}vw`,
                  }}
                  onMouseEnter={() => setHoveredArchive(index)}
                  aria-label={`View archive card ${index + 1}`}
                ></button>
              );
            })}
          </div>
        </div>
      </section>

      <JoinOpportunity onJoinClick={handleJoinClick} />
    </main>
  );
}

export default About;