import { useEffect, useMemo } from 'react';

function CosmicBackground() {
  const stars = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }));
  }, []);

  const shootingStars = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 40 + 5}%`,
      left: `${Math.random() * 60}%`,
      delay: i * 8 + Math.random() * 5,
      duration: Math.random() * 2 + 2,
    }));
  }, []);

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="cosmic-bg" />
      <div className="nebula nebula-1" />
      <div className="nebula nebula-2" />
      <div className="nebula nebula-3" />
      <div className="stars-layer">
        {stars.map((star) => (
          <div
            key={star.id}
            className="twinkle-star"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              '--duration': `${star.duration}s`,
              '--delay': `${star.delay}s`,
            }}
          />
        ))}
        {shootingStars.map((star) => (
          <div
            key={`shoot-${star.id}`}
            className="shooting-star"
            style={{
              top: star.top,
              left: star.left,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}

export default CosmicBackground;
