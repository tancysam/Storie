export default function Button({ 
  children, 
  onClick, 
  disabled, 
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
}) {
  const baseStyles = 'font-display tracking-wide border-3 border-retro-dark transition-all duration-100';
  
  const variants = {
    primary: 'bg-retro-rust text-retro-cream hover:bg-retro-dark shadow-retro-sm hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:bg-retro-sepia disabled:text-retro-brown',
    secondary: 'bg-retro-sepia text-retro-dark hover:bg-retro-brown hover:text-retro-cream shadow-retro-sm hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:bg-retro-paper disabled:text-retro-brown',
    danger: 'bg-retro-red text-retro-cream hover:bg-retro-dark shadow-retro-sm hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:bg-retro-sepia disabled:text-retro-brown',
    ghost: 'bg-transparent text-retro-dark border-transparent shadow-none hover:bg-retro-sepia hover:border-retro-brown hover:shadow-retro-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
