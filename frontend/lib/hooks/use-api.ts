import { useEffect, useState } from "react";

interface UseApiState<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useApi<T>(fn: () => Promise<T>) {
  const [state, setState] = useState<UseApiState<T>>({ loading: true });

  useEffect(() => {
    let active = true;
    fn()
      .then((data) => active && setState({ data, loading: false }))
      .catch((err) => active && setState({ loading: false, error: err.message }));
    return () => {
      active = false;
    };
  }, [fn]);

  return state;
}

