import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { PlatformClient, RustPlatformClient, TauriInvokeFn, TauriShellModule } from "@lili-project/lili-store";
import { invoke, shell } from "@tauri-apps/api";

PlatformClient.setClient(new RustPlatformClient(
  invoke as unknown as TauriInvokeFn,
  shell as unknown as TauriShellModule
));

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
