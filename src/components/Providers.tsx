'use client';

import { FC, PropsWithChildren } from 'react';
import { trpc } from '@/common/trpc';

const Providers: FC<PropsWithChildren> = ({ children }) => children;

export default trpc.react.withTRPC(Providers) as FC<PropsWithChildren>;
