
import React, { useRef, useEffect } from 'react';

const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    // Set a slower playback rate when the video element is available
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6; // Slows down to 60% of normal speed
    }
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 object-cover w-full h-full"
      >
        <source
          src="https://res.cloudinary.com/daqofqxjr/video/upload/v1744425287/mzw7gebems1so9sjf9zi.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      
      {/* Overlay with gradient for better text readability */}
      <div className="absolute inset-0 bg-dark/60 bg-gradient-to-t from-dark via-dark/60 to-transparent z-10"></div>
    </div>
  );
};

export default VideoBackground;
