import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

// Hero Images
import heroImg1 from "../Assets/hero8.png";
import heroImg2 from "../Assets/hero7.png";
import heroImg3 from "../Assets/hero6.png";
import heroImg4 from "../Assets/hero2.png";

// Card Images
import boysImg from "../Assets/hero4.png";
import girlsImg from "../Assets/hero5.png";
import unisexImg from "../Assets/hero3.png";

// Tile Images
import tile1 from "../Assets/hero6.png";
import tile2 from "../Assets/g2.png";
import tile3 from "../Assets/g4.png";
import tile4 from "../Assets/g5.png";
import tile5 from "../Assets/g6.png";
import tile6 from "../Assets/g10.png";
import tile7 from "../Assets/g8.png";
import tile8 from "../Assets/g9.png";

const heroSlides = [
  {
    id: 1,
    title: "Elegant Comfort for\nEvery Stage.",
    link: "Shop the New Collection",
    img: heroImg1,
    bg: "#fdfcf8",
  },
  {
    id: 2,
    title: "Softest Organic Fabrics\nFor Gentle Skin.",
    link: "Explore Organic Range",
    img: heroImg2,
    bg: "#f4f9f9",
  },
  {
    id: 3,
    title: "Playful Styles for\nActive Toddlers.",
    link: "View Playwear",
    img: heroImg3,
    bg: "#fff9f2",
  },
  {
    id: 4,
    title: "New Season Arrivals\nAre Here.",
    link: "Shop New In",
    img: heroImg4,
    bg: "#fbf6f8",
  },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-shell">
      <main className="home-main">
        {/* HERO SLIDESHOW */}
        <section className="hero-slider-container">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`hero-slide ${index === currentSlide ? "active" : ""}`}
              style={{ backgroundColor: slide.bg }}
            >
              <div className="hero-content">
                <h1 className="hero-title">
                  {slide.title.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line} <br />
                    </React.Fragment>
                  ))}
                </h1>
                <Link to="/shop" className="hero-link">
                  {slide.link}
                </Link>
              </div>
              <img src={slide.img} alt="Hero slide" className="hero-img" />
            </div>
          ))}

          <div className="hero-dots">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                className={`dot ${idx === currentSlide ? "active" : ""}`}
                onClick={() => setCurrentSlide(idx)}
              />
            ))}
          </div>
        </section>

        {/* BOYS/GIRLS/UNISEX - CHANGED LINKS */}
        <section className="tri-cards reveal-on-scroll">
          <div className="cat-card blue-tint">
            <Link to="/category/boys" className="cat-card-link">
              <div className="cat-text">
                <h2>BOYS</h2>
              </div>
              <img src={boysImg} alt="Boys" />
            </Link>
          </div>

          <div className="cat-card pink-tint">
            <Link to="/category/girls" className="cat-card-link">
              <div className="cat-text">
                <h2>GIRLS</h2>
              </div>
              <img src={girlsImg} alt="Girls" />
            </Link>
          </div>

          <div className="cat-card beige-tint">
            <Link to="/category/unisex" className="cat-card-link">
              <div className="cat-text">
                <h2>UNISEX</h2>
              </div>
              <img src={unisexImg} alt="Unisex" />
            </Link>
          </div>
        </section>

        {/* FAV GRID - CHANGED LINKS */}
        <div className="grid-heading reveal-on-scroll">
          Explore Our Favorites
        </div>
        <section className="fav-grid reveal-on-scroll">
          <Link to="/category/new-arrivals" className="grid-tile">
            <img src={tile1} alt="" />
            <div className="tile-overlay">
              <h3>New Arrivals</h3>
            </div>
          </Link>

          <Link to="/category/organic" className="grid-tile blue-bg">
            <img src={tile2} alt="" />
            <div className="tile-overlay">
              <h3>Organic</h3>
            </div>
          </Link>

          <Link to="/category/playwear" className="grid-tile green-bg">
            <img src={tile3} alt="" />
            <div className="tile-overlay">
              <h3>Playwear</h3>
            </div>
          </Link>

          <Link to="/category/seasonal" className="grid-tile rust-bg">
            <img src={tile4} alt="" />
            <div className="tile-overlay">
              <h3>Seasonal</h3>
            </div>
          </Link>

          <Link to="/category/occasion" className="grid-tile">
            <img src={tile5} alt="" />
            <div className="tile-overlay">
              <h3>Occasion</h3>
            </div>
          </Link>

          <Link to="/category/sleep" className="grid-tile green-light-bg">
            <img src={tile6} alt="" />
            <div className="tile-overlay">
              <h3>Sleep</h3>
            </div>
          </Link>

          <Link to="/category/gifts" className="grid-tile">
            <img src={tile7} alt="" />
            <div className="tile-overlay">
              <h3>Gifts</h3>
            </div>
          </Link>

          <Link to="/category/accessories" className="grid-tile brown-bg">
            <img src={tile8} alt="" />
            <div className="tile-overlay">
              <h3>Accessories</h3>
            </div>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Home;
