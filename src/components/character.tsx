'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/Character-card'
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
     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full">
        {characters.map((character) => (
          <Card
            key={character.slug}
            className="cursor-pointer hover:shadow-lg transition-shadow border-secondary/20"
            onClick={() => handleCharacterSelect(character)}
          >
            <CardHeader>
              <CardTitle>{character.name}</CardTitle>
              <CardDescription>
                {character.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-secondary/70 text-sm">
                {character.age} years old
                <br />
                Classes: {character.classes.join(', ')}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCharacterSelect(character)
                }}
              >
                {character.name} Chats
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CharacterSelector
