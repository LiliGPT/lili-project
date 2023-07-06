import { selectAllProject, selectShellTasks, useAppSelector } from "@lili-project/lili-store";
import { ShellTasksSidePanel } from "../ShellTasksSidePanel";
import { MissionActionsSidePanel } from "../MissionActionsSidePanel";

export function SidePanel() {
  return(
    <div className="grid grid-cols-1">
      <MissionActionsSidePanel />
      <ShellTasksSidePanel />
    </div>
  );
}
