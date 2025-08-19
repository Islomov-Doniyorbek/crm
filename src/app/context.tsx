'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type MenuContextType = {
  isOpen: boolean;
  toggleMenu: () => void;
  setHeaderTitle: (title: string) => void;
  header: string;
};

export const Mcontext = createContext<MenuContextType | undefined>(undefined);

const MProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [header, setHeader] = useState('');

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const setHeaderTitle = (title: string) => {
    setHeader(title);
    console.log(title);
    
  };

  useEffect(() => {
    console.log('Header changed:', header);
  }, [header]);

  return (
    <Mcontext.Provider value={{ isOpen, toggleMenu, setHeaderTitle, header }}>
      {children}
    </Mcontext.Provider>
  );
};

export const useM = () => {
  const ctx = useContext(Mcontext);
  if (!ctx) {
    throw new Error('useM faqat MProvider ichida ishlatiladi');
  }
  return ctx;
};

export default MProvider;
