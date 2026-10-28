'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (loading) return;
    router.replace(!user ? '/login' : user.role === 'ADMIN' ? '/admin' : '/staff');
  }, [user, loading, router]);
  return <p className="p-8 text-sm text-gray-500">Loading...</p>;
}
