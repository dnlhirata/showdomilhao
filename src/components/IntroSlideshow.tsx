import React, { useEffect, useState } from "react";
import "./IntroSlideshow.css";

interface IntroSlideshowProps {
  onComplete: () => void;
}

const IntroSlideshow: React.FC<IntroSlideshowProps> = ({ onComplete }) => {
  // Generate the list of image paths
  const introImages = [
    "/intro/WhatsApp Image 2025-09-19 at 13.58.06.jpeg",
    "/intro/WhatsApp Image 2025-09-19 at 13.58.06(1).jpeg",
    "/intro/WhatsApp Image 2025-09-19 at 13.58.06(2).jpeg",
    "/intro/WhatsApp Image 2025-09-19 at 13.58.06(3).jpeg",
    "/intro/WhatsApp Image 2025-09-19 at 13.58.07.jpeg",
    "/intro/WhatsApp Image 2025-09-19 at 13.58.07(1).jpeg",
    "/intro/WhatsApp Image 2025-09-19 at 13.58.07(2).jpeg",
    "/intro/WhatsApp Image 2025-09-19 at 13.58.07(3).jpeg",
    "/intro/WhatsApp Image 2025-09-19 at 13.58.07(4).jpeg",
    "/intro/WhatsApp Image 2025-09-19 at 13.58.07(5).jpeg",
    "/intro/WhatsApp Image 2025-09-19 at 13.58.07(6).jpeg",
    "/intro/WhatsApp Image 2025-09-19 at 13.58.07(7).jpeg",
    "/intro/WhatsApp Image 2025-09-19 at 13.58.07(8).jpeg",
    "/intro/WhatsApp Image 2025-09-19 at 13.58.07(9).jpeg",
    "/intro/WhatsApp Image 2025-09-19 at 13.58.07(10).jpeg",
    "/intro/WhatsApp Image 2025-09-19 at 13.58.07(11).jpeg",
    "/intro/WhatsApp Image 2025-09-19 at 13.58.07(12).jpeg",
    "/intro/WhatsApp Image 2025-09-19 at 13.58.07(13).jpeg",
    "/intro/WhatsApp Image 2025-09-19 at 13.58.07(14).jpeg",
    "/intro/WhatsApp Image 2025-09-19 at 13.58.07(15).jpeg",
    "/intro/WhatsApp Image 2025-09-19 at 13.58.07(16).jpeg",
    "/intro/WhatsApp Image 2025-09-19 at 13.58.07(17).jpeg",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Calculate timing: 15 seconds total / 22 slides = ~680ms per slide
  const slideInterval = Math.floor(15500 / introImages.length);

  // Start background music and auto-advance slides
  useEffect(() => {
    // Play background music
    const audio = new Audio("/show-do-milhao2.mp3");
    audio.volume = 0.3;
    audio.play().catch((error) => {
      console.log("Background music failed to play:", error);
    });

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev >= introImages.length - 1) {
          // Completed all slides, finish intro
          audio.pause(); // Stop music
          setTimeout(() => onComplete(), 500);
          return prev;
        }
        return prev + 1;
      });
    }, slideInterval);

    return () => {
      clearInterval(interval);
      audio.pause(); // Clean up audio on unmount
    };
  }, [introImages.length, onComplete, slideInterval]);

  const skipIntro = () => {
    // Stop any playing audio when skipping
    const audioElements = document.querySelectorAll("audio");
    audioElements.forEach((audio) => audio.pause());
    onComplete();
  };

  return (
    <div className="intro-slideshow">
      <div className="slideshow-container">
        {/* Current Image */}
        <div className="slide-image-container">
          <img
            src={introImages[currentSlide]}
            alt={`Intro slide ${currentSlide + 1}`}
            className="slide-image"
            onError={() => {
              console.log(`Failed to load image: ${introImages[currentSlide]}`);
            }}
          />

          {/* Image overlay with slide number */}
          <div className="slide-overlay">
            <div className="slide-counter">
              {currentSlide + 1} / {introImages.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{
              width: `${((currentSlide + 1) / introImages.length) * 100}%`,
            }}
          />
        </div>

        {/* Skip Button */}
        <button className="skip-intro-btn" onClick={skipIntro}>
          Pular Intro
        </button>
      </div>
    </div>
  );
};

export default IntroSlideshow;
