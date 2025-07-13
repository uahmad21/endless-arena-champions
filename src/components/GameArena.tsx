import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Target, Heart, Coins } from 'lucide-react';

/**
 * Simple 2D Arena Game Component
 * Players control NFT characters in a top-down arena
 * Collect coins, avoid obstacles, compete for high scores
 */

interface Player {
  id: string;
  nftId: string;
  x: number;
  y: number;
  score: number;
  health: number;
  color: string;
  name: string;
}

interface Collectible {
  id: string;
  x: number;
  y: number;
  type: 'coin' | 'powerup';
  value: number;
}

interface GameArenaProps {
  player: Player;
  onScoreUpdate: (score: number) => void;
  onGameEnd: (finalScore: number) => void;
}

export const GameArena: React.FC<GameArenaProps> = ({ player, onScoreUpdate, onGameEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'ended'>('waiting');
  const [currentPlayer, setCurrentPlayer] = useState<Player>(player);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [timeLeft, setTimeLeft] = useState(60); // 60 second rounds
  const gameLoopRef = useRef<number>();

  // Initialize game canvas and setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Setup initial collectibles
    spawnCollectibles();
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return () => {
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current);
        }
      };
    }
  }, [gameState, currentPlayer, collectibles]);

  // Timer countdown
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
  }, [gameState, timeLeft]);

  const spawnCollectibles = () => {
    const newCollectibles: Collectible[] = [];
    // Spawn random collectibles across the arena
    for (let i = 0; i < 10; i++) {
      newCollectibles.push({
        id: `collectible-${i}`,
        x: Math.random() * 550 + 25,
        y: Math.random() * 350 + 25,
        type: Math.random() > 0.7 ? 'powerup' : 'coin',
        value: Math.random() > 0.7 ? 50 : 10
      });
    }
    setCollectibles(newCollectibles);
  };

  const gameLoop = () => {
    render();
    checkCollisions();
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw arena border
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw grid pattern
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw collectibles
    collectibles.forEach(collectible => {
      ctx.fillStyle = collectible.type === 'coin' ? '#fbbf24' : '#10b981';
      ctx.beginPath();
      ctx.arc(collectible.x, collectible.y, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Add glow effect
      ctx.shadowColor = collectible.type === 'coin' ? '#fbbf24' : '#10b981';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw player (NFT character)
    ctx.fillStyle = currentPlayer.color;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(currentPlayer.x, currentPlayer.y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Player glow effect
    ctx.shadowColor = currentPlayer.color;
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw player name
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(currentPlayer.name, currentPlayer.x, currentPlayer.y - 25);
  };

  const checkCollisions = () => {
    const newCollectibles = collectibles.filter(collectible => {
      const distance = Math.sqrt(
        Math.pow(currentPlayer.x - collectible.x, 2) + 
        Math.pow(currentPlayer.y - collectible.y, 2)
      );
      
      if (distance < 20) {
        // Collected!
        const newScore = currentPlayer.score + collectible.value;
        setCurrentPlayer(prev => ({ ...prev, score: newScore }));
        onScoreUpdate(newScore);
        return false; // Remove collectible
      }
      return true;
    });

    if (newCollectibles.length !== collectibles.length) {
      setCollectibles(newCollectibles);
      
      // Spawn new collectible
      if (newCollectibles.length < 5) {
        setCollectibles(prev => [...prev, {
          id: `collectible-${Date.now()}`,
          x: Math.random() * 550 + 25,
          y: Math.random() * 350 + 25,
          type: Math.random() > 0.7 ? 'powerup' : 'coin',
          value: Math.random() > 0.7 ? 50 : 10
        }]);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentPlayer(prev => ({
      ...prev,
      x: Math.max(15, Math.min(x, canvas.width - 15)),
      y: Math.max(15, Math.min(y, canvas.height - 15))
    }));
  };

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(60);
    setCurrentPlayer(prev => ({ ...prev, score: 0, health: 100 }));
    spawnCollectibles();
  };

  const endGame = () => {
    setGameState('ended');
    onGameEnd(currentPlayer.score);
  };

  return (
    <Card className="p-6 bg-gradient-card border-primary/20 shadow-card">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-primary mb-2">🏟️ Endless Arena</h3>
        <div className="flex justify-center gap-4 mb-4">
          <Badge variant="secondary" className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-accent" />
            Score: {currentPlayer.score}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-destructive" />
            Health: {currentPlayer.health}%
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2">
            <Target className="h-4 w-4 text-secondary" />
            Time: {timeLeft}s
          </Badge>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          className="w-full border-2 border-primary/30 rounded-lg cursor-none bg-background"
          style={{ maxWidth: '600px', height: 'auto' }}
        />
        
        {gameState === 'waiting' && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
            <div className="text-center">
              <h4 className="text-xl font-bold mb-4">Ready to Battle?</h4>
              <p className="text-muted-foreground mb-4">
                Move your NFT character with your mouse and collect coins!
              </p>
              <Button onClick={startGame} variant="arena" size="lg" className="gap-2">
                <Zap className="h-5 w-5" />
                Enter Arena
              </Button>
            </div>
          </div>
        )}

        {gameState === 'ended' && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 rounded-lg">
            <div className="text-center">
              <h4 className="text-xl font-bold mb-2">Arena Cleared!</h4>
              <p className="text-lg text-accent mb-4">Final Score: {currentPlayer.score}</p>
              <Button onClick={startGame} variant="gaming" size="lg">
                Play Again
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        💡 Move your mouse to control your NFT character • Collect coins and power-ups to increase your score
      </div>
    </Card>
  );
};