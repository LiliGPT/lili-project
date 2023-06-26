import React from 'react';
import { BasePage, PageTitle, SharedUi, SideProjects, store, useAppDispatch } from '@lili-project/shared-ui';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { fetchProject, selectAllProject, selectProjectLoadingStatus } from '@lili-project/lili-store';

export default function App() {
  return (
    <Provider store={store}>
      <BasePage
        side={<SideProjects />}
      >
        <PageTitle title="Projects" />
        <Testme />
      </BasePage>
    </Provider>
  );
}

function Testme() {
  const projects = useSelector(selectAllProject());
  const dispatch = useAppDispatch();
  const loading = useSelector(selectProjectLoadingStatus());

  const onClick = () => {
    dispatch(fetchProject());
  };

  return <>
    {loading === 'loaded' && <pre>{JSON.stringify(projects, null, 4)}</pre>}

    <button onClick={onClick}>fetch</button>
  </>;
}