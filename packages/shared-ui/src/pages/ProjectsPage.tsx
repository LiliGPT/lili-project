import { ReduxLoadingStatus, selectAllProject, selectProjectError, selectProjectLoadingStatus, useAppDispatch } from '@lili-project/lili-store';
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
  const projects = useSelector(selectAllProject());
  const status = useSelector(selectProjectLoadingStatus());
  const error = useSelector(selectProjectError());

  return <div className="text-white">
    {status === ReduxLoadingStatus.Success && (
      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.project_uid}
              project={project}
            />
          ))}
        </div>
        <SidePanel />
      </div>
    )}

    {status === ReduxLoadingStatus.Error && <pre>error: {String(error)}</pre>}

    {status === ReduxLoadingStatus.Loading && <pre>loading...</pre>}
  </div>;
}
