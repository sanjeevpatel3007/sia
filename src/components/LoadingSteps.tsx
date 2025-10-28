"use client";

export default function LoadingSteps() {
  return (
    <div className="flex justify-start">
      <div className="inline-flex bg-accent text-accent-foreground px-4 py-2 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-accent-foreground/60 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-accent-foreground/60 rounded-full animate-bounce [animation-delay:150ms]"></div>
            <div className="w-1.5 h-1.5 bg-accent-foreground/60 rounded-full animate-bounce [animation-delay:300ms]"></div>
          </div>
          <span className="text-sm font-medium">Thinking...</span>
        </div>
      </div>
    </div>
  );
}
