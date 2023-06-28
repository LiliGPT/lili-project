import { SideNav } from './SideNav';
import { Spacer } from '../Spacer';
import { SideNavItem } from './SideNavItem';
import './styles.css';
import { HomeIcon } from '../../icons/HomeIcon';
import { ProjectsIcon } from '../../icons/ProjectsIcon';
import { BookIcon } from '../../icons/BookIcon';
import { ProfileIcon } from '../../icons/ProfileIcon';
import { ReduxCoreView, selectCoreView, selectCurrentUser, setCoreView, useAppDispatch, useAppSelector } from '@lili-project/lili-store';

interface Props {
  side: React.ReactNode;
  children: React.ReactNode;
}

export function BasePage(props: Props) {
  const dispatch = useAppDispatch();
  const view = useAppSelector(selectCoreView());
  const user = useAppSelector(selectCurrentUser());

  const { side, children } = props;

  const onClickProjects = () => {
    dispatch(setCoreView(ReduxCoreView.CodeProjects));
  };

  const onClickSignIn = () => {
    dispatch(setCoreView(ReduxCoreView.SignIn));
  };

  return (
    <div className="BasePage">
      <div className="AppSidebar">
        <div className="AppLogo">
          <div className="SmallTextLogo">Lili</div>
        </div>

        <SideNav>
          <SideNavItem
            label="Home"
            icon={HomeIcon}
            onClick={() => {}}
            active={false}
          />
          <SideNavItem
            label="Projects"
            icon={ProjectsIcon}
            onClick={onClickProjects}
            active={view === ReduxCoreView.CodeProjects}
          />
          <SideNavItem
            label="Missions"
            icon={BookIcon}
            onClick={() => {}}
            active={false}
          />

        </SideNav>

        <Spacer />

        <SideNav className="mb-7">
          <SideNavItem
            label="My account"
            icon={ProfileIcon}
            onClick={onClickSignIn}
            active={view === ReduxCoreView.SignIn}
            variant={user ? `highlighted` : 'normal'}
          />
        </SideNav>
      </div>
      <div className="AppSideContent">
        {side}
      </div>
      <div className="AppMainContainer">
        {children}
      </div>
    </div>
  );
}
