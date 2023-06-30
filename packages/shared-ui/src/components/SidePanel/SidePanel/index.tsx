import { selectAllProject, selectShellTasks, useAppSelector } from "@lili-project/lili-store";
import { ShellTasksSidePanel } from "../ShellTasksSidePanel";

export function SidePanel() {
  return(
    <>
      <ShellTasksSidePanel />
    </>
  );
}
