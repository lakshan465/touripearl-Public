import React, { useEffect, useState } from "react";
import {
  connectWebSocket,
  connectWebSocket3,
  disconnectWebSocket,
} from "./service/websocketService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import notificationSound from "../../assets/sound.mp3";
import { Bell } from "lucide-react";
import Cookies from "js-cookie";

//use for notification
//when tourist make custom tour or accept guide margin, guide recived notification

const Guide = () => {
  
  const id = Cookies.get("UUID");
  const [notifications, setNotifications] = useState([]);
  const [latestNotification, setLatestNotification] = useState(null);
  const touristId = 123; // Replace with actual logged-in tourist ID
  console.log("inside tourist .jsx", touristId);

  useEffect(() => {
    // Function to handle incoming messages
    const onMessageReceived = (message) => {
      console.log("New Notification:", message);
      setNotifications((prev) => [...prev, message]); // Add to the notifications list
      setLatestNotification(message); // Set the latest notification for immediate display

      // Toast notification
      toast.info(`🔔 ${message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Play sound for the notification
      const audio = new Audio(notificationSound);
      audio.play();
    };

    // Connect to WebSocket and subscribe to the specific tourist's notifications
    connectWebSocket(onMessageReceived);
    connectWebSocket3(id, onMessageReceived);

    // Cleanup WebSocket connection on component unmount
    return () => {
      disconnectWebSocket();
    };
  }, [touristId]); // Re-run if touristId changes

  return (
    <div>
      {/* Bell Notification */}
      <div
        className="top-4 right-4 flex items-center gap-2 shadow-lg p-3 rounded-xl cursor-pointer"
        onClick={() => setLatestNotification(false)} // Stop the animation on click
      >
        <Bell
          size={24}
          className={` ${
            latestNotification
              ? "text-red-500 animate-bounce" // Bounce if notification available
              : "text-green-500" // Green if no notification
          }`}
        />
      </div>

      <ToastContainer />
    </div>
  );
};

export default Guide;
