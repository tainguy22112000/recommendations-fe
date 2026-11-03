import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function OnboardingPage() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-4 p-6 text-center">
        <h1 className="text-lg font-semibold">{t('onboarding.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('onboarding.accountCreated')}</p>
        <Button asChild className="h-11 w-full">
          <Link to="/">{t('onboarding.start')}</Link>
        </Button>
      </Card>
    </main>
  );
}
