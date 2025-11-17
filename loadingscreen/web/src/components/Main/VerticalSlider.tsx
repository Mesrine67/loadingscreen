import { Group, useMantineTheme } from '@mantine/core';
import { useMove } from '@mantine/hooks';
import { useEffect, useState } from 'react';

type VerticalSliderProps = {
  onChange: (value: number) => void;
  value: number;
  w?: string;
};


export default function VerticalSlider(props: VerticalSliderProps) {  
  const [value, setValue] = useState(props.value > 1 ? props.value/100 : props.value);  
  const { ref } = useMove(({ y }) => setValue(1 - y));
  const theme = useMantineTheme();

  useEffect(() => {
    props.onChange(value);
  }, [value]);  
  
  return (
   
      <Group justify="center">
        <div
          ref={ref}
          style={{
            width: props.w || '2vh',
            height: '90%',
            backgroundColor: theme.colors[theme.primaryColor][9],
            position: 'relative',
            borderRadius: theme.radius.xxs,
            // overflow: 'hidden',
          }}
        >
          {/* Filled bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              height: `${value * 100}%`,
              width: props.w || '2vh',
              borderRadius: theme.radius.xxs,
              backgroundColor: theme.colors[theme.primaryColor][9],
              opacity: 0.7,
            }}
          />

          {/* Thumb */}
          <div
            style={{
              position: 'absolute',
              bottom: `calc(${value * 100}% - 0.8vh)`,  
              left: 0,
              width: props.w || '2vh',
              height: '1.6vh',
              cursor: 'pointer',
              borderRadius: theme.radius.xxs,
              backgroundColor: theme.colors[theme.primaryColor][7],
            }}
          />
        </div>
      </Group>
  );
}