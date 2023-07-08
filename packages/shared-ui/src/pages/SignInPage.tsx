import { BasePage, PageTitle, Spacer } from '@lili-project/shared-ui';
import { SignInForm } from '../components/auth/SignInForm';
import { CardBox } from '../components/layout/CardBox';
import { CardBoxTabs } from '../components/layout/CardBox/CardBoxTabs';
import { useState } from 'react';
import { CardBoxContent } from '../components/layout/CardBox/CardBoxContent';

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

