
import React from 'react';

const VideoBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Video Element */}
      <video
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
