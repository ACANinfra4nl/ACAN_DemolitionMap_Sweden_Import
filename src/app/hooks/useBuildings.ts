import { fetchBuildings } from "@/lib/fetchBuildings";
import { useEffect, useState } from "react";

export const useBuildings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const [buildings, setBuildings] = useState<{
    type: "FeatureCollection";
    features: Awaited<ReturnType<typeof fetchBuildings>>;
  }>();
  useEffect(() => {
    fetchBuildings()
      .then((features) => setBuildings({ type: "FeatureCollection", features }))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { loading, error, buildings };
};
