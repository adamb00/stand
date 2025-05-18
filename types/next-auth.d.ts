import 'next-auth/jwt';
import { Role } from '@prisma/client';
import { type DefaultSession } from 'next-auth';

export type ExtendedUser = DefaultSession['user'] & {
  role: Role;
  restaurant?: {
    id: string;
    name: string;
  };
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: Role;
    restaurant?: {
      id: string;
      name: string;
    };
  }
}
