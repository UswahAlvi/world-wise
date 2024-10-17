import { useState } from "react";

export function useGeoLocation(p=null) {
  const [position, setPosition] = useState(p);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function getLocation() {
    if (!navigator.geolocation) {
      setError("Your browser does not support geolocation");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }

  return {position, error, isLoading, getLocation};
}