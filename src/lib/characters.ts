// Character definitions - shared across the application
export interface Character {
  name: string;
  slug: string;
  description: string;
  age: number;
  needs: string[];
  classes: string[];
}

export const CHARACTERS: Character[] = [
  {
    name: "Sheela",
    slug: "sheela",
    description: "A pregnant woman focusing on safe movement during maternity.",
    age: 32,
    needs: ["Prenatal health", "Calm mind", "Gentle fitness"],
    classes: ["Prenatal Yoga", "Meditation", "Breathwork"]
  },
  {
    name: "Ritvik",
    slug: "ritvik",
    description: "A full energetic man aiming to stay fit, strong, and focused.",
    age: 41,
    needs: ["Strength training", "Body balance", "Mental focus"],
    classes: ["Pilates", "Gym", "HIIT" ,"Meditation"]
  },
  {
    name: "Maya",
    slug: "maya",
    description: "A beginner focusing on stress relief, flexibility, and mindfulness.",
    age: 27,
    needs: ["Stress reduction", "Flexibility", "Self-care"],
    classes: ["Yoga", "Meditation", "Breathwork"]
  }
  
];

// Get character slugs as an array
export const CHARACTER_SLUGS = CHARACTERS.map((char) => char.slug.toLowerCase());

// Check if a string is a valid character slug
export function isCharacterSlug(slug: string | null | undefined): boolean {
  if (!slug) return false;
  return CHARACTER_SLUGS.includes(slug.toLowerCase());
}

// Get character by slug
export function getCharacterBySlug(slug: string): Character | undefined {
  return CHARACTERS.find((char) => char.slug.toLowerCase() === slug.toLowerCase());
}

