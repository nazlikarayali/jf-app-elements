import type React from 'react';
import './Heading.scss';

export type HeadingSize = 'Large' | 'Medium' | 'Small';
export type HeadingAlignment = 'Left' | 'Center' | 'Right';

export interface HeadingProps {
  size?: HeadingSize;
  alignment?: HeadingAlignment;
  heading?: string;
  subheading?: string;
  selected?: boolean;
  shrinked?: boolean;
}

export const Heading: React.FC<HeadingProps> = ({
  size = 'Large',
  alignment = 'Left',
  heading = 'Heading',
  subheading = 'Subheading',
  selected = false,
  shrinked = false,
}) => {
  const rootClasses = [
    'jf-heading',
    `jf-heading--${alignment.toLowerCase()}`,
    selected && 'jf-heading--selected',
    shrinked && 'jf-heading--shrinked',
  ].filter(Boolean).join(' ');

  const Tag = size === 'Large' ? 'h2' : size === 'Medium' ? 'h3' : 'h4';

  return (
    <div className={rootClasses}>
      <Tag className={`jf-heading__title jf-heading__title--${size.toLowerCase()}`}>
        {heading}
      </Tag>
      {subheading && (
        <p className="jf-heading__subtitle">{subheading}</p>
      )}
    </div>
  );
};

export default Heading;
