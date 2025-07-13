import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowRight, Gamepad2, Swords, Wand2, Shield, ExternalLink } from 'lucide-react';
import { NFTCharacterData } from './NFTCharacter';

/**
 * NFT Bridge Modal Component
 * Simulates bridging NFT characters to other Endless-powered games
 */

interface PartnerGame {
  id: string;
  name: string;
  description: string;
  type: 'RPG' | 'Strategy' | 'Racing' | 'Adventure';
  icon: React.ReactNode;
  compatibility: string[];
  rewards: string;
  playerCount: number;
  isLive: boolean;
}

interface BridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: NFTCharacterData | null;
  onBridge: (gameId: string, characterId: string) => void;
}

export const BridgeModal: React.FC<BridgeModalProps> = ({
  isOpen,
  onClose,
  character,
  onBridge
}) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  // Simulated partner games in the Endless ecosystem
  const partnerGames: PartnerGame[] = [
    {
      id: 'endless-rpg',
      name: 'Endless Quest RPG',
      description: 'Epic fantasy adventure with your NFT heroes',
      type: 'RPG',
      icon: <Swords className="h-6 w-6" />,
      compatibility: ['All rarities', 'Power-based scaling'],
      rewards: 'Rare loot & XP multipliers',
      playerCount: 15420,
      isLive: true
    },
    {
      id: 'cyber-racers',
      name: 'Cyber Racers: Endless',
      description: 'High-speed racing with NFT vehicles',
      type: 'Racing',
      icon: <Gamepad2 className="h-6 w-6" />,
      compatibility: ['Speed stats matter', 'Epic+ preferred'],
      rewards: 'Racing tokens & trophies',
      playerCount: 8730,
      isLive: true
    },
    {
      id: 'magic-realms',
      name: 'Magic Realms',
      description: 'Spell-casting battles and magical quests',
      type: 'Adventure',
      icon: <Wand2 className="h-6 w-6" />,
      compatibility: ['Magic-based characters', 'Level scaling'],
      rewards: 'Spell scrolls & artifacts',
      playerCount: 12150,
      isLive: false
    },
    {
      id: 'guild-wars',
      name: 'Guild Wars: Endless',
      description: 'Strategic guild battles and territory control',
      type: 'Strategy',
      icon: <Shield className="h-6 w-6" />,
      compatibility: ['Team strategy focus', 'Defense stats key'],
      rewards: 'Guild tokens & territory NFTs',
      playerCount: 6840,
      isLive: true
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'RPG': return 'text-primary';
      case 'Racing': return 'text-secondary';
      case 'Adventure': return 'text-accent';
      case 'Strategy': return 'text-mint';
      default: return 'text-foreground';
    }
  };

  const getBridgeBenefits = (character: NFTCharacterData | null, game: PartnerGame) => {
    if (!character) return [];
    
    const benefits = ['Cross-game progression', 'Unique rewards'];
    
    if (character.rarity === 'Legendary') {
      benefits.push('VIP access');
    }
    if (character.power > 70) {
      benefits.push('Power bonus');
    }
    if (game.type === 'RPG' && character.level > 5) {
      benefits.push('Level advantage');
    }
    
    return benefits;
  };

  const handleBridge = () => {
    if (selectedGame && character) {
      onBridge(selectedGame, character.id);
      onClose();
    }
  };

  if (!character) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gradient-card border-primary/20 shadow-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-secondary rounded-lg shadow-electric">
              <ArrowRight className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <div className="text-xl font-bold">🌉 Bridge NFT</div>
              <div className="text-sm text-muted-foreground font-normal">
                Send {character.name} to another Endless game
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Character Summary */}
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-lg border-2 border-primary/30 shadow-neon flex items-center justify-center text-xl font-bold"
                style={{ backgroundColor: character.color }}
              >
                {character.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">{character.name}</h4>
                <p className="text-sm text-muted-foreground">NFT #{character.id}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline">{character.rarity}</Badge>
                  <Badge variant="outline">Level {character.level}</Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Ready to bridge</div>
                <div className="text-lg font-bold text-secondary">✓ Compatible</div>
              </div>
            </div>
          </Card>

          {/* Available Games */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              🎮 Choose Destination Game
              <Badge variant="secondary" className="text-xs">
                {partnerGames.filter(g => g.isLive).length} Live Games
              </Badge>
            </h4>
            
            <div className="grid gap-3">
              {partnerGames.map((game) => (
                <Card 
                  key={game.id}
                  className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-neon ${
                    selectedGame === game.id 
                      ? 'border-primary shadow-neon bg-primary/5' 
                      : 'border-border hover:border-primary/30'
                  } ${!game.isLive ? 'opacity-50' : ''}`}
                  onClick={() => game.isLive && setSelectedGame(game.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${getTypeColor(game.type)} bg-current/10`}>
                      {game.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-semibold">{game.name}</h5>
                        <Badge 
                          variant={game.isLive ? 'default' : 'secondary'} 
                          className="text-xs"
                        >
                          {game.isLive ? 'Live' : 'Coming Soon'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {game.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                        <span>🎯 {game.type}</span>
                        <span>👥 {game.playerCount.toLocaleString()} players</span>
                      </div>
                      
                      <div className="text-sm">
                        <div className="text-accent font-medium">🎁 {game.rewards}</div>
                      </div>
                    </div>

                    {selectedGame === game.id && (
                      <div className="text-primary">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    )}
                  </div>

                  {selectedGame === game.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Bridge Benefits:</div>
                        <div className="flex flex-wrap gap-2">
                          {getBridgeBenefits(character, game).map((benefit, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              ✨ {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Bridge Info */}
          <Card className="p-4 bg-mint/5 border-mint/20">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              ℹ️ Bridge Information
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Your NFT will be temporarily locked in this game while active in the destination game</p>
              <p>• You can bridge back anytime to return your NFT to Endless Arena</p>
              <p>• Progress and rewards earned in partner games may affect your NFT's stats</p>
              <p>• Bridge transactions are recorded on the Endless blockchain</p>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleBridge}
              disabled={!selectedGame}
              variant="arena"
              className="flex-1 gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              Bridge NFT
            </Button>
          </div>

          {selectedGame && (
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-xs"
                onClick={() => {
                  const game = partnerGames.find(g => g.id === selectedGame);
                  if (game) {
                    window.open(`https://${game.id}.endless-games.com`, '_blank');
                  }
                }}
              >
                <ExternalLink className="h-3 w-3" />
                Visit Game Website
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};