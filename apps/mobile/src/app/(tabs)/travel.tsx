import { ScrollView } from 'react-native'
import { Text, YStack } from 'tamagui'

export default function SearchScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '$background' }}>
      <YStack padding="$4" space="$4">
        <Text> TRAVEL </Text>
      </YStack>
    </ScrollView>
  )
}
