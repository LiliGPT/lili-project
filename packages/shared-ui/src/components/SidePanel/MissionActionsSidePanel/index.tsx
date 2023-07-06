import { selectSelectedMissionActions, useAppDispatch, useAppSelector } from "@lili-project/lili-store";
import { MissionActionsSidePanelLayout } from "./MissionActionsSidePanel.layout";

export function MissionActionsSidePanel() {
  const dispatch = useAppDispatch();
  const actions = useAppSelector(selectSelectedMissionActions());
  return <MissionActionsSidePanelLayout
    actions={actions}
  />
}
