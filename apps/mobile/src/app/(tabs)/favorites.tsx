import { ScrollView } from "react-native";
import { H1, Paragraph, YStack } from "tamagui";

export default function SearchScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "$background" }}>
      <YStack padding="$4" space="$4">
        <YStack space="$2">
          <H1 color="$color">Favorites</H1>
          <Paragraph color="$gray10">
            Find your favorite charging stations
          </Paragraph>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
