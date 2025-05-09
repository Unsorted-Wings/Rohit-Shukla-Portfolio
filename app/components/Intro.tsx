'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
interface IntroProps {
  onComplete: () => void;
}

export function Intro({ onComplete }: IntroProps) {
  const [displayText, setDisplayText] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const lines = [
    "Initializing system...",
    "Loading modules...",
    "Establishing connection...",
    "Welcome to Rohit's Portfolio",
    "Type 'help' to begin",
  ];

  useEffect(() => {
    if (lineIndex >= lines.length) {
      setTimeout(onComplete, 1000);
      return;
    }

    const currentLine = lines[lineIndex];
    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayText.length < currentLine.length) {
          setDisplayText(currentLine.slice(0, displayText.length + 1));
        } else {
          // Start deleting after a pause
          setTimeout(() => setIsDeleting(true), 1000);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setLineIndex(prev => prev + 1);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timer);
  }, [displayText, lineIndex, isDeleting, lines, onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-background/80">
      <Card className="w-full max-w-4xl h-[80vh] rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="h-full p-6 font-mono flex items-center justify-center">
          <div className="text-xl md:text-2xl terminal-text">
            <div className="flex items-center">
              <span className="ml-2 text-primary font-bold">$</span>
              <span className="ml-2">{displayText}</span>
              <span className="ml-1 text-primary">_</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 