import React from 'react';
import tw, { css } from 'twin.macro';
import { AppLayout } from '@/src/layouts';
import { KanbanBoard } from '../components/Content';

export function HomePage() {
  const style = {
    default: css([
      tw`  `,
    ]),
  };

  return (
    <>
      <AppLayout title='홈'>
        <KanbanBoard />
      </AppLayout>
    </>
  );
}
