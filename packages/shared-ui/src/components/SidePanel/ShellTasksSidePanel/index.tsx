import { selectShellTasks, useAppSelector } from "@lili-project/lili-store";
import { ShellTasksSidePanelLayout } from "./ShellTasksSidePanel.layout";

interface Props {
}

export function ShellTasksSidePanel(props: Props) {
  const shellTasks = useAppSelector(selectShellTasks());
  return <ShellTasksSidePanelLayout
    shellTasks={shellTasks}
  />
}
