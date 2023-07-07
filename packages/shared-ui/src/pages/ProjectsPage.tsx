import { ReduxLoadingStatus, selectAllProject, selectOpenedProjects, selectProjectError, selectProjectLoadingStatus, useAppDispatch } from '@lili-project/lili-store';
import { BasePage, PageTitle, ProjectCard, SideProjects } from '@lili-project/shared-ui';
import { useSelector } from 'react-redux';
import { SidePanel } from '../components/SidePanel/SidePanel';

export function ProjectsPage() {
  return (
    <BasePage
      side={<SideProjects />}
    >
      <PageTitle title="Projects" />
      <PageContent />
    </BasePage>
  );
}

function PageContent() {
  const dispatch = useAppDispatch();
  const projects = useSelector(selectOpenedProjects());
  const status = useSelector(selectProjectLoadingStatus());
  const error = useSelector(selectProjectError());

  return <div className="text-white w-full">
    {status === ReduxLoadingStatus.Success && (
      <div className="flex flex-row gap-4 w-full">
        <div className="flex flex-col gap-4 w-[45%]">
          {projects.map((project) => (
            <ProjectCard
              key={project.project_uid}
              project={project}
            />
          ))}
        </div>
        <div className="flex flex-col gap-4 flex-grow">
          <SidePanel />
        </div>
      </div>
    )}

    {status === ReduxLoadingStatus.Error && <pre>error: {String(error)}</pre>}

    {status === ReduxLoadingStatus.Loading && <pre>loading...</pre>}
  </div>;
}
