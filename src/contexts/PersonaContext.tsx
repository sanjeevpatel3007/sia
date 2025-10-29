'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { personas, type Persona } from '@/lib/persona-calendars'

interface PersonaContextType {
  currentPersona: Persona | null
  selectPersona: (personaId: string) => void
  clearPersona: () => void
  loading: boolean
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined)

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null)
  const [loading, setLoading] = useState(true)

  // Load persona from localStorage on mount
  useEffect(() => {
    const storedPersonaId = localStorage.getItem('selectedPersonaId')
    if (storedPersonaId) {
      const persona = personas.find(p => p.id === storedPersonaId)
      if (persona) {
        setCurrentPersona(persona)
      }
    }
    setLoading(false)
  }, [])

  const selectPersona = (personaId: string) => {
    const persona = personas.find(p => p.id === personaId)
    if (persona) {
      setCurrentPersona(persona)
      localStorage.setItem('selectedPersonaId', personaId)
    }
  }

  const clearPersona = () => {
    setCurrentPersona(null)
    localStorage.removeItem('selectedPersonaId')
  }

  return (
    <PersonaContext.Provider
      value={{
        currentPersona,
        selectPersona,
        clearPersona,
        loading
      }}
    >
      {children}
    </PersonaContext.Provider>
  )
}

export function usePersona() {
  const context = useContext(PersonaContext)
  if (context === undefined) {
    throw new Error('usePersona must be used within a PersonaProvider')
  }
  return context
}
