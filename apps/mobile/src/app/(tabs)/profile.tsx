import { LogOut, Settings, Star, User } from "@tamagui/lucide-icons";
import { ScrollView } from "react-native";
import { Avatar, Button, Card, H2, Paragraph, XStack, YStack } from "tamagui";

export default function ProfileScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "$background" }}>
      <YStack padding="$4" space="$4">
        <Card elevate size="$4" bordered>
          <Card.Header padded>
            <XStack space="$3" alignItems="center">
              <Avatar circular size="$6">
                <Avatar.Image src="https://via.placeholder.com/100" />
                <Avatar.Fallback backgroundColor="$blue5">
                  <User color="$blue10" size={24} />
                </Avatar.Fallback>
              </Avatar>
              <YStack flex={1}>
                <H2 color="$color">John Doe</H2>
                <Paragraph color="$gray10">john.doe@example.com</Paragraph>
                <XStack alignItems="center" space="$1">
                  <Star size={16} color="$yellow10" />
                  <Paragraph color="$gray10" size="$3">
                    Premium Member
                  </Paragraph>
                </XStack>
              </YStack>
            </XStack>
          </Card.Header>
        </Card>

        <YStack space="$3">
          <H2 color="$color">Account</H2>

          <Card elevate size="$3" bordered pressStyle={{ scale: 0.98 }}>
            <Card.Header padded>
              <XStack justifyContent="space-between" alignItems="center">
                <XStack space="$3" alignItems="center">
                  <Settings color="$gray10" size={20} />
                  <Paragraph color="$color">Settings</Paragraph>
                </XStack>
                <Paragraph color="$gray10">{">"}</Paragraph>
              </XStack>
            </Card.Header>
          </Card>

          <Card elevate size="$3" bordered pressStyle={{ scale: 0.98 }}>
            <Card.Header padded>
              <XStack justifyContent="space-between" alignItems="center">
                <XStack space="$3" alignItems="center">
                  <Star color="$gray10" size={20} />
                  <Paragraph color="$color">Favorites</Paragraph>
                </XStack>
                <Paragraph color="$gray10">{">"}</Paragraph>
              </XStack>
            </Card.Header>
          </Card>
        </YStack>

        <YStack space="$3">
          <H2 color="$color">Usage Stats</H2>

          <Card elevate size="$3" bordered>
            <Card.Header padded>
              <YStack space="$2">
                <Paragraph color="$gray10" size="$3">
                  This Month
                </Paragraph>
                <H2 color="$color">12 Sessions</H2>
                <Paragraph color="$gray10">245 kWh charged</Paragraph>
              </YStack>
            </Card.Header>
          </Card>
        </YStack>

        <Button theme="red" icon={LogOut} marginTop="$4">
          Sign Out
        </Button>
      </YStack>
    </ScrollView>
  );
}
