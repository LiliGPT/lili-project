import { ReduxCoreView, pickProjectThunk, platformSignInThunk, selectCoreView, store, useAppDispatch, useAppSelector, useComponentDidMount } from '@lili-project/lili-store';
import { ProjectsPage } from './ProjectsPage';
import { SignInPage } from './SignInPage';
import { Provider } from 'react-redux';
import { TailwindGeneratorPage } from './TailwindGeneratorPage';

export function AppContent() {
  return (
    <Provider store={store}>
      <AppInnerContent />
    </Provider>
  );
}

function AppInnerContent() {
  const dispatch = useAppDispatch();
  const view = useAppSelector(selectCoreView());

  useComponentDidMount(async () => {
    await dispatch(platformSignInThunk());
    await dispatch(pickProjectThunk({
      // project_dir: '/home/l/sample-projects/nestjs-example-project',
      project_dir: '/home/l/dasa/checkin/backend',
    }));
  });

  return (
    <>
      {view === ReduxCoreView.CodeProjects && (<ProjectsPage />)}
      {view === ReduxCoreView.SignIn && (<SignInPage />)}
      {view === ReduxCoreView.TailwindGenerator && (<TailwindGeneratorPage />)}
    </>
  );
}
