import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'gold' | 'gold-outline' | 'danger' | 'ghost';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:      'bg-white text-dark hover:bg-neutral-100 focus:ring-white',
  secondary:    'bg-transparent text-white border border-white/30 hover:border-white focus:ring-white',
  gold:         'text-dark hover:opacity-90 focus:ring-gold',
  'gold-outline': 'border border-gold text-gold hover:bg-gold hover:text-dark focus:ring-gold',
  danger:       'bg-red-700 text-white hover:bg-red-800 focus:ring-red-500',
  ghost:        'bg-transparent text-neutral-400 hover:text-white focus:ring-white',
};

const goldBg = 'linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #A07830 100%)';

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-2.5 text-xs',
  lg: 'px-8 py-3.5 text-sm',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, disabled, children, className = '', style, ...props }, ref) => {
    const isGoldFilled = variant === 'gold';

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        style={isGoldFilled ? { background: goldBg, ...style } : style}
        className={`
          inline-flex items-center justify-center gap-2
          font-sans font-medium tracking-[0.2em] uppercase
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark
          disabled:opacity-40 disabled:cursor-not-allowed
          ${variantClasses[variant]} ${sizeClasses[size]} ${className}
        `}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
