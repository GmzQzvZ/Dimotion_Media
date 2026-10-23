import { z } from 'zod';

export type UserRole = 'admin' | 'client';
export const userRoleSchema = z.enum(['admin', 'client']);
