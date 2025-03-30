// import React, {
//   createContext,
//   useState,
//   useContext,
//   ReactNode,
//   useCallback,
// } from "react";

// interface Notification {
//   id: string;
//   message: string;
//   read: boolean;
// }

// interface NotificationContextType {
//   notifications: Notification[];
//   addNotification: (message: string) => void;
//   markAsRead: (id: string) => void;
//   markAllAsRead: () => void;
//   removeNotification: (id: string) => void;
//   clearNotifications: () => void;
// }

// const NotificationContext = createContext<NotificationContextType | undefined>(
//   undefined
// );

// export const NotificationProvider = ({ children }: { children: ReactNode }) => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);

//   const addNotification = useCallback((message: string) => {
//     const newNotification: Notification = {
//       id: Date.now().toString(),
//       message,
//       read: false,
//     };
//     setNotifications((prev) => [newNotification, ...prev]);
//   }, []);

//   // ✅ Mark a single notification as read
//   const markAsRead = useCallback((id: string) => {
//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, read: true } : n))
//     );
//   }, []);

//   // ✅ Mark all notifications as read
//   const markAllAsRead = useCallback(() => {
//     setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
//   }, []);

//   // ✅ Remove a single notification
//   const removeNotification = useCallback((id: string) => {
//     setNotifications((prev) => prev.filter((n) => n.id !== id));
//   }, []);

//   // ✅ Clear all notifications
//   const clearNotifications = useCallback(() => {
//     setNotifications([]);
//   }, []);

//   return (
//     <NotificationContext.Provider
//       value={{
//         notifications,
//         addNotification,
//         markAsRead,
//         markAllAsRead,
//         removeNotification,
//         clearNotifications,
//       }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotifications = () => {
//   const context = useContext(NotificationContext);
//   if (!context) {
//     throw new Error(
//       "useNotifications must be used within a NotificationProvider"
//     );
//   }
//   return context;
// };

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Notification {
  id: string;
  message: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const STORAGE_KEY = "user_notifications"; // Key for AsyncStorage

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 📌 Load notifications from AsyncStorage when the component mounts
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const storedNotifications = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedNotifications) {
          setNotifications(JSON.parse(storedNotifications));
        }
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    };

    loadNotifications();
  }, []);

  // 📌 Save notifications to AsyncStorage
  const saveNotifications = async (updatedNotifications: Notification[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error("Error saving notifications:", error);
    }
  };

  const addNotification = useCallback((message: string) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      message,
      read: false,
    };
    setNotifications((prev) => {
      const updatedNotifications = [newNotification, ...prev];
      saveNotifications(updatedNotifications); // Save to AsyncStorage
      return updatedNotifications;
    });
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updatedNotifications = prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      saveNotifications(updatedNotifications);
      return updatedNotifications;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updatedNotifications = prev.map((n) => ({ ...n, read: true }));
      saveNotifications(updatedNotifications);
      return updatedNotifications;
    });
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const updatedNotifications = prev.filter((n) => n.id !== id);
      saveNotifications(updatedNotifications);
      return updatedNotifications;
    });
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    saveNotifications([]); 
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearNotifications,
      }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
