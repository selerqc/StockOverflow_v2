import { useEffect, useState } from "react";
import { useToken } from "../hooks/TokenContext";
import axios from "axios";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { token } = useToken();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, [url]);

  return { data, error };
}

export default useFetch;
