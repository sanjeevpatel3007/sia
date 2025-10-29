"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface TypewriterTextProps {
  texts: string[];
  className?: string;
  speed?: number;
  pauseTime?: number;
}

export default function TypewriterText({ 
  texts, 
  className = "", 
  speed = 50, 
  pauseTime = 2000 
}: TypewriterTextProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timeout = setTimeout(() => {
      const fullText = texts[currentTextIndex];
      
      if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        if (currentText === fullText) {
          setTimeout(() => {
            setIsPaused(true);
            setTimeout(() => {
              setIsPaused(false);
              setIsDeleting(true);
            }, pauseTime);
          }, pauseTime);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, isPaused, currentTextIndex, texts, speed, pauseTime]);

  // Get the current icon based on the text being displayed
  const getCurrentIcon = () => {
    const currentTextContent = texts[currentTextIndex];
    if (currentTextContent.includes("Calendar") || currentTextContent.includes("schedule")) {
      return (
        <Image 
          src="/images/calendar.png" 
          alt="Google Calendar" 
          width={20}
          height={20}
          className="w-5 h-5"
        />
      );
     } else if (currentTextContent.includes("Memory") || currentTextContent.includes("remember") || currentTextContent.includes("AI-powered")) {
       return (
         <Image 
           src="/images/memo-ai.jpg" 
           alt="AI Memory" 
           width={20}
           height={20}
           className="w-5 h-5"
         />
       );
    }
    return null;
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {getCurrentIcon()}
      <span>{currentText}</span>
      <span className="animate-pulse">|</span>
    </div>
  );
}
