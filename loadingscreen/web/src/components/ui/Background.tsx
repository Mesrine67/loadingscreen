import { Carousel } from '@mantine/carousel';
import { Image } from '@mantine/core';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import React, { useRef } from 'react';
import { useSettings } from '../../stores/settings';
import getImgUrl from '../../utils/getImgUrl';

function Background() {
  const settings = useSettings();
  const carouselTime = useSettings((state) => state.carouselTime);
  const autoplay = useRef(Autoplay({ delay: carouselTime * 1000, active:true }));
  const fade = useRef(Fade());
  return (
    <Carousel
      mih={'100vh'}
      bg={'black'}
      // bg='red'
      align={'end'}
      withIndicators={false}
      withControls={false}
      plugins={[autoplay.current, fade.current]}
      loop
      style={{zIndex: -1}}
    >
      {Array.from({ length: settings.backgroundImages }).map((_, i) => { 
        const imgUrl = getImgUrl(`backgrounds/background_${i + 1}.png`) 
        console.log(imgUrl)
        return (
          <Carousel.Slide h='100vh' key={i}>
            <Image
              src={imgUrl}
              alt='Background'
              w='100%'
              h='100%'
              style={{
                objectFit: 'cover',
              }}
            />
          </Carousel.Slide>
        );
      })} 
    </Carousel>
    )
}

export default React.memo(Background);