/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Direction, GRID_SIZE, INITIAL_DIRECTION, INITIAL_SNAKE, Point } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, RefreshCw, Play } from 'lucide-react';
import { Button } from './ui/button';

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [highScore, setHighScore] = useState(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood!.x && segment.y === newFood!.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case Direction.UP:
          newHead.y -= 1;
          break;
        case Direction.DOWN:
          newHead.y += 1;
          break;
        case Direction.LEFT:
          newHead.x -= 1;
          break;
        case Direction.RIGHT:
          newHead.x += 1;
          break;
      }

      // Check collisions
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== Direction.DOWN) setDirection(Direction.UP);
          break;
        case 'ArrowDown':
          if (direction !== Direction.UP) setDirection(Direction.DOWN);
          break;
        case 'ArrowLeft':
          if (direction !== Direction.RIGHT) setDirection(Direction.LEFT);
          break;
        case 'ArrowRight':
          if (direction !== Direction.LEFT) setDirection(Direction.RIGHT);
          break;
        case ' ':
          if (isGameOver) resetGame();
          else setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 120);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear with static noise pattern
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Subtle grid
    ctx.strokeStyle = 'rgba(255, 0, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Food (Magenta Glitch)
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff00ff';
    ctx.fillRect(
      food.x * cellSize + 2,
      food.y * cellSize + 2,
      cellSize - 4,
      cellSize - 4
    );
    ctx.shadowBlur = 0;

    // Snake (Cyan Matrix)
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00ffff' : 'rgba(0, 255, 255, 0.5)';
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 1;
      
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
      if (isHead) {
        ctx.strokeRect(
          segment.x * cellSize + 1,
          segment.y * cellSize + 1,
          cellSize - 2,
          cellSize - 2
        );
      }
    });
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-8 p-4 w-full">
      <div className="flex justify-between w-full max-w-[400px] items-end border-b-2 border-cyan-400/30 pb-2">
        <div className="flex flex-col">
          <span className="text-[8px] uppercase tracking-widest text-magenta-500 font-pixel">DATA_SCORE</span>
          <span className="text-2xl font-pixel text-cyan-400">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] uppercase tracking-widest text-white/30 font-pixel">MAX_STABILITY</span>
          <span className="text-lg font-pixel text-magenta-500">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div className="relative group">
        {/* Frame */}
        <div className="absolute -inset-4 border-2 border-magenta-500/20 pointer-events-none" />
        <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-cyan-400" />
        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-cyan-400" />
        
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="relative bg-black border-2 border-white/10 cursor-none"
          id="snake-canvas"
        />

        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md z-20"
            >
              {isGameOver ? (
                <div className="text-center space-y-6 p-8 border-4 border-magenta-500 bg-magenta-500/5">
                  <motion.div
                    animate={{ x: [-2, 2, -2], opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 0.1 }}
                  >
                    <AlertCircle className="w-16 h-16 text-magenta-500 mx-auto" />
                  </motion.div>
                  <h2 className="text-2xl font-pixel text-white uppercase glitch-text" data-text="CRITICAL_FAILURE">
                    CRITICAL_FAILURE
                  </h2>
                  <p className="text-[10px] text-cyan-400 font-mono">RECOVERY_SCORE: {score}</p>
                  <Button
                    onClick={resetGame}
                    className="bg-magenta-500 hover:bg-magenta-400 text-black font-pixel text-xs px-6 py-4 rounded-none transition-all active:scale-95"
                  >
                    <RefreshCw className="mr-2 w-4 h-4" /> REBOOT_SYSTEM
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-8">
                  <h2 className="text-4xl font-pixel text-cyan-400 uppercase tracking-tighter glitch-text" data-text="SUSPENDED">
                    SUSPENDED
                  </h2>
                  <Button
                    onClick={() => setIsPaused(false)}
                    className="bg-cyan-400 hover:bg-cyan-300 text-black font-pixel text-xs px-10 py-6 rounded-none transition-all shadow-[4px_4px_0px_#ff00ff]"
                  >
                    <Play className="mr-2 w-6 h-6 fill-current" /> RESUME_FLOW
                  </Button>
                  <p className="text-white/20 text-[8px] uppercase tracking-[0.4em] font-pixel">INPUT_SPACE_TO_INIT</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-[400px]">
        <div className="p-4 border border-white/10 bg-white/5">
          <span className="block text-[8px] uppercase text-white/30 font-pixel mb-2">NAV_INPUT</span>
          <span className="text-[10px] text-cyan-400 font-mono tracking-tighter">ARROW_KEYS // DIR_LOCK</span>
        </div>
        <div className="p-4 border border-white/10 bg-white/5">
          <span className="block text-[8px] uppercase text-white/30 font-pixel mb-2">SYS_INTERRUPT</span>
          <span className="text-[10px] text-magenta-500 font-mono tracking-tighter">SPACE // PAUSE_EXEC</span>
        </div>
      </div>
    </div>
  );
};
