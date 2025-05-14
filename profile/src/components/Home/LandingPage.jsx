import React, { useEffect, useState } from "react";
import "../../styles/landingpage.css";
import landingPageVideo from "../../assets/landingPage.mp4";
import landingPageVideo1 from "../../assets/landingPage1.mp4";
import fallbackImage from "../../assets/dtuBirdEyeView.jpg";
import dtuLogo from "../../assets/dtuLogo.jpg";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="landing-container">
      {videoError ? (
        <img
          src={fallbackImage}
          alt="DTU Campus"
          className="background-fallback"
        />
      ) : (
        <video
          className="background-video"
          autoPlay
          loop
          muted
          playsInline
          poster={fallbackImage}
          onError={() => setVideoError(true)}
        >
          <source src={landingPageVideo1} type="video/mp4" />
          <source
            src={landingPageVideo.replace(".mp4", ".webm")}
            type="video/webm"
          />
        </video>
      )}

      <div className="video-overlay" />

      <div className="overlay-content">
        <header className={`page-header ${isScrolled ? "scrolled" : ""}`}>
          <div className="header-content">
            <img src={dtuLogo} alt="DTU Logo" className="dtu-logo" />
            {/* Desktop Navigation */}
            <nav className="nav-links">
              <a href="/login">Login</a>
              <a href="#alumni">Alumni</a>
              <a href="#faculties">Faculties</a>
              <a href="#echo">Echo</a>
            </nav>
            {/* Mobile Hamburger Menu */}
            <button
              className={`hamburger-menu ${isMenuOpen ? "hidden" : ""}`}
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </header>

        {/* Mobile Sidebar */}
        <div className={`mobile-sidebar ${isMenuOpen ? "open" : ""}`}>
          <div className="sidebar-content">
            <button
              className="close-btn"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              ×
            </button>
            <nav className="mobile-nav">
              <a href="#login" onClick={() => setIsMenuOpen(false)}>
                Login
              </a>
              <a href="#alumni" onClick={() => setIsMenuOpen(false)}>
                Alumni
              </a>
              <a href="#faculties" onClick={() => setIsMenuOpen(false)}>
                Faculties
              </a>
              <a href="#echo" onClick={() => setIsMenuOpen(false)}>
                Echo
              </a>
            </nav>
          </div>
        </div>

        <div className="hero-section">
          <div className="hero-text">
            <h1 className="headline">
              <span className="word">Delhi</span>
              <span className="word">Technological</span>
              <span className="word">University</span>
            </h1>
          </div>
        </div>

        <div className="scroll-indicator" aria-hidden="true">
          <div className="floating-arrow"></div>
          <span>Start Your Journey</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
