import { useState, type FC } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import './Testimonial.scss';

export interface TestimonialItem {
  name: string;
  text: string;
}

export interface TestimonialProps {
  items?: TestimonialItem[];
  selected?: boolean;
  shrinked?: boolean;
}

const DEFAULT_ITEMS: TestimonialItem[] = [
  { name: 'First Testimonial', text: '\u201CLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\u201D' },
  { name: 'Second Testimonial', text: '\u201CUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\u201D' },
  { name: 'Third Testimonial', text: '\u201CDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\u201D' },
];

export const Testimonial: FC<TestimonialProps> = ({
  items = DEFAULT_ITEMS,
  selected = false,
  shrinked = false,
}) => {
  const [active, setActive] = useState(0);

  const handlePrev = () => setActive((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  const handleNext = () => setActive((prev) => (prev === items.length - 1 ? 0 : prev + 1));

  const current = items[active];

  const rootClasses = [
    'jf-testimonial',
    shrinked && 'jf-testimonial--shrinked',
    selected && 'jf-testimonial--selected',
  ].filter(Boolean).join(' ');

  return (
    <div className={rootClasses}>
      <div className="jf-testimonial__card">
        <div className={`jf-testimonial__content${shrinked ? ' jf-testimonial__content--vertical' : ''}`}>
          <div className="jf-testimonial__avatar">
            <User size={40} />
          </div>
          <div className="jf-testimonial__text">
            <h4 className="jf-testimonial__name">{current.name}</h4>
            <p className="jf-testimonial__quote">{current.text}</p>
          </div>
        </div>
        {items.length > 1 && (
          <div className="jf-testimonial__nav">
            <button className="jf-testimonial__nav-btn" onClick={handlePrev}>
              <ChevronLeft size={16} />
            </button>
            <button className="jf-testimonial__nav-btn" onClick={handleNext}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonial;
