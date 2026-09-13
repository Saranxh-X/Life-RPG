'use client'

import { useState } from 'react'
import { purchaseItem } from '@/app/actions/shop'
import { Coins, CheckCircle, Shield, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'

type Reward = {
  id: string
  name: string
  description: string
  price: number
  type: string
}

export function ShopItem({ 
  reward, 
  isOwned, 
  canAfford 
}: { 
  reward: Reward, 
  isOwned: boolean, 
  canAfford: boolean 
}) {
  const [isPurchasing, setIsPurchasing] = useState(false)

  const handlePurchase = async () => {
    if (isOwned || !canAfford) return
    
    setIsPurchasing(true)
    const result = await purchaseItem(reward.id)
    
    if (result.error) {
      alert(result.error)
    } else {
      confetti({
        particleCount: 50,
        spread: 60,
        colors: ['#fbbf24', '#ffffff']
      })
    }
    setIsPurchasing(false)
  }

  const getIcon = () => {
    switch(reward.type) {
      case 'badge': return <Shield className="w-12 h-12 text-blue-400" />
      case 'theme': return <Sparkles className="w-12 h-12 text-purple-400" />
      default: return <CheckCircle className="w-12 h-12 text-green-400" />
    }
  }

  return (
    <div className={`bg-card border rounded-xl overflow-hidden transition-all ${isOwned ? 'border-primary/50 opacity-70' : 'border-border hover:border-accent/50'}`}>
      <div className="h-32 bg-secondary flex items-center justify-center relative">
        {getIcon()}
        <div className="absolute top-2 right-2 px-2 py-1 bg-background/80 rounded-md text-[10px] font-bold uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
          {reward.type}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-lg mb-1">{reward.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{reward.description}</p>
        
        {isOwned ? (
          <button disabled className="w-full py-2 bg-secondary text-muted-foreground rounded-lg font-medium flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Owned
          </button>
        ) : (
          <button 
            onClick={handlePurchase}
            disabled={!canAfford || isPurchasing}
            className={`w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
              canAfford 
                ? 'bg-accent hover:bg-accent/90 text-accent-foreground' 
                : 'bg-secondary text-muted-foreground cursor-not-allowed'
            }`}
          >
            {isPurchasing ? 'Purchasing...' : (
              <>
                <Coins className="w-4 h-4" />
                {reward.price} Gold
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
