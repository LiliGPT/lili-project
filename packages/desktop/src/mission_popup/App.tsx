import { appWindow, WebviewWindow } from '@tauri-apps/api/window';

export function App() {

  // useKeyboardShortcuts({
  //   "Alt+O": () => {
  //     console.log("Escape pressed");
  //     appWindow.close();
  //     WebviewWindow.getByLabel("main").show();
  //   }
  // });

  return (
    <div>
      <h1>Hello, world!</h1>
    </div>
  );
}
