import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  autoComplete?: string;
}

const icons = {
  text: User,
  email: Mail,
  password: Lock,
} as const;

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "",
  type = "text",
  autoComplete,
}: FormFieldProps<T>) => {
  const [isFocused, setIsFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const isPassword = type === "password";
  const Icon = icons[type];

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const hasError = Boolean(fieldState.error);

        return (
          <FormItem className="space-y-2">
            <FormLabel
              className={`pl-1 font-medium transition-colors duration-200 ${
                hasError
                  ? "text-destructive-100"
                  : isFocused
                  ? "text-primary-200"
                  : "text-light-100/80"
              }`}
            >
              {label}
            </FormLabel>

            <FormControl>
              <div className="relative">
                <Input
                  className="pr-11 text-white"
                  type={isPassword && revealed ? "text" : type}
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  aria-invalid={hasError}
                  onFocus={() => setIsFocused(true)}
                  {...field}
                  onBlur={() => {
                    setIsFocused(false);
                    field.onBlur();
                  }}
                />

                {isPassword ? (
                  <button
                    type="button"
                    onClick={() => setRevealed((v) => !v)}
                    aria-label={revealed ? "Hide password" : "Show password"}
                    aria-pressed={revealed}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-light-400 transition-colors hover:text-primary-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200/60 cursor-pointer"
                  >
                    {revealed ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                ) : (
                  <Icon
                    aria-hidden="true"
                    className={`pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 transition-colors duration-200 ${
                      isFocused ? "text-primary-200" : "text-light-400"
                    }`}
                  />
                )}
              </div>
            </FormControl>

            <FormMessage className="ml-1 text-xs text-destructive-100" />
          </FormItem>
        );
      }}
    />
  );
};

export default FormField;
