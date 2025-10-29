// Character definitions - shared across the application
export interface Character {
  name: string;
  slug: string;
  description: string;
}

export const CHARACTERS: Character[] = [
  {
    name: "Sheela",
    slug: "sheela",
    description: "kjnfjrsndgj smfg",
  },
  {
    name: "Ritvik",
    slug: "ritvik",
    description: "kjnfjrsndg jsmfg",
  },
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

