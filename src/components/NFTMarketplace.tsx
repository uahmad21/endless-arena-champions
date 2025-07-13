import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { NFTCharacter, NFTCharacterData, generateRandomNFT } from './NFTCharacter';
import { ShoppingCart, DollarSign, Search, Filter, Sparkles, TrendingUp } from 'lucide-react';

/**
 * NFT Marketplace Component
 * Simulates trading and upgrading NFT characters on Endless blockchain
 */

interface MarketplaceListing {
  id: string;
  character: NFTCharacterData;
  price: number;
  seller: string;
  listed: number;
  currency: 'ETH' | 'ENDLESS';
}

interface NFTMarketplaceProps {
  playerCharacters: NFTCharacterData[];
  onPurchase: (listing: MarketplaceListing) => void;
  onSell: (characterId: string, price: number) => void;
  onUpgrade: (characterId: string) => void;
}

export const NFTMarketplace: React.FC<NFTMarketplaceProps> = ({
  playerCharacters,
  onPurchase,
  onSell,
  onUpgrade
}) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'upgrade'>('buy');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [listings] = useState<MarketplaceListing[]>(generateMarketplaceListings());

  function generateMarketplaceListings(): MarketplaceListing[] {
    return Array.from({ length: 12 }, (_, i) => {
      const character = generateRandomNFT();
      const rarityMultiplier = {
        'Common': 0.1,
        'Rare': 0.3,
        'Epic': 0.8,
        'Legendary': 2.5
      }[character.rarity];

      return {
        id: `listing-${i}`,
        character,
        price: Number((Math.random() * 5 + rarityMultiplier).toFixed(3)),
        seller: `Player${Math.floor(Math.random() * 1000)}`,
        listed: Date.now() - Math.random() * 86400000 * 7,
        currency: Math.random() > 0.5 ? 'ETH' : 'ENDLESS'
      };
    });
  }

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.character.special.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = filterRarity === 'all' || listing.character.rarity === filterRarity;
    return matchesSearch && matchesRarity;
  });

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ago`;
    return `${hours}h ago`;
  };

  const getUpgradeCost = (character: NFTCharacterData) => {
    const baseUpgradeCost = 0.1;
    const levelMultiplier = character.level * 0.05;
    const rarityMultiplier = {
      'Common': 1,
      'Rare': 1.5,
      'Epic': 2.5,
      'Legendary': 4
    }[character.rarity];

    return Number((baseUpgradeCost + levelMultiplier) * rarityMultiplier).toFixed(3);
  };

  return (
    <Card className="p-6 bg-gradient-card border-primary/20 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-nft rounded-lg shadow-gold">
            <ShoppingCart className="h-6 w-6 text-mint-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-bold">🛒 NFT Marketplace</h3>
            <p className="text-sm text-muted-foreground">
              Trade on Endless blockchain
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {(['buy', 'sell', 'upgrade'] as const).map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              variant={activeTab === tab ? 'nft' : 'ghost'}
              size="sm"
              className="capitalize"
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      {activeTab === 'buy' && (
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search NFTs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterRarity}
            onChange={(e) => setFilterRarity(e.target.value)}
            className="px-3 py-2 rounded-md border border-input bg-background text-foreground"
          >
            <option value="all">All Rarities</option>
            <option value="Common">Common</option>
            <option value="Rare">Rare</option>
            <option value="Epic">Epic</option>
            <option value="Legendary">Legendary</option>
          </select>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'buy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListings.map(listing => (
            <div key={listing.id} className="relative">
              <NFTCharacter
                character={listing.character}
                onUpgrade={() => {}}
                onTrade={() => onPurchase(listing)}
                isOwned={false}
              />
              <div className="absolute top-2 left-2 bg-background/90 rounded-lg p-2">
                <div className="flex items-center gap-1 text-sm font-bold text-accent">
                  <DollarSign className="h-3 w-3" />
                  {listing.price} {listing.currency}
                </div>
                <div className="text-xs text-muted-foreground">
                  by {listing.seller}
                </div>
              </div>
              <div className="absolute top-2 right-2">
                <Badge variant="outline" className="text-xs">
                  {formatTimeAgo(listing.listed)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'sell' && (
        <div className="space-y-4">
          <div className="text-center p-8 border-2 border-dashed border-primary/20 rounded-lg">
            <h4 className="font-semibold mb-2">📈 List Your NFTs</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Select an NFT from your collection to list on the marketplace
            </p>
          </div>
          
          {playerCharacters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playerCharacters.map(character => (
                <div key={character.id} className="relative">
                  <NFTCharacter
                    character={character}
                    onUpgrade={() => {}}
                    onTrade={() => {
                      const price = prompt('Enter selling price (ETH):');
                      if (price) {
                        onSell(character.id, parseFloat(price));
                      }
                    }}
                    isOwned={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">No NFTs to sell</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'upgrade' && (
        <div className="space-y-4">
          <div className="text-center p-6 bg-gradient-primary/10 border border-primary/20 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Upgrade Your NFTs
            </h4>
            <p className="text-sm text-muted-foreground">
              Enhance your characters' stats and unlock new abilities
            </p>
          </div>

          {playerCharacters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playerCharacters.map(character => (
                <div key={character.id} className="relative">
                  <NFTCharacter
                    character={character}
                    onUpgrade={() => onUpgrade(character.id)}
                    onTrade={() => {}}
                    isOwned={true}
                  />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-background/90 rounded p-2 text-center">
                      <div className="text-sm font-bold text-accent flex items-center justify-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {getUpgradeCost(character)} ETH
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Upgrade Cost
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">No NFTs to upgrade</p>
            </div>
          )}
        </div>
      )}

      {/* Marketplace Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">247</div>
            <div className="text-sm text-muted-foreground">Active Listings</div>
          </div>
        </div>
        <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">12.4 ETH</div>
            <div className="text-sm text-muted-foreground">Volume (24h)</div>
          </div>
        </div>
        <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">0.8 ETH</div>
            <div className="text-sm text-muted-foreground">Floor Price</div>
          </div>
        </div>
      </div>
    </Card>
  );
};