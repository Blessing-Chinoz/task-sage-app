import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Update network status
    const handleStatusChange = () => {
      setIsOffline(!navigator.onLine);
    };

    // Listen to the online status
    window.addEventListener("online", handleStatusChange);
    window.addEventListener("offline", handleStatusChange);

    // Cleanup when component unmounts
    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-bounce">
      <WifiOff size={16} />
      <span className="font-semibold">You're offline</span>
    </div>
  );
};

export default OfflineIndicator;
