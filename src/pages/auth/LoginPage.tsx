import { useTranslation } from 'react-i18next';

import { AuthAPI } from '@/api/authAPI';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLoginError } from '@/hooks/useLoginError';

export default function LoginPage() {
  const { t } = useTranslation();
  const loginError = useLoginError();

  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-6 p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-semibold">{t('login.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('login.subtitle')}</p>
        </div>

        {loginError && (
          <p
            role="alert"
            className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {loginError.message}
          </p>
        )}

        <Button asChild size="lg" className="h-12 w-full">
          <a href={AuthAPI.getGoogleSignInURL()}>{t('login.google')}</a>
        </Button>
      </Card>
    </main>
  );
}
