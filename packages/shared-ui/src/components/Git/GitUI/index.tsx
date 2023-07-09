import { useState } from "react";
import { CardBoxTabs } from "../../layout/CardBox/CardBoxTabs";
import { GitStatusBox } from "../GitStatusBox";
import { useRepositoryInfo } from "@lili-project/lili-store";
import { GitLogBox } from "../GitLogBox";

enum GitUITab {
  Status = 'Status',
  Log = 'Log',
}

export function GitUI() {
  const [tab, setTab] = useState(GitUITab.Status);
  const {
    state,
    currentPath,
    setCurrentPath,
    setFileContents,
    fileContents,
    gitAdd,
    gitReset,
    gitCommit,
  } = useRepositoryInfo();

  const onClickChangeTab = (tab: string) => {
    setTab(tab as GitUITab);
  };

  return (
    <div className="flex flex-col gap-2">
      <CardBoxTabs
        tabs={[
          GitUITab.Status,
          GitUITab.Log,
        ]}
        selectedTab={tab}
        onChangeTab={onClickChangeTab}
      />

      {tab === GitUITab.Status && <GitStatusBox
        setFileContents={setFileContents}
        fileContents={fileContents}
        state={state}
        currentPath={currentPath}
        setCurrentPath={setCurrentPath}
        gitAdd={gitAdd}
        gitReset={gitReset}
        gitCommit={gitCommit}
      />}
      {tab === GitUITab.Log && !!state.repo && <GitLogBox
        repo={state.repo}
      />}
    </div>
  );
}

