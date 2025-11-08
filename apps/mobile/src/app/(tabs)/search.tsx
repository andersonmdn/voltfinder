import { Filter } from "@tamagui/lucide-icons";
import { ScrollView } from "react-native";
import { Button, Card, H1, Input, Paragraph, YStack } from "tamagui";

export default function SearchScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "$background" }}>
      <YStack padding="$4" space="$4">
        <YStack space="$2">
          <H1 color="$color">Search Stations</H1>
          <Paragraph color="$gray10">
            Find charging stations by location or name
          </Paragraph>
        </YStack>

        <YStack space="$3">
          <Input
            size="$4"
            placeholder="Search by location, station name..."
            backgroundColor="$background"
          />
          <Button theme="blue" icon={Filter}>
            Filters
          </Button>
        </YStack>

        <YStack space="$3">
          <Card elevate size="$3" bordered>
            <Card.Header padded>
              <H1 size="$5" color="$color">
                Tesla Supercharger - Mall Plaza
              </H1>
              <Paragraph color="$gray10">
                1.2 km away • 8 chargers available
              </Paragraph>
            </Card.Header>
          </Card>

          <Card elevate size="$3" bordered>
            <Card.Header padded>
              <H1 size="$5" color="$color">
                ChargePoint - Office Complex
              </H1>
              <Paragraph color="$gray10">
                2.1 km away • 4 chargers available
              </Paragraph>
            </Card.Header>
          </Card>

          <Card elevate size="$3" bordered>
            <Card.Header padded>
              <H1 size="$5" color="$color">
                EVgo Fast Charging
              </H1>
              <Paragraph color="$gray10">
                3.5 km away • 2 chargers available
              </Paragraph>
            </Card.Header>
          </Card>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
