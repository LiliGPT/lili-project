import { MissionAction, SelectedMissionActions } from "@lili-project/lili-store"
import { PreviewFile } from "./PreviewFile";

interface Props {
  actions: SelectedMissionActions;
}

export function MissionActionsSidePanelLayout(props: Props) {
  const { actions: { rows } } = props;

  return (
    <div className="bg-primary px-3 py-2 rounded-xl flex-1">
      {rows.map((row, index) => {
        const rowkey = `r-${index}`;
        return (
          <div key={rowkey}>
            {row.actions.map((action, index) => {

              const original_content = row.context_files.find((file) => file.path === action.path)?.content;
              return (
                <PreviewFile
                  key={`${index}-${action.path}-${action.action_type}`}
                  content={action.content}
                  original_content={original_content}
                />
              );
            })}
          </div>
        );
      })}
      {/*<pre className="text-sm">{JSON.stringify(actions, null, 2)}</pre>*/}
    </div>
  );
}

