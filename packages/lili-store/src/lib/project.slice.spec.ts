import { fetchProject, projectAdapter, projectReducer } from './project.slice';

describe('project reducer', () => {
  it('should handle initial state', () => {
    const expected = projectAdapter.getInitialState({
      loadingStatus: 'not loaded',
      error: null,
    });

    expect(projectReducer(undefined, { type: '' })).toEqual(expected);
  });

  it('should handle fetchProject', () => {
    let state = projectReducer(undefined, fetchProject.pending(''));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loading',
        error: null,
        entities: {},
        ids: [],
      })
    );

    state = projectReducer(state, fetchProject.fulfilled([{ id: 1 }], ''));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loaded',
        error: null,
        entities: { 1: { id: 1 } },
        ids: [1],
      })
    );

    state = projectReducer(
      state,
      fetchProject.rejected(new Error('Uh oh'), '')
    );

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'error',
        error: 'Uh oh',
        entities: { 1: { id: 1 } },
        ids: [1],
      })
    );
  });
});
