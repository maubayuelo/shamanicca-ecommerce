import { useEffect } from 'react';

/**
 * Toggle a CSS class on the document body based on a boolean flag.
 * Use to unify overlay/open state handling without inline styles.
 */
export function useBodyClass(className: string, enabled: boolean) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const body = document.body;
    if (enabled) {
      body.classList.add(className);
    } else {
      body.classList.remove(className);
    }
    return () => body.classList.remove(className);
  }, [className, enabled]);
}

/**
 * Imperative helper to add/remove a class on body.
 */
export function setBodyClass(className: string, enabled: boolean) {
  if (typeof document === 'undefined') return;
  const body = document.body;
  if (enabled) body.classList.add(className);
  else body.classList.remove(className);
}
