import { forwardRef } from "react";
import { Control, Controller } from "react-hook-form";
import { Input, InputProps, Label, Paragraph, YStack } from "tamagui";

interface FormInputProps extends Omit<InputProps, "value" | "onChangeText"> {
  name: string;
  label?: string;
  control: Control<any>;
  rules?: object;
  error?: string;
}

export const FormInput = forwardRef<any, FormInputProps>(
  ({ name, label, control, rules, error, ...props }, ref) => {
    return (
      <YStack space="$2">
        {label && <Label color="$color">{label}</Label>}
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field: { onChange, value } }) => (
            <Input
              ref={ref}
              value={value || ""}
              onChangeText={onChange}
              borderColor={error ? "$red8" : "$borderColor"}
              {...props}
            />
          )}
        />
        {error && (
          <Paragraph color="$red10" size="$2">
            {error}
          </Paragraph>
        )}
      </YStack>
    );
  }
);

FormInput.displayName = "FormInput";
