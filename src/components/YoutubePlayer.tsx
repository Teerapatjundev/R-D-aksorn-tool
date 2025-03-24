import React from "react";
import YouTube from "react-youtube";

const YouTubePlayer = () => {
  const opts = {
    width: "100%",
    height: "600",
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <div className="rounded-2xl overflow-hidden shadow-md w-full flex gap-4">
      <div className="flex-1">
        <YouTube
          videoId="dQw4w9WgXcQ"
          opts={opts}
          onPlay={() => console.log("กำลังเล่น...")}
          onPause={() => console.log("หยุดชั่วคราว")}
        />
      </div>
      <div className="w-[400px]">
        <span className="self-center">hello</span>
      </div>
    </div>
  );
};

export default YouTubePlayer;
