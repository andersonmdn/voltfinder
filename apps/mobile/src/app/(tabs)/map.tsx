import { View } from "react-native";
import { H1, Paragraph, YStack } from "tamagui";

export default function MapScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "$background" }}>
      <YStack
        padding="$4"
        space="$4"
        flex={1}
        justifyContent="center"
        alignItems="center"
      >
        <H1 color="$color">Map View</H1>
        <Paragraph color="$gray10">
          Interactive map with charging stations will be displayed here
        </Paragraph>
        <Paragraph color="$gray10" size="$3" textAlign="center">
          This would integrate with a mapping library like react-native-maps or
          MapBox
        </Paragraph>
      </YStack>
    </View>
  );
}
