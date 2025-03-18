import { useEffect, useRef, useState } from "react";

const FlyInWrapper = ({ children, direction = "left", duration = 1, delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const styles = {
    transition: `transform ${duration}s ease-out ${delay}s, opacity ${duration}s ease-out ${delay}s`,
    opacity: isVisible ? 1 : 0,
    transform:
      !isVisible && direction === "left"
        ? "translateX(-500px)"
        : !isVisible && direction === "right"
        ? "translateX(500px)"
        : !isVisible && direction === "top"
        ? "translateY(-500px)"
        : !isVisible && direction === "bottom"
        ? "translateY(500px)"
        : "none",
  };

  return (
    <div ref={ref} style={styles}>
      {children}
    </div>
  );
};


export { FlyInWrapper };
