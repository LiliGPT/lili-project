import { GitLogEntry, RepositoryInfo } from "@lili-project/lili-store";

interface Props {
  repo: RepositoryInfo;
}

export function GitLogBox({
  repo,
}: Props) {

  const renderLogRow = (log: GitLogEntry) => {
    let datetime = '';
    const isToday = (date: string) => {
      const today = new Date();
      const dateObj = new Date(date);
      return today.getFullYear() === dateObj.getFullYear() &&
        today.getMonth() === dateObj.getMonth() &&
        today.getDate() === dateObj.getDate();
    }
    datetime = isToday(log.datetime) ? log.datetime.substring(11, 16) : log.datetime.substring(0, 10);
    return (
      <div className="flex flex-row gap-4 leading-8" key={log.hash}>
        <div className="text-slate-400">
          {datetime}
        </div>
        <div className="">
          {log.author}
          </div>
        <div className="text-slate-300">
          {log.message}
          </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {repo.log.map((log: GitLogEntry) => renderLogRow(log))}
    </div>
  );
}

