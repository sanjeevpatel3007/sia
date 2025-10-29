'use client'
import React from 'react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X } from 'lucide-react'
import TypewriterText from '@/components/TypewriterText'


import { useRouter } from "next/navigation";
import Character from '@/components/character'

export default function Home() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const hasProcessedUrl = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (hasProcessedUrl.current) return;

    // Check for URL parameters to show notifications
    const urlParams = new URLSearchParams(window.location.search);
    const calendarPermission = urlParams.get("calendar_permission");
    const error = urlParams.get("error");

    if (calendarPermission === "success") {
      // Use setTimeout to defer state update
      setTimeout(() => {
        setNotification({
          type: "success",
          message:
            "Calendar permission granted successfully! You can now access your Google Calendar through SIA.",
        });
      }, 0);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      hasProcessedUrl.current = true;
    } else if (error === "calendar_permission_failed") {
      // Use setTimeout to defer state update
      setTimeout(() => {
        setNotification({
          type: "error",
          message: "Failed to grant calendar permission. Please try again.",
        });
      }, 0);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      hasProcessedUrl.current = true;
    }
  }, []);

  const handleTalkWithSIA = () => {
    if (user) {
      router.push("/chat");
    } else {
      // User not authenticated, trigger Google OAuth redirect
      signInWithGoogle();
    }
  };

  return (
    <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-start items-center">
      {/* Notification */}
      {notification && (
        <Card
          className={`fixed top-4 right-4 z-50 max-w-md ${notification.type === "success"
              ? "border-primary bg-primary/10"
              : "border-destructive bg-destructive/10"
            }`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {notification.message}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setNotification(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="relative flex flex-col justify-start items-center w-full">
        {/* Main container with proper margins */}
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
          {/* Left vertical line */}
          <div className="w-px h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          {/* Right vertical line */}
          <div className="w-px h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          <div className="self-stretch pt-[9px] overflow-hidden border-b border-[rgba(55,50,47,0.06)] flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[66px] relative z-10">
            {/* Navigation */}
            <div className="w-full h-12 sm:h-14 md:h-16 lg:h-[84px] absolute left-0 top-0 flex justify-center items-center z-[120] px-6 sm:px-8 md:px-12 lg:px-0 pointer-events-auto">
              <div className="w-full h-0 absolute left-0 top-6 sm:top-7 md:top-8 lg:top-[42px] border-t border-[rgba(55,50,47,0.12)] shadow-[0px_1px_0px_white] z-10 pointer-events-none"></div>

              <div className="w-full max-w-[calc(100%-32px)] sm:max-w-[calc(100%-48px)] md:max-w-[calc(100%-64px)] lg:max-w-[700px] lg:w-[700px] h-10 sm:h-11 md:h-12 py-1.5 sm:py-2 px-3 sm:px-4 md:px-4 pr-2 sm:pr-3 bg-[#F7F5F3] backdrop-blur-sm shadow-[0px_0px_0px_2px_white] overflow-hidden rounded-[50px] flex justify-between items-center relative z-[130] pointer-events-auto">
                <div className="flex justify-center items-center pointer-events-none">
                  <div className="flex justify-start items-center">
                    <div className="flex flex-col justify-center text-secondary text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-5 font-sans">
                      SIA
                    </div>
                  </div>
                  <div className="pl-3 sm:pl-4 md:pl-5 lg:pl-5 hidden sm:flex flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-4">
                    <div className="flex justify-start items-center cursor-pointer pointer-events-none">
                      <div className="flex flex-col justify-center text-secondary/80 text-xs md:text-[13px] font-medium leading-[14px] font-sans">
                        SAMA
                      </div>
                    </div>
                    <div className="flex justify-start items-center">
                      <div className="flex flex-col justify-center text-secondary/80 text-xs md:text-[13px] font-medium leading-[14px] font-sans">
                        About
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-6 sm:h-7 md:h-8 flex justify-start items-start gap-2 sm:gap-3 relative z-50 pointer-events-auto">
                  <button
                    onClick={() => (user ? signOut() : signInWithGoogle())}
                    className={`px-2 sm:px-3 md:px-[14px] py-1 sm:py-[6px] overflow-hidden rounded-full flex justify-center items-center cursor-pointer shadow-[0px_1px_2px_rgba(55,50,47,0.12)] transition-colors relative z-[140] pointer-events-auto ${user
                        ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        : "bg-white text-secondary hover:bg-white/90"
                      }`}
                    aria-label={user ? "Log out" : "Log in"}
                  >
                    <span className="flex flex-col justify-center text-xs md:text-[13px] font-medium leading-5 font-sans">
                      {user ? "Log out" : "Log in"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[120px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full sm:pl-0 sm:pr-0 pl-0 pr-0 relative z-20">
              <div className="w-full max-w-[937px] lg:w-[937px] flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                <div className="self-stretch rounded-[3px] flex flex-col justify-center items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                  <div className="w-full max-w-[748.71px] lg:w-[748.71px] text-center flex justify-center flex-col text-secondary text-[24px] xs:text-[28px] sm:text-[36px] md:text-[52px] lg:text-[80px] font-normal leading-[1.1] sm:leading-[1.15] md:leading-[1.2] lg:leading-24 font-serif px-2 sm:px-4 md:px-0">
                    Stronger, Calmer.
                    <br />
                    For Life.
                  </div>
                  <div className="w-full max-w-[506.08px] lg:w-[506.08px] text-center flex justify-center flex-col text-secondary/80 sm:text-lg md:text-3xl leading-[1.4] sm:leading-[1.45] md:leading-normal lg:leading-7 font-sans px-2 sm:px-4 md:px-0 font-medium">
                    <TypewriterText
                      texts={[
                        "Calendar‑personalized",
                        "Memory‑aware guidance"
                      ]}
                      speed={80}
                      pauseTime={3000}
                    />
                  </div>
                  <div className="w-full max-w-[506.08px] lg:w-[506.08px] text-center flex justify-center flex-col text-secondary/80 sm:text-lg md:text-xl leading-[1.4] sm:leading-[1.45] md:leading-normal lg:leading-7 font-sans px-2 sm:px-4 md:px-0 lg:text-lg font-medium text-sm">
                    Mindful coaching for modern life — balanced, calm, and sustainable.
                    <br className="hidden sm:block" />
                    Welcome to SAMA.
                  </div>
                </div>
              </div>

              <Character />
              <div className="w-full max-w-[497px] lg:w-[497px] flex flex-col justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 relative z-30 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
                <div className="backdrop-blur-[8.25px] flex justify-start items-center gap-4 relative z-50">
                  <button
                    onClick={handleTalkWithSIA}
                    aria-label="Talk with SIA"
                    className="h-10 sm:h-11 md:h-12 px-6 sm:px-8 md:px-10 lg:px-12 py-2 sm:py-[6px] relative z-50 bg-secondary shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] overflow-hidden rounded-full flex justify-center items-center cursor-pointer"
                  >
                    <div className="w-20 sm:w-24 md:w-28 lg:w-44 h-[41px] absolute left-0 top-[-0.5px] bg-linear-to-b from-[rgba(255,255,255,0)] to-[rgba(0,0,0,0.10)] mix-blend-multiply pointer-events-none"></div>
                    <span className="flex flex-col justify-center text-white text-sm sm:text-base md:text-[15px] font-medium leading-5 font-sans">
                      💬 Talk with SIA
                    </span>
                  </button>
                </div>

                {/* Features Section */}
                {/* <div className="w-full max-w-[600px] flex flex-col items-center gap-4 sm:gap-6">
                  <div className="text-center text-secondary/70 text-sm sm:text-base font-medium">
                    Smart Personalization with Calendar & Memory
                  </div>

                  <div className="flex items-center justify-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-secondary/20">
                      <Image
                        src="/images/calendar.png"
                        alt="Google Calendar"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                      <span className="text-xs sm:text-sm font-medium text-secondary">
                        Calendar
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-secondary/20">
                      <svg
                        className="w-6 h-6 text-secondary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                      <span className="text-xs sm:text-sm font-medium text-secondary">
                        AI Memory
                      </span>
                    </div>
                  </div>

                  <div className="text-center text-secondary/60 text-xs sm:text-sm max-w-[500px]">
                    Get personalized wellness guidance based on your schedule
                    and remember your preferences for a truly tailored
                    experience.
                  </div>
                </div> */}
              </div>

              {/* SAMA Philosophy Section */}
              {/* <div className="w-full max-w-[600px] mt-12 sm:mt-16 md:mt-20 lg:mt-24">
                <div className="bg-accent/20 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-accent/30">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-accent-foreground text-center">
                    What is SAMA?
                  </h3>
                  <p className="text-base sm:text-lg text-accent-foreground/90 mb-4 text-center">
                    SAMA (सम) is a state of calmness and tranquility of the
                    mind, a perfect state of balance.
                  </p>
                  <p className="text-base sm:text-lg text-accent-foreground/90 mb-4 text-center">
                    We are patient and gentle by design.
                  </p>
                  <p className="text-base sm:text-lg font-medium text-accent-foreground text-center">
                    Come, #FindYourSAMA
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
