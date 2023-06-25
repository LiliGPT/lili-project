import { BasePage, PageTitle, SharedUi, SideProjects } from '@lili-project/shared-ui';

export default async function Index() {
  return (
    <BasePage
      side={<SideProjects />}
    >
      <PageTitle title="Projects" />

    </BasePage>
  );
}
