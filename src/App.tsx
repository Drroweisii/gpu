import React from 'react';
import { ModernGameLayout } from './components/ModernGameLayout';
import { useGameState } from './hooks/useGameState';

export default function App() {
  const { gameState } = useGameState();

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-900 text-white overflow-hidden">
      <ModernGameLayout gameState={gameState} />
    </div>
  );
}