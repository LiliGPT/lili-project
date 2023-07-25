export interface ReduxCoreState {
  view: ReduxCoreView;
}

export enum ReduxCoreView {
  CodeProjects = 'CodeProjects',
  TailwindGenerator = 'TailwindGenerator',
  SignIn = 'SignIn',
}
