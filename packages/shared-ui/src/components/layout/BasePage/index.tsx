import Image from 'next/image';
import Link from 'next/link';
import { SideNav } from './SideNav';
import { Spacer } from '../Spacer';
import { SideNavItem } from './SideNavItem';
import './styles.css';
import { HomeIcon } from '../../icons/HomeIcon';
import { ProjectsIcon } from '../../icons/ProjectsIcon';
import { BookIcon } from '../../icons/BookIcon';
import { ProfileIcon } from '../../icons/ProfileIcon';

interface Props {
  side: React.ReactNode;
  children: React.ReactNode;
}

export function BasePage(props: Props) {
  const { side, children } = props;
  return (
    <div className="BasePage">
      <div className="AppSidebar">
        <div className="AppLogo">
          <Image src="/favicon.ico" alt="Logo" width={32} height={32} />
        </div>

        <SideNav>
          <SideNavItem
            label="Home"
            icon={HomeIcon}
            href="#"
            active={false}
          />
          <SideNavItem
            label="Projects"
            icon={ProjectsIcon}
            href="#"
            active={true}
          />
          <SideNavItem
            label="Missions"
            icon={BookIcon}
            href="#"
            active={false}
          />

        </SideNav>

        <Spacer />

        <SideNav className="mb-7">
          <SideNavItem
            label="My account"
            icon={ProfileIcon}
            href="#"
            active={false}
          />
        </SideNav>
      </div>
      <div className="AppSideContent">
        {side}
      </div>
      <div className="AppMainContainer">
        {children}
        <div className="h-96 bg-red-800"></div>
        <div className="h-96 bg-blue-800"></div>
        <div className="h-96 bg-green-800"></div>
        <div className="h-96 bg-red-800"></div>
        <div className="h-96 bg-blue-800"></div>
        <div className="h-96 bg-green-800"></div>
      </div>
    </div>
  );
}
