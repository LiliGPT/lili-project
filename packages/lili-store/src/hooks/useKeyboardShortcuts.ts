import { useCallback, useEffect } from "react";

type Callback = (() => void) | (() => Promise<void>);

export function useKeyboardShortcuts(shortcuts: Record<string, Callback>, deps: any[] = [], debug = false) {
  const onKeyDown = useCallback(function onKeyDownHandler(event: KeyboardEvent) {
    let mappedKeyName = '';
    const isAlt = event.altKey;
    const isCtrl = event.ctrlKey;
    const isShift = event.shiftKey;
    const keyName = event.key;

    if (isAlt) {
      mappedKeyName += 'A-';
    } else if (isCtrl) {
      mappedKeyName += 'C-';
    } else if (isShift) {
      mappedKeyName += 'S-';
    }

    mappedKeyName += keyName;

    if (debug) console.log(`key pressed: ${mappedKeyName}`);

    if (shortcuts[mappedKeyName]) {
      if (debug) console.log('trigger shortcut: ', mappedKeyName);
      shortcuts[mappedKeyName]();
    }
  }, [shortcuts, ...deps]);

  function registerShortcuts() {
    document.addEventListener('keydown', onKeyDown);
  }

  function unregisterShortcuts() {
    document.removeEventListener('keydown', onKeyDown);
  }

  useEffect(() => {
    registerShortcuts();

    return () => unregisterShortcuts();
  }, deps);
}

