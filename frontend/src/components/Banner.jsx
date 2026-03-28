import { useEffect, useState } from "react";
import "../styles/banner.css";

const images = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da",
  "https://images.unsplash.com/photo-1607083206968-13611e3d76db",
  "https://images.unsplash.com/photo-1607082349566-187342175e2f"
];

const Banner = () => {
  const [index, setIndex] = useState(0);

  // auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // manual buttons
  const prevSlide = () => {
    setIndex(index === 0 ? images.length - 1 : index - 1);
  };

  const nextSlide = () => {
    setIndex((index + 1) % images.length);
  };

  return (
    <div className="banner">
      <button className="left" onClick={prevSlide}>◀</button>

      <img src={images[index]} alt="banner" />

      <button className="right" onClick={nextSlide}>▶</button>
    </div>
  );
};

export default Banner;