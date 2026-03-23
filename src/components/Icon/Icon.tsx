import type { FC } from 'react';
import { useIconLibrary } from '../../context/IconLibraryContext';
import { resolveIcon } from '../../utils/iconRegistry';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export const Icon: FC<IconProps> = ({ name, size = 20, className }) => {
  const { library, iconStyle } = useIconLibrary();
  if (!name || name === 'none') return null;
  const result = resolveIcon(name, library, iconStyle);
  if (!result) return null;
  const { component: IconComp } = result;
  return <IconComp size={size} className={className} />;
};
