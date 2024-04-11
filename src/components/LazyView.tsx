import type { PropsWithChildren } from 'react';
import type React from 'react';

interface Props {
  shouldUpdate: boolean;
}

export const LazyView: React.FC<PropsWithChildren<Props>> = props => {
  const { children, shouldUpdate } = props;

  if (!shouldUpdate) {
    return <></>;
  }

  return <>{children}</>;
};
