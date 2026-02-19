import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
        primary: 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm',
        secondary: 'bg-muted text-muted-foreground hover:opacity-80',
        outline: 'border border-border bg-background shadow-sm hover:bg-muted hover:text-muted-foreground',
    };

    const sizes = {
        sm: 'h-9 px-3 text-xs',
        md: 'h-10 py-2 px-4',
        lg: 'h-11 px-8',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
