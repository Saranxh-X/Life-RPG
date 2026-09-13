'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createQuest } from '@/app/actions/quests'
import { X, Sword } from 'lucide-react'

export function AddQuestModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    
    const formData = new FormData(e.currentTarget)
    await createQuest(formData)
    
    setIsPending(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-4"
          >
            <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
              
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Sword className="w-5 h-5 text-primary" />
                  New Quest
                </h2>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Quest Title</label>
                  <input 
                    name="title"
                    type="text" 
                    required 
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="e.g. Complete math homework"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Description (Optional)</label>
                  <textarea 
                    name="description"
                    rows={2}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                    placeholder="Add more details about the quest..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Attribute Category</label>
                    <select 
                      name="category" 
                      required
                      className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
                    >
                      <option value="strength">💪 Strength (Gym, Physical)</option>
                      <option value="intellect">🧠 Intellect (Study, Code)</option>
                      <option value="discipline">⚡ Discipline (Habits, Chores)</option>
                      <option value="health">❤️ Health (Diet, Sleep)</option>
                      <option value="creativity">🎨 Creativity (Art, Writing)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Difficulty</label>
                    <select 
                      name="difficulty" 
                      required
                      className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
                    >
                      <option value="easy">Easy (50 XP)</option>
                      <option value="medium">Medium (100 XP)</option>
                      <option value="hard">Hard (250 XP)</option>
                      <option value="legendary">Legendary (500 XP)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isPending}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {isPending ? 'Accepting...' : 'Accept Quest'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
