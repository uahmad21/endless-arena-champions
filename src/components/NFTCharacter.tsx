import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Shield, Star, ArrowUpRight } from 'lucide-react';

/**
 * NFT Character Component
 * Displays player's unique NFT character with stats and upgrade options
 */

export interface NFTCharacterData {
  id: string;
  name: string;
  image: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  level: number;
  power: number;
  defense: number;
  speed: number;
  special: string;
  color: string;
  wins: number;
  totalGames: number;
}

interface NFTCharacterProps {
  character: NFTCharacterData;
  onUpgrade: (characterId: string) => void;
  onTrade: (characterId: string) => void;
  isOwned?: boolean;
}

export const NFTCharacter: React.FC<NFTCharacterProps> = ({ 
  character, 
  onUpgrade, 
  onTrade,
  isOwned = true 
}) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-muted-foreground';
      case 'Rare': return 'text-secondary';
      case 'Epic': return 'text-primary';
      case 'Legendary': return 'text-accent';
      default: return 'text-foreground';
    }
  };

  const getRarityBadgeVariant = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'default';
      case 'Epic': return 'secondary';
      default: return 'outline';
    }
  };

  const winRate = character.totalGames > 0 ? 
    Math.round((character.wins / character.totalGames) * 100) : 0;

  return (
    <Card className="p-4 bg-gradient-card border-primary/20 shadow-card hover:shadow-neon transition-all duration-300 transform hover:scale-105">
      {/* Character Image/Avatar */}
      <div className="relative mb-4">
        <div 
          className="w-24 h-24 mx-auto rounded-full border-4 border-primary/30 shadow-neon flex items-center justify-center text-3xl font-bold"
          style={{ backgroundColor: character.color }}
        >
          {character.name.charAt(0)}
        </div>
        <div className="absolute -top-2 -right-2">
          <Badge 
            variant={getRarityBadgeVariant(character.rarity)}
            className="text-xs animate-float"
          >
            {character.rarity}
          </Badge>
        </div>
        {character.rarity === 'Legendary' && (
          <div className="absolute inset-0 rounded-full animate-glow-pulse" />
        )}
      </div>

      {/* Character Info */}
      <div className="text-center mb-4">
        <h3 className={`text-lg font-bold ${getRarityColor(character.rarity)}`}>
          {character.name}
        </h3>
        <p className="text-sm text-muted-foreground">NFT ID: #{character.id}</p>
        <div className="flex justify-center items-center gap-2 mt-2">
          <Star className="h-4 w-4 text-accent" />
          <span className="text-sm">Level {character.level}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-sm">Power</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${(character.power / 100) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{character.power}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-secondary" />
            <span className="text-sm">Defense</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-secondary transition-all duration-300"
                style={{ width: `${(character.defense / 100) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{character.defense}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm">Speed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(character.speed / 100) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{character.speed}</span>
          </div>
        </div>
      </div>

      {/* Special Ability */}
      <div className="mb-4 p-2 bg-muted/30 rounded-lg">
        <p className="text-xs text-muted-foreground">Special Ability:</p>
        <p className="text-sm font-medium">{character.special}</p>
      </div>

      {/* Win Rate */}
      <div className="mb-4 text-center">
        <div className="text-lg font-bold text-accent">{winRate}%</div>
        <div className="text-xs text-muted-foreground">
          Win Rate ({character.wins}/{character.totalGames})
        </div>
      </div>

      {/* Action Buttons */}
      {isOwned ? (
        <div className="space-y-2">
          <Button 
            onClick={() => onUpgrade(character.id)}
            variant="gaming" 
            size="sm" 
            className="w-full gap-2"
          >
            <ArrowUpRight className="h-4 w-4" />
            Upgrade NFT
          </Button>
          <Button 
            onClick={() => onTrade(character.id)}
            variant="outline" 
            size="sm" 
            className="w-full"
          >
            Trade Character
          </Button>
        </div>
      ) : (
        <Button 
          onClick={() => onTrade(character.id)}
          variant="nft" 
          size="sm" 
          className="w-full gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Buy NFT
        </Button>
      )}
    </Card>
  );
};

/**
 * NFT Character Generator
 * Creates random NFT characters for demonstration
 */
export const generateRandomNFT = (id?: string): NFTCharacterData => {
  const names = [
    'CyberKnight', 'NeonWarrior', 'PlasmaHunter', 'VoidWalker', 'StarBreaker',
    'TechMage', 'QuantumRider', 'EtherGuard', 'BlockLord', 'CryptoSage'
  ];
  
  const rarities: NFTCharacterData['rarity'][] = ['Common', 'Rare', 'Epic', 'Legendary'];
  const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
  
  const specials = [
    'Lightning Strike', 'Shield Boost', 'Speed Burst', 'Double Score',
    'Health Regen', 'Coin Magnet', 'Time Freeze', 'Power Surge'
  ];

  const rarity = rarities[Math.floor(Math.random() * rarities.length)];
  const rarityMultiplier = rarities.indexOf(rarity) + 1;

  return {
    id: id || `nft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: names[Math.floor(Math.random() * names.length)],
    image: '', // Would be actual NFT image URL
    rarity,
    level: Math.floor(Math.random() * 10) + 1,
    power: Math.floor(Math.random() * 50) + (rarityMultiplier * 10),
    defense: Math.floor(Math.random() * 50) + (rarityMultiplier * 10),
    speed: Math.floor(Math.random() * 50) + (rarityMultiplier * 10),
    special: specials[Math.floor(Math.random() * specials.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
    wins: Math.floor(Math.random() * 20),
    totalGames: Math.floor(Math.random() * 30) + 5
  };
};