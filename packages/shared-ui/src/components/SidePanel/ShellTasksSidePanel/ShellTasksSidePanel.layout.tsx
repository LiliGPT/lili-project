import { ReduxShellTask } from "@lili-project/lili-store";
import { SidePanelTab } from "../SidePanel/SidePanelTab";
import { useEffect, useRef, useState } from "react";

interface Props {
  shellTasks: ReduxShellTask[];
}

const _shellTaskId = (shellTask: ReduxShellTask) => `${shellTask.project_id}-${shellTask.command}`;

export function ShellTasksSidePanelLayout(props: Props) {
  const { shellTasks } = props;
  const [selectedTab, setSelectedTab] = useState(0);
  const currentShellTask = shellTasks[selectedTab];

  return (
    <div className="bg-primary rounded-lg py-2 px-3 text-sm mb-3">
      {shellTasks.map(task => {
        return (
          <SidePanelTab key={_shellTaskId(task)} label={`${task.command} (${task.pid ?? ''})`} />
        );
      })}
      {!!currentShellTask && (
        <ShellTaskLogs task={currentShellTask} />
      )}
    </div>
  );
}

function ShellTaskLogs(props: { task: ReduxShellTask }) {
  const { task } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        left: 0,
        behavior: 'auto',
      });
    }
  }, [task.logs]);

  return (
    <div ref={containerRef} className="my-2 p-2 h-[400px] overflow-y-auto">
      {task.logs.map(log => {
        return (
          <div key={`${log.text}-${log.timestamp}`}>
            {log.text}
          </div>
        );
      })}
    </div>
  );
}

