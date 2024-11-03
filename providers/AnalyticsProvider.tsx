import { app } from "@/firebase.config";
import { getAnalytics } from "firebase/analytics";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode,
  enabled: boolean
}

const AnalyticsProvider = ({ children, enabled }: Readonly<Props>) => {

  useEffect(() => {
    if (enabled) {
      getAnalytics(app)
    }
  }, []);

  return children;
};

export default AnalyticsProvider;