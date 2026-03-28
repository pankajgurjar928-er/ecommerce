import React, { useState, useEffect } from "react";

const ImageWithFallback = ({
  src,
  alt,
  className,
  fallbackSrc = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setIsLoaded(false);
    setHasError(false);

    // Safety timeout: if image doesn't fire onLoad in 3s, assume it's loaded or failed silently
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [src, fallbackSrc]);

  return (
    <div className={`relative overflow-hidden w-full h-full flex items-center justify-center`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-50 dark:bg-white/[0.02] animate-pulse flex items-center justify-center">
          <svg className="w-8 h-8 text-black/5 dark:text-white/5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!hasError) {
            setImgSrc(fallbackSrc);
            setHasError(true);
            setIsLoaded(true);
          }
        }}
      />
    </div>
  );
};

export default ImageWithFallback;
