import { GitFilesPicker } from "../GitFilesPicker";
import { GitFileChange } from "../types";

interface Props {}

export function GitStatusBox(props: Props) {

  const mockFiles: GitFileChange[] = [
      {
        path: 'src/components/GitUI/UnstagedChanges.tsx',
        status: 'modified',
      },
      {
        path: 'src/components/GitUI/index.tsx',
        status: 'modified',
      },
      {
        path: 'src/components/ExampleDontExist.tsx',
        status: 'deleted',
      },
      {
        path: 'src/components/ExampleCreatingNewFile.tsx',
        status: 'created',
      },
    ];

  const gitInfoResponse = {
    branch: 'main',
    unstagedFiles: mockFiles,
    stagedFiles: mockFiles,
    log: [
      {
        hash: '1234567890',
        author: 'John Doe',
        datetime: '2021-01-01T00:00:00Z',
        message: 'secondary commit message to test',
      },
      {
        hash: '1234568883',
        author: 'Janny Doe',
        datetime: '2021-01-01T00:00:00Z',
        message: 'Initial commit',
      },
    ],
  };

  return (
    <div className="flex flex-col">
      <GitFilesPicker files={gitInfoResponse.unstagedFiles} />
      <GitFilesPicker files={gitInfoResponse.stagedFiles} />
    </div>
  );
}

