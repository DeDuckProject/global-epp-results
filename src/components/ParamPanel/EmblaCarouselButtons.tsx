import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PropType = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  'aria-label': string;
};

export const PrevButton: React.FC<PropType> = (props) => {
  const { ...restProps } = props;

  return (
    <button
      aria-label="Previous parameter"
      className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 text-primary disabled:opacity-50"
      type="button"
      {...restProps}
    >
      <ChevronLeft className="w-6 h-6" />
    </button>
  );
};

export const NextButton: React.FC<PropType> = (props) => {
  const { ...restProps } = props;

  return (
    <button
      aria-label="Next parameter"
      className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 text-primary disabled:opacity-50"
      type="button"
      {...restProps}
    >
      <ChevronRight className="w-6 h-6" />
    </button>
  );
}; 