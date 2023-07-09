import './default.styles.css';
import {parseDiff, Diff, Hunk, FileData, HunkData} from 'react-diff-view';

interface Props {
  path: string;
  diffText: string;
  content: string;
}

export function DiffPreview(props: Props) {
  const { path, diffText, content } = props;
  // diffText generated by `git --no-pager diff -U`

  const files: FileData[] = parseDiff(diffText);

  const renderFile = ({oldRevision, newRevision, type, hunks, newPath }: FileData) => (
    <Diff key={oldRevision + '-' + newRevision} viewType="unified" diffType={type} hunks={hunks}>
      {hunks => hunks.map(renderHunk)}
    </Diff>
  );

  const renderHunk = (hunk: HunkData) => (
    <Hunk key={hunk.content} hunk={hunk} />
  );

  let fileToRender: FileData | undefined = undefined;

  try {
    fileToRender = files.find(file => file.newPath === path);
  } catch(e) {}

  return (
    <div className="p-5 bg-slate-100 absolute left-[-475px] w-[475px] top-0 bottom-0 z-20 border border-slate-600 overflow-auto text-sm">
      {props.path}<br/><br/>
      {!!fileToRender && (renderFile(fileToRender))}
      {!fileToRender && (
        <pre className="">{content}</pre>
      )}
    </div>
  );
}
