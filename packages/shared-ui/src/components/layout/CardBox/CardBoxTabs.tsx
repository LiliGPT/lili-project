interface Props {
  tabs: string[];
  selectedTab: string;
  onChangeTab: (tab: string) => void;
}

export function CardBoxTabs(props: Props) {
  const { tabs, selectedTab, onChangeTab } = props;
  return (
    <div className="flex flex-row overflow-hidden rounded-t-xl">
      {tabs.map(tab => {
        const isSelected = tab === selectedTab;
        const className = isSelected
          ? /* selected */ 'text-accent border-b-2 border-accent'
          : /* unselected */ 'text-slate-600 hover:text-slate-400 hover:bg-primary border-b-2 border-slate-700 hover:border-slate-600';
        return (
          <div
            key={tab}
            className={`flex-grow ${className} text-center cursor-pointer leading-9 transition-all duration-300`}
            onClick={() => onChangeTab(tab)}
          >
            {tab}
          </div>
        );
      })}
    </div>
  );
}

