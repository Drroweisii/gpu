import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

interface TelegramUser {
  id: number;
  username?: string;
  firstName: string;
  lastName?: string;
  referralCode?: string;
}

export function useTelegramUser(): TelegramUser | null {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    if (WebApp.initDataUnsafe?.user) {
      const telegramUser = WebApp.initDataUnsafe.user;
      const referralCode = generateReferralCode(telegramUser.id);
      
      setUser({
        id: telegramUser.id,
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        referralCode
      });
    }
  }, []);

  return user;
}

function generateReferralCode(userId: number): string {
  return `REF${userId.toString(36).toUpperCase()}`;
}