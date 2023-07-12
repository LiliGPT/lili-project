import { ReduxCodeProject, useAppDispatch, addShellTaskThunk, removeShellTaskThunk, stopShellTaskThunk } from "@lili-project/lili-store";
import { RunnableCommand } from "../RunnableCommand";
import { CustomButton } from "../../Button";

interface Props {
  project: ReduxCodeProject;
}

export function ProjectDetails(props: Props) {
  const { project } = props;
  const dispatch = useAppDispatch();
  const project_id = project.project_uid;

  const onPlayCommand = (command: string) => async () => {
    await dispatch(addShellTaskThunk({
      command,
      project_id,
    }));
  };

  const onStopCommand = (command: string) => async () => {
    await dispatch(stopShellTaskThunk({
      command,
      project_id,
    }));
  };

  return (
    <>
      <div className="ProjectCard_data">
        <div className="ProjectCard_data_item">
          <div className="ProjectCard_data_item_label">
            Code Language:
          </div>
          <div className="ProjectCard_data_item_value">
            {project.data.code_language}
          </div>
        </div>

        <div className="ProjectCard_data_item">
          <div className="ProjectCard_data_item_label">
            Framework:
          </div>
          <div className="ProjectCard_data_item_value">
            {project.data.framework}
          </div>
        </div>

        <div className="ProjectCard_data_item">
          <div className="ProjectCard_data_item_label">
            Dependencies:
          </div>
          <div className="ProjectCard_data_item_value">
            {project.data.dependencies_installed ? 'Installed' : 'Not installed'}

            {!project.data.dependencies_installed && (
              <CustomButton
                label="Install"
                size="small"
                variant="secondary"
                disabled={false}
                onClick={() => { /** */ }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="ProjectCard_actions">
        <h3 className="ProjectCard_actions_title">
          Server commands
        </h3>
        <div className="ProjectCard_actions_list">
          {project.data.local_server_commands.map((command) => (
            <RunnableCommand
              key={command}
              label={command}
              project_id={project_id}
              command={command}
              onPlay={onPlayCommand(command)}
              onStop={onStopCommand(command)}
            />
          ))}
        </div>
      </div>

      <div className="ProjectCard_actions">
        <h3 className="ProjectCard_actions_title">
          Test scripts
        </h3>
        <div className="ProjectCard_actions_list">
          {Object.entries(project.data.test_scripts).map(([commandKey, commandValue], index) => (
            <RunnableCommand
              key={`${index}-${commandKey}`}
              label={commandKey}
              project_id={project_id}
              command={commandValue}
              onPlay={async () => { /** */ }}
              onStop={async () => { /** */ }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
