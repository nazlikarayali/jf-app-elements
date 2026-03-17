import type { FC } from 'react';
import { Button } from '../Button';
import './SocialFollow.scss';

export type SocialLayout = 'Horizontal' | 'Wrap';

export interface SocialPlatform {
  icon: string;
  label: string;
}

export interface SocialFollowProps {
  layout?: SocialLayout;
  filled?: boolean;
  platforms?: SocialPlatform[];
  selected?: boolean;
  shrinked?: boolean;
}

const DEFAULT_PLATFORMS: SocialPlatform[] = [
  { icon: 'Youtube', label: 'YouTube' },
  { icon: 'Twitter', label: 'X' },
  { icon: 'Linkedin', label: 'LinkedIn' },
  { icon: 'Instagram', label: 'Instagram' },
];

export const SocialFollow: FC<SocialFollowProps> = ({
  layout = 'Horizontal',
  filled = true,
  platforms = DEFAULT_PLATFORMS,
  selected = false,
  shrinked = false,
}) => {
  const rootClasses = [
    'jf-social',
    layout === 'Wrap' ? 'jf-social--wrap' : 'jf-social--horizontal',
    selected && 'jf-social--selected',
    shrinked && 'jf-social--shrinked',
  ].filter(Boolean).join(' ');

  return (
    <div className={rootClasses}>
      {platforms.map((platform, i) => (
        <Button
          key={i}
          iconOnly
          iconOnlyIcon={platform.icon}
          iconOnlyFilled={filled}
          corner="Rounded"
        />
      ))}
    </div>
  );
};

export default SocialFollow;
