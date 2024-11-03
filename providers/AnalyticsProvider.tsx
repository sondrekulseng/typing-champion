import { app } from "@/firebase.config";
import { getAnalytics } from "firebase/analytics";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode
}

const AnalyticsProvider = ({ children }: Readonly<Props>) => {

  useEffect(() => {
    getAnalytics(app)
  }, [children]);

  return children;
};

export default AnalyticsProvider;