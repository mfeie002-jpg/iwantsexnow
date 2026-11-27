import { useEffect, useRef } from 'react';

// A background tab can miss its timer or a withdrawal. Wake it on return
// and coalesce the focus + visibility events browsers normally send together.
export function useAvailabilityRefresh(
  active: boolean, selection: string, expiry: number | undefined, refresh: () => void
) {
  const action = useRef(refresh);
  useEffect(() => { action.current = refresh; }, [refresh]);
  const history = useRef({ selection:'', expiry:0, lastRefresh:-Infinity });
  useEffect(() => {
    if (!active) {
      history.current.selection = '';
      return;
    }
    if (history.current.selection !== selection) {
      history.current = { selection, expiry:0, lastRefresh:-Infinity };
    }
    const onWake = () => {
      if (document.hidden) return;
      const now = Date.now();
      const deadline = expiry !== undefined && expiry <= now && history.current.expiry !== expiry;
      if (!deadline && now - history.current.lastRefresh < 1000) return;
      if (deadline) history.current.expiry = expiry;
      history.current.lastRefresh = now;
      action.current();
    };
    let timer: number | undefined;
    if (expiry !== undefined && Number.isFinite(expiry) && history.current.expiry !== expiry) {
      timer = window.setTimeout(onWake, Math.max(0, expiry - Date.now() + 1));
    }
    document.addEventListener('visibilitychange', onWake);
    window.addEventListener('focus', onWake);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onWake);
      window.removeEventListener('focus', onWake);
    };
  }, [active, selection, expiry]);
}
