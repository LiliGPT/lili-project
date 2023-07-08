import { CardBoxTabs } from "../../layout/CardBox/CardBoxTabs";
import { GitStatusBox } from "../GitStatusBox";

export function GitUI() {
  return (
    <div className="flex flex-col gap-2">
      <CardBoxTabs
        tabs={['Status', 'Log']}
        selectedTab={'Status'}
        onChangeTab={() => {}}
      />

      <GitStatusBox />
    </div>
  );
}

