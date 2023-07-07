import { LastExecutions } from "../../missions/LastExecutions";

export function ProjectSidePanel() {
  return (
    <div className="bg-primary py-2 px-0 rounded-xl text-left">
      <h1>ProjectSidePanel</h1>
      <LastExecutions />
    </div>
  );
}

