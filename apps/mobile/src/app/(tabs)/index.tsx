import { Clock, MapPin, Zap } from "@tamagui/lucide-icons";
import { ScrollView } from "react-native";
import { Button, Card, H1, H2, Paragraph, XStack, YStack } from "tamagui";

export default function HomeScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "$background" }}>
      <YStack padding="$4" space="$4">
        <YStack space="$2">
          <H1 color="$color">VoltFinder</H1>
          <Paragraph color="$gray10">
            Find electric vehicle charging stations near you
          </Paragraph>
        </YStack>

        <Card elevate size="$4" bordered>
          <Card.Header padded>
            <H2 color="$color">Quick Search</H2>
          </Card.Header>
          <Card.Footer padded>
            <XStack space="$2" flex={1}>
              <Button flex={1} theme="blue" icon={MapPin}>
                Near Me
              </Button>
              <Button flex={1} theme="green" icon={Zap}>
                Fast Charging
              </Button>
            </XStack>
          </Card.Footer>
        </Card>

        <YStack space="$3">
          <H2 color="$color">Recent Stations</H2>

          <Card elevate size="$3" bordered>
            <Card.Header padded>
              <XStack justifyContent="space-between" alignItems="center">
                <YStack>
                  <H2 size="$5" color="$color">
                    Tesla Supercharger
                  </H2>
                  <Paragraph color="$gray10">Downtown Mall</Paragraph>
                </YStack>
                <YStack alignItems="flex-end">
                  <XStack alignItems="center" space="$1">
                    <Zap size={16} color="$green10" />
                    <Paragraph color="$green10">Available</Paragraph>
                  </XStack>
                  <XStack alignItems="center" space="$1">
                    <Clock size={14} color="$gray10" />
                    <Paragraph color="$gray10" size="$2">
                      2 min ago
                    </Paragraph>
                  </XStack>
                </YStack>
              </XStack>
            </Card.Header>
          </Card>

          <Card elevate size="$3" bordered>
            <Card.Header padded>
              <XStack justifyContent="space-between" alignItems="center">
                <YStack>
                  <H2 size="$5" color="$color">
                    ChargePoint Station
                  </H2>
                  <Paragraph color="$gray10">City Center</Paragraph>
                </YStack>
                <YStack alignItems="flex-end">
                  <XStack alignItems="center" space="$1">
                    <Zap size={16} color="$orange10" />
                    <Paragraph color="$orange10">Busy</Paragraph>
                  </XStack>
                  <XStack alignItems="center" space="$1">
                    <Clock size={14} color="$gray10" />
                    <Paragraph color="$gray10" size="$2">
                      5 min ago
                    </Paragraph>
                  </XStack>
                </YStack>
              </XStack>
            </Card.Header>
          </Card>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
