import React from 'react';
import { BasePage, PageTitle, SharedUi, SideProjects } from '@lili-project/shared-ui';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ReduxLoadingStatus, pickProjectThunk, selectAllProject, selectProjectError, selectProjectLoadingStatus, store, useAppDispatch } from '@lili-project/lili-store';

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
  const dispatch = useAppDispatch();
  const projects = useSelector(selectAllProject());
  const status = useSelector(selectProjectLoadingStatus());
  const error = useSelector(selectProjectError());

  const onClick = async () => {
    dispatch(pickProjectThunk()).unwrap().then((result) => {
      console.log('result', result);
    }).catch((error) => {
      console.log('error', error);
    });
  };

  return <div className="text-white">
    {status === ReduxLoadingStatus.Success && <pre>{JSON.stringify(projects, null, 4)}</pre>}

    {status === ReduxLoadingStatus.Error && <pre>error: {String(error)}</pre>}

    {status === ReduxLoadingStatus.Loading && <pre>loading...</pre>}

    <button onClick={onClick}>fetch</button>
  </div>;
}