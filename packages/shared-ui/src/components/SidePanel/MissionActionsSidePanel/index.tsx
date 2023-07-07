import { selectSelectedMissionActions, useAppDispatch, useAppSelector } from "@lili-project/lili-store";
import { MissionActionsSidePanelLayout } from "./MissionActionsSidePanel.layout";

export function MissionActionsSidePanel() {
  const dispatch = useAppDispatch();
  const actions = useAppSelector(selectSelectedMissionActions());
  const countActionFiles: number = actions?.rows?.reduce((acc, action) => {
    return acc + action.actions.length;
  }, 0) ?? 0;

  if (!countActionFiles) {
    return null;
  }

  return <MissionActionsSidePanelLayout
    actions={actions}
  />
}
