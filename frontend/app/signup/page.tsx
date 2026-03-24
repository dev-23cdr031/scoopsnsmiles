'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp, isHydrated, isAuthenticated } = useAuth();

  const [name, setName] = useState('');
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

    const result = signUp(name, email, password);
    if (!result.ok) {
      setError(result.message || 'Unable to sign up right now.');
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
        <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
        <p className="mt-2 text-sm text-foreground/60">Sign up to place orders and complete checkout.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground"
              placeholder="Your name"
            />
          </div>

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
              placeholder="At least 6 characters"
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
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-sm text-foreground/70">
          Already have an account?{' '}
          <Link href={`/signin?returnTo=${encodeURIComponent(returnTo)}`} className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background py-12" />}>
      <SignUpContent />
    </Suspense>
  );
}
