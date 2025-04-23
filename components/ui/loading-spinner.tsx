import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white' | 'black';
}

const LoadingSpinner = ({
  className,
  size = 'md',
  color = 'primary',
  ...props
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
  };

  const colorClasses = {
    primary: 'border-t-primary border-r-primary border-b-primary/20 border-l-primary/20',
    secondary: 'border-t-secondary border-r-secondary border-b-secondary/20 border-l-secondary/20',
    white: 'border-t-white border-r-white border-b-white/20 border-l-white/20',
    black: 'border-t-black border-r-black border-b-black/20 border-l-black/20',
  };

  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;