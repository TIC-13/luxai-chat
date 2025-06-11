// contexts/ModalContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ModalContextType {
  isVisible: boolean;
  modalContent: ReactNode | null;
  showModal: (content: ReactNode) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalContextProviderProps {
  children: ReactNode;
}

export function ModalContextProvider({ children }: ModalContextProviderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  const showModal = (content: ReactNode) => {
    setModalContent(content);
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ isVisible, modalContent, showModal, hideModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalContextProvider');
  }
  return context;
}