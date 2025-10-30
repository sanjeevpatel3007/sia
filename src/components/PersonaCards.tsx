"use client";

import { useRouter } from "next/navigation";
import { usePersona } from "@/contexts/PersonaContext";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { generateId } from "ai";

const personaData = [
  {
    id: "sheela",
    name: "Sheela",
    role: "Freelance Designer",
    description:
      "Pregnant woman balancing freelance work, wellness, and preparing for motherhood",
    image: "/images/sheela.png",
    gradient: "from-pink-500/20 to-purple-500/20",
  },
  {
    id: "ritvik",
    name: "Ritvik",
    role: "DevOps Engineer",
    description:
      "Tech professional balancing DevOps work, skill development, and personal wellness",
    image: "/images/ritvik.png",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "gourav",
    name: "Gourav",
    role: "Startup Founder",
    description:
      "Entrepreneur managing startup growth, investor relations, and work-life balance",
    image: "/images/gourav.png",
    gradient: "from-orange-500/20 to-amber-500/20",
  },
];

export default function PersonaCards() {
  const router = useRouter();
  const { selectPersona } = usePersona();

  const handlePersonaSelect = (personaId: string) => {
    selectPersona(personaId);
    const newId = generateId();
    router.push(`/chat/${newId}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">
          Choose Your Wellness Journey
        </h2>
        <p className="text-lg text-secondary/70 max-w-2xl mx-auto">
          Select a persona to experience personalized wellness guidance tailored
          to different lifestyles
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {personaData.map((persona) => {
          return (
            <Card
              key={persona.id}
              className="group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 hover:border-primary/50 overflow-hidden"
            >
              <CardContent className="relative p-6 space-y-4">
                {/* Persona Image */}
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-white shadow-lg">
                  <Image
                    src={persona.image}
                    alt={persona.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Name & Role */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-secondary mb-1">
                    {persona.name}
                  </h3>
                  <p className="text-sm font-medium text-primary">
                    {persona.role}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-secondary/70 leading-relaxed text-center min-h-[60px]">
                  {persona.description}
                </p>

                {/* CTA Button */}
                <button
                  onClick={() => handlePersonaSelect(persona.id)}
                  className="w-full mt-4 px-4 py-3 bg-secondary text-white rounded-lg font-medium transition-all duration-300 group-hover:bg-primary group-hover:shadow-lg cursor-pointer"
                >
                  Start as {persona.name}
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-10 text-sm text-secondary/60">
        <p>
          Each persona has a unique schedule and wellness journey. Switch
          anytime!
        </p>
      </div>
    </div>
  );
}
