import { useEffect } from "react";
import { isRegistered, register, unregister, unregisterAll } from '@tauri-apps/api/globalShortcut';

type Callback = (() => void) | (() => Promise<void>);

export async function useKeyboardShortcuts(shortcuts: Record<string, Callback>) {
  function registerShortcut(shortcut: string, callback: Callback) {
    unregister(shortcut).then(() => {
      setTimeout(() => {
        register(shortcut, callback).catch((err) => {
          console.error(err);
        });
      }, 3000);
    });
  }

  useEffect(() => {
    Object.entries(shortcuts).forEach(([shortcut, callback]) => {
      registerShortcut(shortcut, callback);
    });
  }, []);
}

