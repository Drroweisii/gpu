import React from 'react';
import { useTelegramUser } from '../hooks/useTelegramUser';

export function ModernHeader() {
  const user = useTelegramUser();

  return (
    <header className="h-16 bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="h-full flex items-center justify-between px-4">
        <h1 className="text-lg font-bold tracking-[0.2em] bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          EMSX MINER
        </h1>
        {user && (
          <div className="text-sm text-gray-400">
            @{user.username || user.firstName}
          </div>
        )}
      </div>
    </header>
  );
}