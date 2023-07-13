import React from "react";
import ReactDOM from "react-dom/client";
import { PlatformClient, RustPlatformClient, TauriInvokeFn, TauriShellModule } from "@lili-project/lili-store";
import { invoke, shell } from "@tauri-apps/api";

PlatformClient.setClient(new RustPlatformClient(
  invoke as unknown as TauriInvokeFn,
  shell as unknown as TauriShellModule
));

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div>mission_popup</div>
  </React.StrictMode>
);

