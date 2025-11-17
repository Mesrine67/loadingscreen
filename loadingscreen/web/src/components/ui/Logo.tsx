import React from 'react';
import { Flex, Image, useMantineTheme } from '@mantine/core';
import colorWithAlpha from '../../utils/colorWithAlpha';
import getImgUrl from '../../utils/getImgUrl';

function Logo() {
  const theme = useMantineTheme();
  console.log(getImgUrl('logo.png'))
  return (
    <Flex
      align='center'
      gap='sm'
      pos='absolute'
      top='8vh'  // Positionné en dessous des boutons
      right='50%'
      style={{
        transform: 'translateX(50%)',
      }}
    >
      <Image
        src={getImgUrl('logo.png')}
        alt='Logo'
        h='16vh'
        radius='xs'
        style={{
          filter: `drop-shadow(0 0 2vh ${colorWithAlpha(theme.colors[theme.primaryColor][9], 0.5)})`,
          borderRadius: theme.radius.xxs,
        }}
      />
    </Flex>
  )
}

export default React.memo(Logo);