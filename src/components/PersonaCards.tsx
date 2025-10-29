"use client";

import { useRouter } from "next/navigation";
import { usePersona } from "@/contexts/PersonaContext";
import { Card, CardContent } from "@/components/ui/card";
import { User, Briefcase, Heart } from "lucide-react";

const personaData = [
  {
    id: "sheela",
    name: "Sheela",
    role: "Freelance Designer",
    description:
      "Pregnant woman balancing freelance work, wellness, and preparing for motherhood",
    icon: Heart,
    gradient: "from-pink-500/20 to-purple-500/20",
    iconColor: "text-pink-600",
    activities: ["Prenatal Yoga", "Meditation", "Client Calls", "Family Time"],
  },
  {
    id: "ritvik",
    name: "Ritvik",
    role: "DevOps Engineer",
    description:
      "Tech professional balancing DevOps work, skill development, and personal wellness",
    icon: User,
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-600",
    activities: ["Code Review", "AI Course", "Workout", "Gaming"],
  },
  {
    id: "gourav",
    name: "Gourav",
    role: "Startup Founder",
    description:
      "Entrepreneur managing startup growth, investor relations, and work-life balance",
    icon: Briefcase,
    gradient: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-orange-600",
    activities: [
      "Investor Meetings",
      "Design Review",
      "Meditation",
      "Family Dinner",
    ],
  },
];

export default function PersonaCards() {
  const router = useRouter();
  const { selectPersona } = usePersona();

  const handlePersonaSelect = (personaId: string) => {
    selectPersona(personaId);
    router.push("/chat");
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
          const Icon = persona.icon;
          return (
            <Card
              key={persona.id}
              className="group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 hover:border-primary/50 overflow-hidden"
            >
              <CardContent className="relative p-6 space-y-4">
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center ${persona.iconColor} mb-4`}
                >
                  <Icon className="w-8 h-8" />
                </div>

                {/* Name & Role */}
                <div>
                  <h3 className="text-2xl font-bold text-secondary mb-1">
                    {persona.name}
                  </h3>
                  <p className="text-sm font-medium text-primary">
                    {persona.role}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-secondary/70 leading-relaxed min-h-[60px]">
                  {persona.description}
                </p>

                {/* Activities */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-secondary/60 mb-2">
                    TYPICAL ACTIVITIES
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {persona.activities.map((activity, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-muted rounded-full text-secondary/80"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handlePersonaSelect(persona.id)}
                  className="w-full mt-4 px-4 py-3 bg-secondary text-white rounded-lg font-medium transition-all duration-300 group-hover:bg-primary group-hover:shadow-lg"
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
