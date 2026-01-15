
"use client";

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';
import { Skeleton } from './ui/skeleton';

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // If loading is finished and there's no user, redirect to login.
      if (!loading && !user) {
        router.replace('/login');
      }
    }, [user, loading, router]);

    // While loading, or if there's no user yet, show a skeleton screen.
    if (loading || !user) {
      return (
        <div className="container grid place-items-center h-screen">
            <div className='space-y-4 w-full max-w-lg'>
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
      );
    }

    // If loading is finished and there is a user, render the wrapped component.
    return <WrappedComponent {...props} />;
  };
  
  AuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth;
