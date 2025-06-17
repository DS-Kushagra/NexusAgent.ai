import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { useState } from "react";

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
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "",
  type = "text",
}: FormFieldProps<T>) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="space-y-2 group">
          <FormLabel
            className={`text-gray-300 font-medium pl-1 transition-colors duration-300 ${
              isFocused ? "text-primary-200" : ""
            }`}
          >
            {label}
          </FormLabel>
          <FormControl>
            <div
              className={`relative transition-all duration-300 ${
                isFocused ? "scale-[1.02]" : ""
              }`}
            >
              {" "}
              <Input
                className="text-white pr-10"
                type={type}
                placeholder={placeholder}
                onFocus={() => setIsFocused(true)}
                {...field}
                onBlur={(e) => {
                  setIsFocused(false);
                  field.onBlur();
                }}
              />
              {type === "email" && (
                <div
                  className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-300 ${
                    isFocused ? "text-primary-200 scale-110" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
              )}
              {type === "password" && (
                <div
                  className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-300 ${
                    isFocused ? "text-primary-200 scale-110" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
              )}
              {type === "text" && (
                <div
                  className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-300 ${
                    isFocused ? "text-primary-200 scale-110" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              )}
              <div
                className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary-200 to-blue-500 transition-all duration-500 ease-out ${
                  isFocused ? "w-full" : "w-0"
                }`}
              ></div>
            </div>
          </FormControl>
          <FormMessage className="text-red-400 text-xs ml-1" />
        </FormItem>
      )}
    />
  );
};

export default FormField;
