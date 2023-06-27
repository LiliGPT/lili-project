import { BasePage, PageTitle, Spacer } from '@lili-project/shared-ui';
import { SignInForm } from '../components/auth/SignInForm';

export function SignInPage() {
  const sideContent = (
    <div className="h-full flex flex-col">
      <Spacer />
      <SignInForm />
    </div>
  );
  return (
    <BasePage
        side={sideContent}
      >
        <PageTitle title="SignIn" />
        <PageContent />
      </BasePage>
  );
}

function PageContent() {
  return (
    <div></div>
  );
}
