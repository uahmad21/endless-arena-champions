import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { GameArena } from '@/components/GameArena';
import { NFTCharacter, NFTCharacterData, generateRandomNFT } from '@/components/NFTCharacter';
import { Leaderboard } from '@/components/Leaderboard';
import { NFTMarketplace } from '@/components/NFTMarketplace';
import { TransactionModal, Transaction, createTransaction } from '@/components/TransactionModal';
import { BridgeModal } from '@/components/BridgeModal';
import { 
  Sparkles, 
  Gamepad2, 
  Trophy, 
  ShoppingCart, 
  Zap, 
  Shield, 
  ArrowRight,
  ExternalLink,
  Bot,
  AlertTriangle
} from 'lucide-react';

/**
 * Main Endless Arena Game Application
 * Integrates all game components with blockchain simulation
 */

const Index = () => {
  const { toast } = useToast();
  
  // Game state
  const [playerCharacter, setPlayerCharacter] = useState<NFTCharacterData | null>(null);
  const [playerCollection, setPlayerCollection] = useState<NFTCharacterData[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  
  // Modal states
  const [transactionModal, setTransactionModal] = useState<{
    isOpen: boolean;
    transaction: Transaction | null;
  }>({ isOpen: false, transaction: null });
  
  const [bridgeModal, setBridgeModal] = useState<{
    isOpen: boolean;
    character: NFTCharacterData | null;
  }>({ isOpen: false, character: null });

  // Anti-cheat system
  const [antiCheatActive, setAntiCheatActive] = useState(true);
  const [suspiciousActivity, setSuspiciousActivity] = useState(false);

  // Initialize with a starter NFT
  useEffect(() => {
    const starterNFT = generateRandomNFT('starter-001');
    starterNFT.name = 'Arena Rookie';
    starterNFT.rarity = 'Common';
    setPlayerCharacter(starterNFT);
    setPlayerCollection([starterNFT]);
  }, []);

  // Anti-cheat monitoring (simulated AI detection)
  useEffect(() => {
    if (!antiCheatActive) return;

    const checkInterval = setInterval(() => {
      // Simulate AI anti-cheat analysis
      const suspiciousScorePattern = currentScore > 0 && (currentScore % 1000 === 0 && currentScore > 2000);
      
      if (suspiciousScorePattern && Math.random() < 0.1) {
        setSuspiciousActivity(true);
        toast({
          title: "🤖 AI Anti-Cheat Alert",
          description: "Unusual scoring pattern detected. Please play naturally.",
          variant: "destructive"
        });
      }
    }, 10000);

    return () => clearInterval(checkInterval);
  }, [currentScore, antiCheatActive, toast]);

  const showTransaction = (transaction: Transaction) => {
    setTransactionModal({ isOpen: true, transaction });
    
    // Simulate transaction confirmation after delay
    setTimeout(() => {
      const confirmedTransaction = { 
        ...transaction, 
        status: 'confirmed' as const,
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000
      };
      setTransactionModal({ isOpen: true, transaction: confirmedTransaction });
      
      toast({
        title: "✅ Transaction Confirmed",
        description: `${transaction.details} - View on Endless Explorer`,
      });
    }, 3000);
  };

  const handleMintNFT = () => {
    const newNFT = generateRandomNFT();
    const transaction = createTransaction(
      'mint',
      `Minted ${newNFT.name} (${newNFT.rarity})`,
      {
        amount: 0.05,
        currency: 'ETH',
        to: '0x742d35Cc6564C5532B2A3af7c58cAf8c14d2A41E'
      }
    );
    
    showTransaction(transaction);
    setPlayerCollection(prev => [...prev, newNFT]);
    setTotalEarnings(prev => prev + 50);
  };

  const handleUpgradeNFT = (characterId: string) => {
    const character = playerCollection.find(c => c.id === characterId);
    if (!character) return;

    const upgradedCharacter = {
      ...character,
      level: character.level + 1,
      power: Math.min(100, character.power + 5),
      defense: Math.min(100, character.defense + 5),
      speed: Math.min(100, character.speed + 5)
    };

    const transaction = createTransaction(
      'upgrade',
      `Upgraded ${character.name} to Level ${upgradedCharacter.level}`,
      {
        amount: 0.1,
        currency: 'ETH'
      }
    );

    showTransaction(transaction);
    setPlayerCollection(prev => 
      prev.map(c => c.id === characterId ? upgradedCharacter : c)
    );
    
    if (playerCharacter?.id === characterId) {
      setPlayerCharacter(upgradedCharacter);
    }
  };

  const handleTradeNFT = (characterId: string) => {
    const character = playerCollection.find(c => c.id === characterId);
    if (!character) return;

    const transaction = createTransaction(
      'trade',
      `Listed ${character.name} for trade on marketplace`,
      {
        amount: Math.random() * 2 + 0.5,
        currency: 'ETH'
      }
    );

    showTransaction(transaction);
    toast({
      title: "🛒 NFT Listed",
      description: `${character.name} is now available on the marketplace`,
    });
  };

  const handleBridgeNFT = (gameId: string, characterId: string) => {
    const character = playerCollection.find(c => c.id === characterId);
    if (!character) return;

    const games = {
      'endless-rpg': 'Endless Quest RPG',
      'cyber-racers': 'Cyber Racers: Endless',
      'magic-realms': 'Magic Realms',
      'guild-wars': 'Guild Wars: Endless'
    };

    const transaction = createTransaction(
      'bridge',
      `Bridged ${character.name} to ${games[gameId as keyof typeof games]}`,
      {
        to: '0x' + gameId.replace('-', '').padEnd(40, '0')
      }
    );

    showTransaction(transaction);
    toast({
      title: "🌉 NFT Bridged",
      description: `${character.name} is now active in ${games[gameId as keyof typeof games]}`,
    });
  };

  const handleScoreUpdate = (score: number) => {
    setCurrentScore(score);
  };

  const handleGameEnd = (finalScore: number) => {
    if (finalScore > 0) {
      const transaction = createTransaction(
        'leaderboard',
        `Recorded high score of ${finalScore} points on leaderboard`,
        {
          amount: finalScore * 0.001,
          currency: 'ENDLESS'
        }
      );

      showTransaction(transaction);
      setTotalEarnings(prev => prev + finalScore * 0.1);
    }
  };

  const handleViewTransaction = (entryId: string) => {
    const mockTransaction = createTransaction(
      'leaderboard',
      'Leaderboard entry verification transaction',
      {
        status: 'confirmed',
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        hash: `0x${entryId}${'0'.repeat(60)}`
      }
    );
    setTransactionModal({ isOpen: true, transaction: mockTransaction });
  };

  return (
    <div className="min-h-screen bg-gradient-arena text-foreground">
      {/* Header */}
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ⚔️ Endless Arena
              </div>
              <Badge variant="secondary" className="animate-glow-pulse">
                Endless Blockchain
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total Earnings</div>
                <div className="text-lg font-bold text-accent">
                  {totalEarnings.toFixed(1)} ENDLESS
                </div>
              </div>
              
              <Button variant="gaming" onClick={handleMintNFT} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Mint NFT
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <Card className="p-6 mb-8 bg-gradient-card border-primary/20 shadow-card">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Welcome to Endless Arena
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Battle with unique NFT characters on the Endless blockchain. 
              Win, trade, and bridge your NFTs across the entire Endless gaming ecosystem.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <Gamepad2 className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="font-semibold">Play & Earn</div>
                <div className="text-sm text-muted-foreground">
                  Battle in the arena with your NFT characters
                </div>
              </div>
              
              <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                <ShoppingCart className="h-8 w-8 text-secondary mx-auto mb-2" />
                <div className="font-semibold">Trade NFTs</div>
                <div className="text-sm text-muted-foreground">
                  Buy, sell, and upgrade on the marketplace
                </div>
              </div>
              
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <ArrowRight className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="font-semibold">Bridge Games</div>
                <div className="text-sm text-muted-foreground">
                  Use NFTs across multiple Endless games
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Game Interface */}
        <Tabs defaultValue="arena" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="arena" className="gap-2">
              <Gamepad2 className="h-4 w-4" />
              Arena
            </TabsTrigger>
            <TabsTrigger value="collection" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Collection
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Marketplace
            </TabsTrigger>
          </TabsList>

          <TabsContent value="arena" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {playerCharacter && (
                  <GameArena
                    player={{
                      id: 'player-1',
                      nftId: playerCharacter.id,
                      x: 300,
                      y: 200,
                      score: currentScore,
                      health: 100,
                      color: playerCharacter.color,
                      name: playerCharacter.name
                    }}
                    onScoreUpdate={handleScoreUpdate}
                    onGameEnd={handleGameEnd}
                  />
                )}
              </div>
              
              <div className="space-y-4">
                {playerCharacter && (
                  <NFTCharacter
                    character={playerCharacter}
                    onUpgrade={handleUpgradeNFT}
                    onTrade={handleTradeNFT}
                  />
                )}
                
                <Button
                  onClick={() => setBridgeModal({ 
                    isOpen: true, 
                    character: playerCharacter 
                  })}
                  variant="arena"
                  className="w-full gap-2"
                  disabled={!playerCharacter}
                >
                  <ArrowRight className="h-4 w-4" />
                  Bridge to Other Games
                </Button>

                {/* Anti-cheat Status */}
                <Card className="p-4 bg-mint/5 border-mint/20">
                  <div className="flex items-center gap-3">
                    <Bot className="h-5 w-5 text-mint" />
                    <div className="flex-1">
                      <div className="font-semibold">AI Anti-Cheat</div>
                      <div className="text-sm text-muted-foreground">
                        {antiCheatActive ? 'Active' : 'Disabled'}
                      </div>
                    </div>
                    {suspiciousActivity && (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="collection" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {playerCollection.map(character => (
                <NFTCharacter
                  key={character.id}
                  character={character}
                  onUpgrade={handleUpgradeNFT}
                  onTrade={handleTradeNFT}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Leaderboard
              currentPlayer={playerCharacter ? {
                name: 'You',
                nftId: playerCharacter.id,
                score: currentScore
              } : undefined}
              onViewTransaction={handleViewTransaction}
            />
          </TabsContent>

          <TabsContent value="marketplace">
            <NFTMarketplace
              playerCharacters={playerCollection}
              onPurchase={(listing) => {
                const transaction = createTransaction(
                  'trade',
                  `Purchased ${listing.character.name} for ${listing.price} ${listing.currency}`,
                  {
                    amount: listing.price,
                    currency: listing.currency,
                    from: listing.seller
                  }
                );
                showTransaction(transaction);
                setPlayerCollection(prev => [...prev, listing.character]);
              }}
              onSell={handleTradeNFT}
              onUpgrade={handleUpgradeNFT}
            />
          </TabsContent>
        </Tabs>

        {/* Endless Blockchain Info */}
        <Card className="mt-8 p-6 bg-gradient-nft border-mint/20 shadow-gold">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4 text-mint-foreground">
              ⚡ Powered by Endless Blockchain
            </h3>
            <p className="text-mint-foreground/80 mb-6">
              All characters and scores are NFTs on the Endless blockchain. 
              Trade your NFTs or use them in other Endless-powered games across the ecosystem!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-mint-foreground">
              <div className="p-3 bg-mint-foreground/10 rounded-lg">
                <Shield className="h-6 w-6 mx-auto mb-2" />
                <div className="font-semibold">Secure & Verified</div>
                <div className="text-sm opacity-80">
                  Anti-cheat AI protection
                </div>
              </div>
              
              <div className="p-3 bg-mint-foreground/10 rounded-lg">
                <Zap className="h-6 w-6 mx-auto mb-2" />
                <div className="font-semibold">Cross-Game Compatible</div>
                <div className="text-sm opacity-80">
                  Use NFTs in multiple games
                </div>
              </div>
              
              <div className="p-3 bg-mint-foreground/10 rounded-lg">
                <Trophy className="h-6 w-6 mx-auto mb-2" />
                <div className="font-semibold">Permanent Records</div>
                <div className="text-sm opacity-80">
                  Achievements stored on-chain
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="mt-4 border-mint-foreground text-mint-foreground hover:bg-mint-foreground hover:text-mint gap-2"
              onClick={() => window.open('https://endless.org', '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              Learn More About Endless
            </Button>
          </div>
        </Card>
      </div>

      {/* Modals */}
      <TransactionModal
        isOpen={transactionModal.isOpen}
        onClose={() => setTransactionModal({ isOpen: false, transaction: null })}
        transaction={transactionModal.transaction}
        onRetry={() => {
          if (transactionModal.transaction) {
            showTransaction({
              ...transactionModal.transaction,
              id: `retry-${Date.now()}`,
              status: 'pending',
              timestamp: Date.now()
            });
          }
        }}
      />

      <BridgeModal
        isOpen={bridgeModal.isOpen}
        onClose={() => setBridgeModal({ isOpen: false, character: null })}
        character={bridgeModal.character}
        onBridge={handleBridgeNFT}
      />
    </div>
  );
};

export default Index;
