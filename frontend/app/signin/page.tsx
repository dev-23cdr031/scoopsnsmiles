'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, isHydrated, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const returnTo = useMemo(() => {
    const candidate = searchParams.get('returnTo') || '/';
    return candidate.startsWith('/') ? candidate : '/';
  }, [searchParams]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const result = signIn(email, password);
    if (!result.ok) {
      setError(result.message || 'Unable to sign in right now.');
      return;
    }

    router.replace(returnTo);
  };

  if (isHydrated && isAuthenticated) {
    router.replace(returnTo);
    return null;
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-sm md:p-8">
        <h1 className="text-3xl font-bold text-foreground">Sign In</h1>
        <p className="mt-2 text-sm text-foreground/60">Sign in to continue checkout and track your orders.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground"
              placeholder="Your password"
            />
          </div>

          {error ? (
            <div className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
          ) : null}

          <button
            type="submit"
            disabled={!isHydrated}
            className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-sm text-foreground/70">
          Don&apos;t have an account?{' '}
          <Link href={`/signup?returnTo=${encodeURIComponent(returnTo)}`} className="font-semibold text-primary hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background py-12" />}>
      <SignInContent />
    </Suspense>
  );
}
