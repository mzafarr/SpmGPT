import {
  ButtonHTMLAttributes,
  FC,
  LegacyRef,
  MutableRefObject,
  forwardRef,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { FaSpinner } from "react-icons/fa";

const ButtonVariants = cva(
  "text-sm disabled:opacity-80 text-center font-medium rounded-md focus:ring ring-primary/10 outline-none flex items-center justify-center transition-opacity",
  {
    variants: {
      variant: {
        primary:
          "disabled:bg-gray-500 disabled:hover:bg-gray-500 transition-colors",
        tertiary: "text-black dark:text-white bg-transparent",
        secondary:
          "transition-colors shadow-none",
      },
      brightness: {
        dim: "",
        default: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      brightness: "default",
    },
  }
);
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonVariants> {
  isLoading?: boolean;
}

const Button: FC<ButtonProps> = forwardRef(
  (
    { className, children, variant, brightness, isLoading, ...props },
    forwardedRef
  ) => {
    return (
      <button
        className={cn(ButtonVariants({ variant, brightness, className }))}
        disabled={isLoading}
        {...props}
        ref={forwardedRef as LegacyRef<HTMLButtonElement>}
      >
        {children} {isLoading && <FaSpinner className="animate-spin" />}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
