import { render } from '@testing-library/react';

import LiliStore from './lili-store';

describe('LiliStore', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LiliStore />);
    expect(baseElement).toBeTruthy();
  });
});
