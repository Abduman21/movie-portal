import { useEffect, useState } from "react";
// A stable loader prevents repeat requests; aborts protect against stale results.
export function useAsync(loader) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({
    data: null,
    error: null,
    loading: true,
  });
  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, error: null, loading: true });
    loader(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted)
          setState({ data, error: null, loading: false });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setState({ data: null, error: error.message, loading: false });
      });
    return () => controller.abort();
  }, [loader, attempt]);
  return { ...state, retry: () => setAttempt((value) => value + 1) };
}
