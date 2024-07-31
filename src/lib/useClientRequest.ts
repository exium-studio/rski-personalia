import { useState, useEffect } from "react";

const useClientRequest = (
  url: string,
  method = "get",
  initialData = null,
  header = null,
  body = null
) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(initialData);

  useEffect(() => {
    // Cleanup function if needed
    return () => {
      // Cleanup code here
    };
  }, []);

  return { loading, error, data };
};

export default useClientRequest;
