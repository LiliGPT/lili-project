import { appWindow, WebviewWindow } from '@tauri-apps/api/window';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export function App() {

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

  return (
    <div>
      <h1>Hello, world!</h1>
    </div>
  );
}
