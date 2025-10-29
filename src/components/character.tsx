'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CHARACTERS, Character } from '@/lib/characters'

const CharacterSelector = () => {
  const router = useRouter()
  
  // Use shared character definitions
  const characters = CHARACTERS

  const handleCharacterSelect = (character: Character) => {
    // Navigate to chat page with character slug as session ID
    router.push(`/chat/${character.slug}`)
  }


  return (
    <div className="w-full max-w-[900px] flex flex-col items-center gap-6 mt-8 sm:mt-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-secondary text-center">
        Choose Your Character
      </h2>
      <p className="text-secondary/70 text-sm sm:text-base text-center mb-4">
        Select a character to start a personalized wellness conversation
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full">
        {characters.map((character) => (
          <Card
            key={character.slug}
            className="cursor-pointer hover:shadow-lg transition-shadow border-secondary/20"
            onClick={() => handleCharacterSelect(character)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-xl font-bold text-secondary mb-2">
                    {character.name}
                  </h3>
                  <p className="text-secondary/70 text-sm">
                    {character.description}
                  </p>
                </div>
              
                
                <Button 
                  className="mt-4 w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCharacterSelect(character)
                  }}
                >
                  Chat with {character.name}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CharacterSelector
