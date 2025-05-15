import {authOptions} from '@/app/api/auth/auth.config';
import {getServerSession} from 'next-auth';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!session?.user?.email) {
    return null;
  }

  return session.user;
}
