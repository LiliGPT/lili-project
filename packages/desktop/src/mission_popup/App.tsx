import { useKeyboardShortcuts, useQueryString } from '@lili-project/lili-store';
import { ExternalMissionPopup } from '@lili-project/shared-ui';
import { appWindow } from '@tauri-apps/api/window';

export function App() {
  const qs = useQueryString<{ project_dir: string; message: string; }>();

  // useKeyboardShortcuts({
  //   "Escape": async () => {
  //     // console.log("Escape pressed");
  //     // const mainWin = WebviewWindow.getByLabel("main");
  //     // await mainWin.hide();
  //     // await mainWin.show();
  //     // await mainWin.setFocus();
  //     await appWindow.close();
  //   }
  // }, false);

  const closePopupWindow = async () => {
    await appWindow.close();
  };

  if (!qs.project_dir || !qs.message) {
    return (
      <div>
        Missing project_dir or message
      </div>
    );
  }

  return (
    <ExternalMissionPopup
      project_dir={qs.project_dir}
      message={qs.message}
      afterApprove={closePopupWindow}
      afterSetFail={closePopupWindow}
    />
  );
}
