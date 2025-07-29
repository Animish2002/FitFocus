// src/components/NotificationSettings.jsx (New Component)
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch"; // Assuming you have a Switch component
import { Label } from "@/components/ui/label";
import { Loader2, Bell, BellOff, XCircle } from "lucide-react";
import axiosInstance from "@/api/axiosInstance"; // Your axios instance

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY; // Get from .env.local

console.log("DEBUG: VITE_VAPID_PUBLIC_KEY in frontend:", VAPID_PUBLIC_KEY);

// Helper to convert VAPID public key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  if (!base64String) {
    console.error(
      "urlBase64ToUint8Array received an undefined or null string!"
    );
    throw new Error("VAPID Public Key is missing or invalid.");
  }
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function NotificationSettings() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    // Check initial subscription status
    async function checkSubscription() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setError("Push notifications are not supported by your browser.");
        setIsLoading(false);
        return;
      }

      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
        setStatusMessage(
          !!subscription ? "Notifications are ON." : "Notifications are OFF."
        );
      } catch (err) {
        console.error("Error checking subscription:", err);
        setError("Failed to check notification status.");
      } finally {
        setIsLoading(false);
      }
    }
    checkSubscription();
  }, []);

  const subscribeUser = async () => {
    setIsLoading(true);
    setError(null);
    setStatusMessage("");

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setError("Push notifications are not supported by your browser.");
      setIsLoading(false);
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setError(
          "Notification permission denied. Please enable it in your browser settings."
        );
        setIsLoading(false);
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      };

      const pushSubscription = await registration.pushManager.subscribe(
        subscribeOptions
      );
      console.log("PushSubscription:", JSON.stringify(pushSubscription));

      // Send subscription to your backend
      await axiosInstance.post("/notifications/subscribe", pushSubscription);
      setIsSubscribed(true);
      setStatusMessage("Notifications enabled successfully!");
    } catch (err) {
      console.error("Error subscribing:", err);
      setError("Failed to enable notifications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribeUser = async () => {
    setIsLoading(true);
    setError(null);
    setStatusMessage("");

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        // Optionally, inform your backend to remove the subscription
        // await axiosInstance.post('/notifications/unsubscribe', { endpoint: subscription.endpoint });
      }
      setIsSubscribed(false);
      setStatusMessage("Notifications disabled.");
    } catch (err) {
      console.error("Error unsubscribing:", err);
      setError("Failed to disable notifications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Bell className="mr-2 h-5 w-5 text-yellow-400" /> Notification
          Settings
        </CardTitle>
        <CardDescription className="text-gray-400">
          Manage your push notification preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications-toggle" className="text-white text-lg">
            Enable Push Notifications
          </Label>
          <Switch
            id="notifications-toggle"
            checked={isSubscribed}
            onCheckedChange={handleToggle}
            disabled={isLoading}
            className="data-[state=checked]:bg-[#3EB489] data-[state=unchecked]:bg-gray-600"
          />
        </div>
        {isLoading && (
          <p className="text-blue-400 flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking status...
          </p>
        )}
        {statusMessage && !isLoading && (
          <p className="text-gray-300 flex items-center">
            {isSubscribed ? (
              <Bell className="mr-2 h-4 w-4 text-[#3EB489]" />
            ) : (
              <BellOff className="mr-2 h-4 w-4 text-red-400" />
            )}
            {statusMessage}
          </p>
        )}
        {error && !isLoading && (
          <p className="text-red-400 flex items-center">
            <XCircle className="mr-2 h-4 w-4" /> {error}
          </p>
        )}
        <Button
          onClick={() =>
            axiosInstance.post("/notifications/send-test", {
              title: "Test Notif",
              body: "This is a test notification from FitFocus!",
              url: "/dashboard",
            })
          }
          disabled={!isSubscribed || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md mt-4"
        >
          Send Test Notification
        </Button>
      </CardContent>
    </Card>
  );
}
