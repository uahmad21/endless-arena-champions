import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, ExternalLink, Copy, AlertCircle } from 'lucide-react';

/**
 * Blockchain Transaction Modal
 * Simulates Endless blockchain transaction confirmations
 */

export interface Transaction {
  id: string;
  type: 'mint' | 'trade' | 'upgrade' | 'bridge' | 'leaderboard';
  status: 'pending' | 'confirmed' | 'failed';
  hash: string;
  from?: string;
  to?: string;
  amount?: number;
  currency?: string;
  gasUsed?: number;
  timestamp: number;
  blockNumber?: number;
  details: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onRetry?: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onRetry
}) => {
  if (!transaction) return null;

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'confirmed':
        return <CheckCircle className="h-8 w-8 text-mint" />;
      case 'pending':
        return <Clock className="h-8 w-8 text-accent animate-pulse" />;
      case 'failed':
        return <AlertCircle className="h-8 w-8 text-destructive" />;
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'confirmed': return 'text-mint';
      case 'pending': return 'text-accent';
      case 'failed': return 'text-destructive';
    }
  };

  const getTypeDisplay = () => {
    switch (transaction.type) {
      case 'mint': return { title: '🎨 NFT Mint', description: 'Creating new NFT on Endless chain' };
      case 'trade': return { title: '🔄 NFT Trade', description: 'Trading NFT on marketplace' };
      case 'upgrade': return { title: '⬆️ NFT Upgrade', description: 'Enhancing NFT attributes' };
      case 'bridge': return { title: '🌉 NFT Bridge', description: 'Bridging to another game' };
      case 'leaderboard': return { title: '🏆 Score Record', description: 'Recording score on-chain' };
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, you'd show a toast notification
  };

  const typeInfo = getTypeDisplay();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-card border-primary/20 shadow-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <div className="text-lg font-bold">{typeInfo.title}</div>
              <div className="text-sm text-muted-foreground font-normal">
                {typeInfo.description}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status */}
          <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
            <span className="text-sm font-medium">Status</span>
            <Badge 
              variant={transaction.status === 'confirmed' ? 'default' : 'secondary'}
              className={`capitalize ${getStatusColor()}`}
            >
              {transaction.status}
            </Badge>
          </div>

          {/* Transaction Hash */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Transaction Hash</div>
            <div className="flex items-center gap-2 p-2 bg-muted/20 rounded text-xs font-mono">
              <span className="flex-1 truncate">{transaction.hash}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(transaction.hash)}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {transaction.blockNumber && (
              <div className="p-2 bg-muted/20 rounded">
                <div className="text-muted-foreground">Block</div>
                <div className="font-mono">#{transaction.blockNumber}</div>
              </div>
            )}
            
            {transaction.gasUsed && (
              <div className="p-2 bg-muted/20 rounded">
                <div className="text-muted-foreground">Gas Used</div>
                <div className="font-mono">{transaction.gasUsed.toLocaleString()}</div>
              </div>
            )}

            {transaction.amount && (
              <div className="p-2 bg-muted/20 rounded">
                <div className="text-muted-foreground">Amount</div>
                <div className="font-mono">
                  {transaction.amount} {transaction.currency || 'ETH'}
                </div>
              </div>
            )}

            <div className="p-2 bg-muted/20 rounded">
              <div className="text-muted-foreground">Network</div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-mint rounded-full"></div>
                <span>Endless</span>
              </div>
            </div>
          </div>

          {/* From/To Addresses */}
          {(transaction.from || transaction.to) && (
            <div className="space-y-2">
              {transaction.from && (
                <div>
                  <div className="text-sm text-muted-foreground">From</div>
                  <div className="flex items-center gap-2 p-2 bg-muted/20 rounded text-xs font-mono">
                    <span className="flex-1 truncate">{transaction.from}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(transaction.from!)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
              
              {transaction.to && (
                <div>
                  <div className="text-sm text-muted-foreground">To</div>
                  <div className="flex items-center gap-2 p-2 bg-muted/20 rounded text-xs font-mono">
                    <span className="flex-1 truncate">{transaction.to}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(transaction.to!)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Transaction Details */}
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="text-sm font-medium mb-1">Details</div>
            <div className="text-sm text-muted-foreground">
              {transaction.details}
            </div>
          </div>

          {/* Timestamp */}
          <div className="text-xs text-muted-foreground text-center">
            {new Date(transaction.timestamp).toLocaleString()}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {transaction.status === 'confirmed' && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
                onClick={() => window.open(`https://endless-explorer.com/tx/${transaction.hash}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                View on Explorer
              </Button>
            )}
            
            {transaction.status === 'failed' && onRetry && (
              <Button
                variant="gaming"
                size="sm"
                className="flex-1"
                onClick={onRetry}
              >
                Retry Transaction
              </Button>
            )}
            
            <Button
              variant={transaction.status === 'confirmed' ? 'gaming' : 'secondary'}
              size="sm"
              onClick={onClose}
              className="flex-1"
            >
              {transaction.status === 'pending' ? 'Close' : 'Done'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Utility function to create mock transactions
 */
export const createTransaction = (
  type: Transaction['type'],
  details: string,
  options: Partial<Transaction> = {}
): Transaction => {
  const baseHash = Math.random().toString(36).substring(2, 15);
  
  return {
    id: `tx-${Date.now()}`,
    type,
    status: 'pending',
    hash: `0x${baseHash}${'0'.repeat(64 - baseHash.length)}`,
    timestamp: Date.now(),
    details,
    gasUsed: Math.floor(Math.random() * 100000) + 21000,
    blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
    ...options
  };
};