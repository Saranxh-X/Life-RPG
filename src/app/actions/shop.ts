'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function purchaseItem(rewardId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not logged in' }

  // 1. Get Reward
  const { data: reward, error: rewardError } = await supabase
    .from('rewards')
    .select('*')
    .eq('id', rewardId)
    .single()

  if (rewardError || !reward) return { error: 'Reward not found' }

  // 2. Get User Profile (Gold check)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('gold')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) return { error: 'Profile not found' }

  if (profile.gold < reward.price) {
    return { error: 'Not enough gold' }
  }

  // 3. Check if already purchased
  const { data: existing } = await supabase
    .from('inventory')
    .select('*')
    .eq('user_id', user.id)
    .eq('reward_id', rewardId)
    .single()

  if (existing) {
    return { error: 'Already own this item' }
  }

  // 4. Proceed with purchase
  const newGold = profile.gold - reward.price

  const { error: inventoryError } = await supabase
    .from('inventory')
    .insert({
      user_id: user.id,
      reward_id: rewardId
    })

  if (inventoryError) return { error: 'Failed to add to inventory' }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ gold: newGold })
    .eq('id', user.id)

  if (updateError) return { error: 'Failed to deduct gold' }

  revalidatePath('/dashboard/shop')
  revalidatePath('/dashboard/inventory')
  
  return { success: true }
}
