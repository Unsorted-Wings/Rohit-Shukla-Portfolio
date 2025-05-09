'use client';

import { useState } from 'react';
import { Terminal } from './components/Terminal';
import { Intro } from './components/Intro';

export default function Home() {
  const [showTerminal, setShowTerminal] = useState(false);

  return (
    <main className="min-h-screen bg-black">
      {/* {!showTerminal ? (
        <Intro onComplete={() => setShowTerminal(true)} />
      ) : ( */}
        <Terminal />
      {/* )} */}
    </main>
  );
}
