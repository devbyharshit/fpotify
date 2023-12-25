import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLElement> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, className, disabled, type = "button", ...props }, ref) => {
	return (
		<button
			type={type}
			className={twMerge(
				`w-full rounded-full bg-green-500 border border-transparent p-3 text-black disabled:cursor-not-allowed disabled:opacity-50 transition font-bold hover:opacity-75`,
				className
			)}
			disabled={disabled}
			ref={ref}
			{...props}
		>
			{children} 
		</button>
	);
});

Button.displayName = "Button";

export default Button;
