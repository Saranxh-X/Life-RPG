'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// RPG Math Configuration
const XP_BASE = 500
const XP_MULTIPLIER = 1.2

export async function getXpForNextLevel(level: number) {
  return Math.floor(XP_BASE * Math.pow(XP_MULTIPLIER, level - 1))
}

const REWARDS = {
  easy: { xp: 50, gold: 10 },
  medium: { xp: 100, gold: 25 },
  hard: { xp: 250, gold: 50 },
  legendary: { xp: 500, gold: 100 },
}

export async function createQuest(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim()
  const category = String(formData.get('category') || '')
  const difficulty = String(formData.get('difficulty') || '') as keyof typeof REWARDS

  if (!title || title.length > 120) return { error: 'Quest names must be between 1 and 120 characters' }
  if (!['strength', 'intellect', 'discipline', 'health', 'creativity'].includes(category)) return { error: 'Invalid attribute category' }
  if (!REWARDS[difficulty]) return { error: 'Invalid difficulty' }

  const reward = REWARDS[difficulty]

  const { error } = await supabase.from('quests').insert({
    user_id: user.id,
    title,
    description,
    category,
    difficulty,
    xp_reward: reward.xp,
    gold_reward: reward.gold,
  })

  if (error) {
    console.error('Error creating quest:', error)
    return { error: 'Failed to create quest' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function completeQuest(questId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  // 1. Get the quest
  const { data: quest, error: questError } = await supabase
    .from('quests')
    .select('*')
    .eq('id', questId)
    .eq('user_id', user.id)
    .single()

  if (questError || !quest || quest.completed) {
    return { error: 'Quest not found or already completed' }
  }

  // 2. Mark quest as completed
  const { error: updateError } = await supabase
    .from('quests')
    .update({ 
      completed: true, 
      completed_at: new Date().toISOString() 
    })
    .eq('id', questId)

  if (updateError) return { error: 'Failed to complete quest' }

  // 3. Get User Profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) return { error: 'Profile not found' }

  // 4. Calculate new RPG stats
  let newXp = profile.current_xp + quest.xp_reward
  let newLevel = profile.level
  let leveledUp = false
  
  let xpNeeded = await getXpForNextLevel(newLevel)

  // Handle Level Up
  while (newXp >= xpNeeded) {
    newLevel += 1
    newXp -= xpNeeded
    leveledUp = true
    xpNeeded = await getXpForNextLevel(newLevel)
  }

  const newGold = profile.gold + quest.gold_reward

  // Update specific stat based on category
  const statToUpdate = quest.category.toLowerCase() as 'strength' | 'intellect' | 'discipline' | 'health' | 'creativity'
  const newStatValue = profile[statToUpdate] + 1

  // 5. Update Profile
  const { error: profileUpdateError } = await supabase
    .from('profiles')
    .update({
      level: newLevel,
      current_xp: newXp,
      gold: newGold,
      [statToUpdate]: newStatValue
    })
    .eq('id', user.id)

  if (profileUpdateError) {
    console.error('Profile update error:', profileUpdateError)
  }

  const today = new Date().toISOString().slice(0, 10)
  const { data: streak } = await supabase.from('streaks').select('*').eq('user_id', user.id).single()
  if (streak?.last_activity_date !== today) {
    const previous = streak?.last_activity_date ? new Date(`${streak.last_activity_date}T00:00:00Z`) : null
    const yesterday = new Date(`${today}T00:00:00Z`)
    yesterday.setUTCDate(yesterday.getUTCDate() - 1)
    const continues = previous?.getTime() === yesterday.getTime()
    const currentStreak = continues ? streak.current_streak + 1 : 1
    await supabase.from('streaks').upsert({ user_id: user.id, current_streak: currentStreak, longest_streak: Math.max(streak?.longest_streak || 0, currentStreak), last_activity_date: today })
  }

  revalidatePath('/dashboard')
  
  return { 
    success: true, 
    leveledUp, 
    newLevel,
    xpGained: quest.xp_reward,
    goldGained: quest.gold_reward,
    profile: { ...profile, level: newLevel, current_xp: newXp, gold: newGold, [statToUpdate]: newStatValue }
  }
}

export async function deleteQuest(questId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not logged in' }
  const { error } = await supabase.from('quests').delete().eq('id', questId).eq('user_id', user.id)
  if (error) return { error: 'Failed to delete quest' }
  revalidatePath('/dashboard')
  return { success: true }
}
