"use client";

import * as React from "react";
import { Input } from "./input";

interface KebabCaseInputProps extends React.ComponentProps<"input"> {}

const convertToKebabCase = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/[ _]+/g, "-");
};

const KebabCaseInput = React.forwardRef<HTMLInputElement, KebabCaseInputProps>(
  ({ onChange, value, ...props }, ref) => {
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const kebabCaseValue = convertToKebabCase(e.target.value);
        // Create a synthetic event with the converted value
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: kebabCaseValue,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
      },
      [onChange]
    );

    // Ensure the displayed value is always in kebab case
    const kebabCaseValue = typeof value === "string" ? convertToKebabCase(value) : value;

    return (
      <Input
        ref={ref}
        value={kebabCaseValue}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

KebabCaseInput.displayName = "KebabCaseInput";

export { KebabCaseInput };

