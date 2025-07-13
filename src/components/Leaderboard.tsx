import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, Crown, Zap, TrendingUp } from 'lucide-react';

/**
 * On-Chain Leaderboard Component
 * Displays top players and their NFT achievements
 * Simulates blockchain-based score recording
 */

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  nftId: string;
  nftName: string;
  score: number;
  rank: number;
  blockchain: 'Endless';
  timestamp: number;
  verified: boolean;
}

interface LeaderboardProps {
  currentPlayer?: {
    name: string;
    nftId: string;
    score: number;
  };
  onViewTransaction: (entryId: string) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ 
  currentPlayer, 
  onViewTransaction 
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'alltime'>('daily');

  // Simulate leaderboard data (in real app, would fetch from blockchain)
  useEffect(() => {
    generateLeaderboard();
  }, [timeframe]);

  const generateLeaderboard = () => {
    const mockEntries: LeaderboardEntry[] = [
      {
        id: 'entry-1',
        playerName: 'CryptoMaster',
        nftId: 'nft-legendary-001',
        nftName: 'NeonWarrior',
        score: 2850,
        rank: 1,
        blockchain: 'Endless',
        timestamp: Date.now() - 3600000,
        verified: true
      },
      {
        id: 'entry-2',
        playerName: 'BlockChainer',
        nftId: 'nft-epic-045',
        nftName: 'CyberKnight',
        score: 2420,
        rank: 2,
        blockchain: 'Endless',
        timestamp: Date.now() - 7200000,
        verified: true
      },
      {
        id: 'entry-3',
        playerName: 'NFTHunter',
        nftId: 'nft-rare-123',
        nftName: 'PlasmaHunter',
        score: 2180,
        rank: 3,
        blockchain: 'Endless',
        timestamp: Date.now() - 10800000,
        verified: true
      },
      {
        id: 'entry-4',
        playerName: 'ArenaKing',
        nftId: 'nft-epic-078',
        nftName: 'VoidWalker',
        score: 1950,
        rank: 4,
        blockchain: 'Endless',
        timestamp: Date.now() - 14400000,
        verified: true
      },
      {
        id: 'entry-5',
        playerName: 'ChainWarrior',
        nftId: 'nft-legendary-002',
        nftName: 'StarBreaker',
        score: 1820,
        rank: 5,
        blockchain: 'Endless',
        timestamp: Date.now() - 18000000,
        verified: true
      }
    ];

    // Add current player if they have a score
    if (currentPlayer && currentPlayer.score > 0) {
      const playerEntry: LeaderboardEntry = {
        id: 'current-player',
        playerName: currentPlayer.name,
        nftId: currentPlayer.nftId,
        nftName: 'Your NFT',
        score: currentPlayer.score,
        rank: mockEntries.filter(entry => entry.score > currentPlayer.score).length + 1,
        blockchain: 'Endless',
        timestamp: Date.now(),
        verified: false // Not yet confirmed on chain
      };

      const updatedEntries = [...mockEntries, playerEntry]
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      setLeaderboard(updatedEntries);
    } else {
      setLeaderboard(mockEntries);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-accent" />;
      case 2: return <Trophy className="h-5 w-5 text-accent/80" />;
      case 3: return <Medal className="h-5 w-5 text-accent/60" />;
      default: return <Award className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-accent';
      case 2: return 'text-accent/80';
      case 3: return 'text-accent/60';
      default: return 'text-foreground';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <Card className="p-6 bg-gradient-card border-primary/20 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-lg shadow-neon">
            <Trophy className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-bold">🏆 Arena Champions</h3>
            <p className="text-sm text-muted-foreground">
              On-chain verified leaderboard
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {(['daily', 'weekly', 'alltime'] as const).map((period) => (
            <Button
              key={period}
              onClick={() => setTimeframe(period)}
              variant={timeframe === period ? 'gaming' : 'ghost'}
              size="sm"
              className="capitalize"
            >
              {period === 'alltime' ? 'All Time' : period}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {leaderboard.slice(0, 10).map((entry) => (
          <div
            key={entry.id}
            className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
              entry.id === 'current-player'
                ? 'bg-primary/10 border-primary/30 shadow-neon'
                : 'bg-muted/20 border-border hover:border-primary/20'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8">
                {getRankIcon(entry.rank)}
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${getRankColor(entry.rank)}`}>
                    {entry.playerName}
                  </span>
                  {entry.verified ? (
                    <Badge variant="secondary" className="text-xs bg-mint/20 text-mint">
                      ✓ Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Pending
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {entry.nftName} #{entry.nftId.slice(-6)}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" />
                <span className="text-lg font-bold text-accent">
                  {entry.score.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {formatTimestamp(entry.timestamp)}
              </div>
            </div>

            <Button
              onClick={() => onViewTransaction(entry.id)}
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              View TX
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-dashed border-primary/20">
        <div className="text-center">
          <h4 className="font-semibold mb-2">🔗 Blockchain Integration</h4>
          <p className="text-sm text-muted-foreground mb-3">
            All scores are verified and stored on the Endless blockchain. 
            Your NFT achievements are permanently recorded and tradeable.
          </p>
          <div className="flex justify-center gap-2 text-xs text-muted-foreground">
            <span>⛓️ Endless Network</span>
            <span>•</span>
            <span>🔒 Anti-Cheat Protected</span>
            <span>•</span>
            <span>💎 NFT Rewards</span>
          </div>
        </div>
      </div>
    </Card>
  );
};