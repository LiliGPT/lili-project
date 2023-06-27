import { ReduxCoreView, selectCoreView, store, useAppSelector } from '@lili-project/lili-store';
import { ProjectsPage } from './ProjectsPage';
import { SignInPage } from './SignInPage';
import { Provider } from 'react-redux';

export function AppContent() {
  return (
    <Provider store={store}>
      <AppInnerContent />
    </Provider>
  );
}

function AppInnerContent() {
  const view = useAppSelector(selectCoreView());
  console.log('view', view);
  return (
    <>
      {view === ReduxCoreView.CodeProjects && (<ProjectsPage />)}
      {view === ReduxCoreView.SignIn && (<SignInPage />)}
    </>
  );
}
