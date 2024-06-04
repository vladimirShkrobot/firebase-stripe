import { useEffect, useState } from "react";

interface IOptions {
  enable: boolean;
}

export const useFetching = <T>(
  callback: () => Promise<T>,
  options: IOptions = { enable: true }
) => {
  const [data, setData] = useState<null | T>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await callback();
      setData(result);
    } catch (e) {
      if (
        typeof e === "object" &&
        e !== null &&
        "message" in e &&
        typeof e.message === "string"
      ) {
        setError(e.message || "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.enable) {
      fetchData();
    }
  }, [options.enable]);

  return { data, loading, error };
};
