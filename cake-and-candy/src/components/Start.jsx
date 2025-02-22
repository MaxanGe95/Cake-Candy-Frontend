import Video from "../assets/video2.mp4";
import "./Start.css";
import React, { useRef, useEffect, useState } from "react";

export default function Start() {
  const videoRef = useRef(null);

  const scrollToSection = () => {
    document
      .getElementById("target-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  const [style, setStyle] = useState({
    opacity: 1
  });

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScroll;
    setStyle({
      opacity: 1 - scrollFraction,
    });
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.5;
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="background-video">
      <video
        ref={videoRef}
        className="z-10"
        autoPlay
        loop
        muted
        style={ style }
      >
        <source src={Video} type="video/mp4" />
        <source src={Video} type="video/ogg" />
      </video>
      <div className="z-15 content text-stone-200 h-screen w-screen flex flex-col justify-center">
        <div className="mx-auto text-center flex flex-col gap-4 mb-5">
          <h2 className="text-5xl mb-4">Süßes Glück in jedem Bissen</h2>
          <div>
            <button
              type="button"
              className="z-10 cursor-pointer px-4 py-2 border-2 rounded-full hover:bg-teal-400/50 hover:scale-120 hover:text-white transition duration-300"
              onClick={scrollToSection}
            >
              mehr
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
