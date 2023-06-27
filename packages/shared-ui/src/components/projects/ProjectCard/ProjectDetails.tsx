import { ReduxCodeProject } from "@lili-project/lili-store";
import { RunnableCommand, RunnableCommandStatus } from "../RunnableCommand";
import { CustomButton } from "../../Button";

interface Props {
  project: ReduxCodeProject;
}

export function ProjectDetails(props: Props) {
  const { project } = props;
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
                onClick={() => {}}
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
              status={RunnableCommandStatus.Idle}
              onPlay={() => { }}
              onStop={() => { }}
            />
          ))}
        </div>
      </div>
    </>
  );
}