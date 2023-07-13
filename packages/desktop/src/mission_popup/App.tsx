import { appWindow, WebviewWindow } from '@tauri-apps/api/window';
import { useEffect } from 'react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useQueryString } from '../hooks/useQueryString';

export function App() {
  const qs = useQueryString<{ project_dir: string }>();
  useKeyboardShortcuts({
    "Escape": async () => {
      console.log("Escape pressed");
      // appWindow.close();
      const mainWin = WebviewWindow.getByLabel("main");
      await mainWin.hide();
      await mainWin.show();
      await mainWin.setFocus();
    }
  }, false);

  useEffect(() => {
    console.log(qs);
  }, []);

  return (
    <div>
      <h1>Hello, world!</h1>
    </div>
  );
}
