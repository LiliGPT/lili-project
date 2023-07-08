import { CardBoxTabs } from "../../layout/CardBox/CardBoxTabs";

export function GitUI() {
  return (
    <div>
      <CardBoxTabs
        tabs={['Status', 'Log']}
        selectedTab={'Status'}
        onChangeTab={() => {}}
      />
    </div>
  );
}

