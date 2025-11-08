import { ActivityIndicator } from "react-native";
import { Paragraph, XStack, YStack } from "tamagui";

interface LoadingProps {
  text?: string;
  size?: "small" | "large";
  color?: string;
}

export function Loading({
  text = "Loading...",
  size = "large",
  color = "#007AFF",
}: LoadingProps) {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" space="$3">
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Paragraph color="$gray10" textAlign="center">
          {text}
        </Paragraph>
      )}
    </YStack>
  );
}

export function InlineLoading({
  text,
  size = "small",
}: Omit<LoadingProps, "color">) {
  return (
    <XStack alignItems="center" space="$2">
      <ActivityIndicator size={size} color="#007AFF" />
      {text && <Paragraph color="$gray10">{text}</Paragraph>}
    </XStack>
  );
}
