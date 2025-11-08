import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { Button, H1, Paragraph, YStack } from "tamagui";

export default function ModalScreen() {
  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      padding="$4"
      space="$4"
    >
      <H1 color="$color">Modal</H1>
      <Paragraph color="$gray10" textAlign="center">
        This is a modal screen example using Expo Router.
      </Paragraph>
      <Button theme="blue">Close Modal</Button>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </YStack>
  );
}
