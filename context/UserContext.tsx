import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type User = {
  id: string;
  name: string;
  phone: string;
};

type SaveUserInput = {
  name: string;
  phone: string;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  saveUser: (data: SaveUserInput) => Promise<User>;
  clearUser: () => Promise<void>;
};

const STORAGE_KEY = 'my_app_user_v1';

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  saveUser: async () => {
    throw new Error('saveUser не инициализирован');
  },
  clearUser: async () => {
    throw new Error('clearUser не инициализирован');
  },
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: User = JSON.parse(raw);
          setUser(parsed);
        }
      } catch (error) {
        console.log('Ошибка загрузки пользователя:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const saveUser = async (data: SaveUserInput) => {
    const cleanPhone = data.phone.replace(/\D/g, '');
    const cleanName = data.name.trim().replace(/\s+/g, ' ');

    const nextUser: User = {
      id: user?.id || `CL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: cleanName,
      phone: cleanPhone,
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);

    return nextUser;
  };

  const clearUser = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, saveUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);