import { Flex, Text, useMantineTheme } from "@mantine/core";

export default function HeaderBar(props: {title: string }) {
  const theme = useMantineTheme();
  
  return (
    <Flex
      w='100%'
      bg='rgba(0, 0, 0, 0.5)'
      justify={'center'}
      style={{
        backdropFilter: 'blur(0.5vh)',
        borderRadius: theme.radius.xxs,
        boxShadow: `0 4px 30px rgba(0, 0, 0, 0.1)`,
      }}
      p='xxs'
      gap='xs'
      align='center'
    >
      <Text
        size='xs'
        c='dimmed'
        style={{
          fontWeight: 'bold',
          letterSpacing: '0.3vh',
        }}
      >{props.title.toUpperCase()}</Text>
    </Flex>
  )
}