'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';

interface SystemLog {
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  delay: number;
}

interface IntroProps {
  onComplete: () => void;
}

const SYSTEM_LOGS: SystemLog[] = [
  { message: 'Initializing secure connection...', type: 'info', delay: 0 },
  { message: 'Establishing encrypted tunnel...', type: 'info', delay: 1000 },
  { message: 'Bypassing firewall protocols...', type: 'warning', delay: 2000 },
  { message: 'Accessing secure mainframe...', type: 'info', delay: 3000 },
  { message: 'Decrypting user credentials...', type: 'warning', delay: 4000 },
  { message: 'Running security protocols...', type: 'info', delay: 5000 },
  { message: 'Verifying biometric data...', type: 'warning', delay: 6000 },
  { message: 'Establishing quantum encryption...', type: 'info', delay: 7000 },
  { message: 'Access granted!', type: 'success', delay: 8000 },
];

const LOADING_CHARS = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export default function Intro({ onComplete }: IntroProps) {
  const router = useRouter();
  const [currentLog, setCurrentLog] = useState<number>(-1);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [glitchText, setGlitchText] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [currentLogIndex, setCurrentLogIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [loadingCharIndex, setLoadingCharIndex] = useState(0);

  useEffect(() => {
    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    // Loading animation
    const loadingInterval = setInterval(() => {
      setLoadingCharIndex(prev => (prev + 1) % LOADING_CHARS.length);
    }, 100);

    // Typing animation
    const typeText = (text: string, index: number) => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        setTimeout(() => typeText(text, index + 1), 50);
      } else {
        setIsTyping(false);
        if (currentLogIndex < SYSTEM_LOGS.length - 1) {
          setTimeout(() => {
            setCurrentLogIndex(prev => prev + 1);
            setIsTyping(true);
          }, 500);
        } else {
          setTimeout(() => {
            onComplete();
          }, 2000);
        }
      }
    };

    if (currentLogIndex >= 0 && currentLogIndex < SYSTEM_LOGS.length && isTyping) {
      typeText(SYSTEM_LOGS[currentLogIndex].message, 0);
    }

    return () => {
      clearInterval(cursorInterval);
      clearInterval(loadingInterval);
    };
  }, [currentLogIndex, isTyping, onComplete]);

  useEffect(() => {
    setCurrentLogIndex(0);
    setIsTyping(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background/80 p-4 relative overflow-hidden">
      <Card className="w-full max-w-4xl h-[80vh] rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl relative z-10 animate-glow">
      {/* Scan line effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-[2px] animate-scan" />

      <div className="w-full max-w-2xl p-6 font-mono text-sm relative z-10">
        <div className="space-y-4">
          {SYSTEM_LOGS.map((log, index) => (
            <div
              key={index}
              className={`${
                index <= currentLogIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-sm ${
                  log.type === 'info' ? 'text-blue-400' :
                  log.type === 'warning' ? 'text-yellow-400' :
                  log.type === 'success' ? 'text-primary' :
                  'text-red-400'
                }`}>
                  {log.type === 'info' ? '[*]' :
                   log.type === 'warning' ? '[!]' :
                   log.type === 'success' ? '[+]' :
                   '[-]'}
                </span>
                <span className="text-foreground relative">
                  {index === currentLogIndex ? displayedText : log.message}
                  {index === currentLogIndex && showCursor && isTyping && (
                    <span className="animate-pulse">_</span>
                  )}
                </span>
              </div>
              {index === currentLogIndex && index < SYSTEM_LOGS.length - 1 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center gap-2 text-foreground/60">
                    <span className="text-primary animate-pulse">{LOADING_CHARS[loadingCharIndex]}</span>
                    <span>Processing...</span>
                  </div>
                  
                </div>
              )}
            </div>
          ))}
          {currentLogIndex === SYSTEM_LOGS.length - 1 && (
            <div className="mt-4 text-primary animate-pulse">
              <div className="flex items-center gap-2">
                <span>[+]</span>
                <span>Welcome to the system</span>
              </div>
              <div className="mt-2 text-foreground/60">
                Redirecting to main interface...
              </div>
            </div>
          )}
        </div>
      </div>
      </Card>
    </div>
  );
} 