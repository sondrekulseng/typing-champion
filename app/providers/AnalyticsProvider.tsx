import { initAnalytics } from "@/firebase.config";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode
}

const AnalyticsProvider = ({ children }: Readonly<Props>) => {
  
  useEffect(() => {
    initAnalytics().catch((error) =>
      console.error("Error initializing analytics:", error)
    );
  }, [children]);

  return children;
};

export default AnalyticsProvider;