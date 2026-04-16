/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { DUMMY_TRACKS } from '../types';
import { Play, Pause, SkipBack, SkipForward, Volume2, Radio } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { motion, AnimatePresence } from 'motion/react';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState([70]);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Playback failed", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      if (duration) {
        audioRef.current.currentTime = (value[0] / 100) * duration;
        setProgress(value[0]);
      }
    }
  };

  return (
    <div className="w-full max-w-[400px] bg-black border-2 border-cyan-400 p-6 relative overflow-hidden">
      {/* Glitch Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-magenta-500 animate-noise" />
        <div className="absolute bottom-0 right-0 w-full h-1 bg-cyan-400 animate-noise delay-75" />
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipForward}
      />

      <div className="flex flex-col gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 flex-shrink-0 border-2 border-magenta-500 p-1">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover grayscale contrast-150 brightness-75"
              referrerPolicy="no-referrer"
            />
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-cyan-400/20">
                <Radio className="w-8 h-8 text-cyan-400 animate-pulse" />
              </div>
            )}
          </div>

          <div className="flex flex-col overflow-hidden text-left">
            <h3 className="text-sm font-pixel text-white truncate uppercase tracking-tighter">
              {currentTrack.title}
            </h3>
            <p className="text-[10px] text-magenta-500 font-mono uppercase">
              {`SOURCE: ${currentTrack.artist}`}
            </p>
            <div className="mt-2">
              <span className="px-2 py-0.5 border border-cyan-400 text-[8px] text-cyan-400 font-pixel">
                SIGNAL_STABLE
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-crosshair"
          />
          <div className="flex justify-between text-[8px] text-white/40 font-pixel">
            <span>BIT_STREAM</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={skipBackward}
              className="text-cyan-400 hover:bg-cyan-400 hover:text-black rounded-none border border-cyan-400/20"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              onClick={togglePlay}
              className="w-12 h-12 rounded-none bg-magenta-500 text-black hover:bg-magenta-400 shadow-[4px_4px_0px_#00ffff] transition-transform active:translate-x-1 active:translate-y-1"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-1" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={skipForward}
              className="text-cyan-400 hover:bg-cyan-400 hover:text-black rounded-none border border-cyan-400/20"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3 w-24">
            <Volume2 className="w-3 h-3 text-magenta-500" />
            <Slider
              value={volume}
              max={100}
              onValueChange={setVolume}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
