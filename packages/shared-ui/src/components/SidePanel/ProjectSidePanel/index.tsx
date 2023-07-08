import { useState } from "react";
import { CardBox } from "../../layout/CardBox";
import { CardBoxContent } from "../../layout/CardBox/CardBoxContent";
import { CardBoxTabs } from "../../layout/CardBox/CardBoxTabs";
import { LastExecutions } from "../../missions/LastExecutions";
import { GitUI } from "../../Git/GitUI";

enum Tab {
  Git = 'Git',
  Executions = 'Executions',
}

export function ProjectSidePanel() {
  const [tab, setTab] = useState(Tab.Git);

  const onChangeTab = (tab: string) => {
    setTab(tab as Tab);
  };

  let content = null;

  switch (tab) {
    case Tab.Git:
      content = <GitUI />;
      break;
    case Tab.Executions:
      content = <LastExecutions />;
      break;
  }

  return (
    <CardBox>
      <CardBoxTabs
        tabs={Object.values(Tab)}
        selectedTab={tab}
        onChangeTab={onChangeTab}
      />
      <CardBoxContent>
        {content}
      </CardBoxContent>
    </CardBox>
  );
}

