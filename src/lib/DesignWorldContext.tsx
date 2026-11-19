import React, { createContext, useContext, useState, useEffect } from "react";

export type DesignWorld = "atelier" | "cinema" | "radar" | "brutalist";

interface DesignWorldContextProps {
  world: DesignWorld;
  setWorld: (w: DesignWorld) => void;
  sensoryMood: number; // 0 = Soft/Sensual, 50 = Dinner/GFE, 100 = Late-Night/Wild
  setSensoryMood: (m: number) => void;
}

const DesignWorldContext = createContext<DesignWorldContextProps>({
  world: "cinema",
  setWorld: () => {},
  sensoryMood: 50,
  setSensoryMood: () => {},
});

export function DesignWorldProvider({ children }: { children: React.ReactNode }) {
  const [world, setWorldState] = useState<DesignWorld>("cinema");
  const [sensoryMood, setSensoryMood] = useState<number>(50);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("iwsn_world") as DesignWorld) : null;
    if (saved && ["atelier", "cinema", "radar", "brutalist"].includes(saved)) {
      setWorldState(saved);
    }
  }, []);

  const setWorld = (w: DesignWorld) => {
    setWorldState(w);
    if (typeof window !== "undefined") {
      localStorage.setItem("iwsn_world", w);
    }
  };

  return (
    <DesignWorldContext.Provider value={{ world, setWorld, sensoryMood, setSensoryMood }}>
      <div className={`world-${world} min-h-screen transition-colors duration-700`}>
        {children}
      </div>
    </DesignWorldContext.Provider>
  );
}

export const useDesignWorld = () => useContext(DesignWorldContext);