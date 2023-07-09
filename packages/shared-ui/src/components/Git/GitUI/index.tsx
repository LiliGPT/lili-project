import { useState } from "react";
import { CardBoxTabs } from "../../layout/CardBox/CardBoxTabs";
import { GitStatusBox } from "../GitStatusBox";

enum GitUITab {
  Status = 'Status',
  Log = 'Log',
}

export function GitUI() {
  const [tab, setTab] = useState(GitUITab.Status);

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
        selectedTab={GitUITab.Status}
        onChangeTab={onClickChangeTab}
      />

      {tab === GitUITab.Status && <GitStatusBox />}
      {tab === GitUITab.Log && <div>Log</div>}
    </div>
  );
}

