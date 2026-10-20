import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import Loading from "../components/Loading";

interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setLoading: (percent: number) => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const isSkip = typeof window !== "undefined" && window.location.search.includes("skipLoader=true");
  const [isLoading, setIsLoading] = useState(!isSkip);
  const [loading, setLoading] = useState(0);
  const [mountChildren, setMountChildren] = useState(isSkip);

  const value = {
    isLoading,
    setIsLoading,
    setLoading,
  };

  useEffect(() => {
    if (isSkip) {
      import("../components/utils/initialFX").then((m) => m.initialFX());
      return;
    }
    // Defer mounting heavy background components by 1.0s
    // so frame 1 has 100% thread exclusivity (eliminates lag!)
    const timer = setTimeout(() => {
      setMountChildren(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isSkip]);

  return (
    <LoadingContext.Provider value={value as LoadingType}>
      {isLoading && <Loading percent={loading} />}
      {mountChildren && <main className={`main-body ${isSkip ? "main-active" : ""}`}>{children}</main>}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
