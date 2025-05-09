import React, { createContext, ReactNode, useContext, useState } from 'react';

type RagContextType = {
  ragContexts: string[];
  setRagContexts: (newArray: string[]) => void;
};

const RagContext = createContext<RagContextType | undefined>(undefined);

export const RagContextProvider = ({ children }: { children: ReactNode }) => {
  const [ragContexts, setRagContexts] = useState<string[]>([]);

  return (
    <RagContext.Provider value={{ ragContexts, setRagContexts }}>
      {children}
    </RagContext.Provider>
  );
};

export const useRagContext = () => {
  const context = useContext(RagContext);
  if (!context) throw new Error('useRagContext must be used within a RagContextProvider');
  return context;
};
