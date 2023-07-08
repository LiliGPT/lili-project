interface Props {
  tabs: string[];
  selectedTab: string;
  onChangeTab: (tab: string) => void;
}

export function CardBoxTabs(props: Props) {
  const { tabs, selectedTab, onChangeTab } = props;
  return (
    <div className="flex flex-row overflow-hidden rounded-t-xl border-b border-slate-800">
      {tabs.map(tab => {
        const isSelected = tab === selectedTab;
        const className = isSelected
          ? 'bg-secondary text-primary'
          : 'bg-boldy text-secondary hover:bg-primary';
        return (
          <div
            key={tab}
            className={`flex-grow ${className} text-center cursor-pointer leading-8 transition-all duration-300`}
            onClick={() => onChangeTab(tab)}
          >
            {tab}
          </div>
        );
      })}
    </div>
  );
}

