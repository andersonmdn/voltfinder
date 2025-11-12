import { SizableText, XStack } from 'tamagui'

interface SectionTitleProps {
  icon: React.ComponentType<any>
  children: React.ReactNode
  iconColor: string
}

const SectionTitle = ({ icon: Icon, children, iconColor }: SectionTitleProps) => (
  <XStack ai="center" gap="$2" mt="$3" mb="$2">
    <Icon size="$1.5" color={iconColor} />
    <SizableText size="$5" fow="700">
      {children}
    </SizableText>
  </XStack>
)

export default SectionTitle
