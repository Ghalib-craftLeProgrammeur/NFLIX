import useMovie from "@/hooks/useMovie";
import { useRouter } from "next/router";
import React, { useRef, useState, useEffect } from "react";
import {
  AiOutlineArrowLeft,
  AiFillPlayCircle,
  AiFillPauseCircle,
} from "react-icons/ai";
import {
  BsVolumeUp,
  BsVolumeMute,
  BsFullscreen,
  BsFullscreenExit,
} from "react-icons/bs";
import { FaArrowRotateLeft, FaArrowRotateRight } from "react-icons/fa6";

const Watch = () => {
  const router = useRouter();
  const { movieId } = router.query;
  const { data } = useMovie(movieId as string);

  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  let hideControlsTimeout: NodeJS.Timeout;

  // Auto-hide controls logic
  const resetControlsTimeout = () => {
    if (hideControlsTimeout) clearTimeout(hideControlsTimeout);
    setShowControls(true);
    if (window.innerWidth > 768) {
      hideControlsTimeout = setTimeout(() => setShowControls(false), 5000);
    }
  };

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setShowControls(true);
      setTimeout(() => setShowControls(false), 10000);
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    resetControlsTimeout();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setVolume(videoRef.current.muted ? 0 : 1);
    resetControlsTimeout();
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    videoRef.current.volume = Number(e.target.value);
    setVolume(Number(e.target.value));
    resetControlsTimeout();
  };

  const handleProgress = () => {
    if (!videoRef.current) return;
    const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(progress);
    setShowControls(true)
  };

  const seekVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTime = (Number(e.target.value) / 100) * videoRef.current.duration;
    videoRef.current.currentTime = seekTime;
    setProgress(Number(e.target.value));
    resetControlsTimeout();
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
    resetControlsTimeout();
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (!isFullscreen) {
      videoRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
    resetControlsTimeout();
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col">
      <nav className="fixed w-full p-4 z-10 flex flex-row items-center gap-4 bg-black bg-opacity-70">
        <AiOutlineArrowLeft className="text-white cursor-pointer" size={40} onClick={() => router.push("/")} />
        <p className="text-white text-xl md:text-3xl font-bold">
          <span className="font-light">Watching </span> {data?.title || "Unknown Title"}
        </p>
      </nav>
      <div
        className="flex-grow flex items-center justify-center relative"
        onMouseMove={resetControlsTimeout}
        onMouseLeave={() => window.innerWidth > 768 && setShowControls(false)}
      >
        {data?.videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={data.videoUrl}
              autoPlay
              className="h-full w-full object-contain"
              onTimeUpdate={handleProgress}
            />
            {showControls && (
              <div
                ref={controlsRef}
                className="absolute bottom-5 left-0 right-0 p-4 bg-black bg-opacity-50 flex items-center justify-between transition-opacity"
              >
                <button onClick={() => skipTime(-10)} className="text-white text-3xl"><FaArrowRotateLeft className="mr-0.5" size={20} /></button>
                <button onClick={togglePlay} className="text-white text-3xl">
                  {isPlaying ? <AiFillPauseCircle /> : <AiFillPlayCircle />}
                </button>
                <button onClick={() => skipTime(10)} className="text-white text-3xl"><FaArrowRotateRight className="ml-0.5" size={20} /></button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress}
                  onChange={seekVideo}
                  className="w-full mx-4"
                />
                <button onClick={toggleMute} className="text-white text-xl">
                  {volume > 0 ? <BsVolumeUp /> : <BsVolumeMute />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={changeVolume}
                  className="w-16 ml-2"
                />
                <button onClick={toggleFullscreen} className="text-white text-xl">
                  {isFullscreen ? <BsFullscreenExit /> : <BsFullscreen />}
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-white text-xl">Video not available.</p>
        )}
      </div>
    </div>
  );
};

export default Watch;
