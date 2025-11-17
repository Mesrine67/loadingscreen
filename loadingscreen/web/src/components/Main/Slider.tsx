import { useMantineTheme, Text, Flex } from "@mantine/core";
import { motion, useMotionValue, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import colorWithAlpha from "../../utils/colorWithAlpha";

type SliderProps = {
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step: number;
  w?: string;
  h?: string;
  hoverLabel?: boolean;
  formatLabel?: (val: number) => string;
  thumbLabel?: string;  // Ajout de cette propriété
  tooltipLabel?: string; // Ajout de cette propriété
};

export default function Slider({ 
  formatLabel, 
  value, 
  onChange, 
  hoverLabel = true, 
  min, 
  max, 
  step, 
  w = '100%', 
  h = '1vh',
  thumbLabel,
  tooltipLabel
}: SliderProps) {
  const theme = useMantineTheme();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const width = ref.current.offsetWidth;
    const percentage = (value - min) / (max - min);
    // Account for thumb width - thumb center goes from 0 to width-thumbHalfWidth
    const thumbHalfWidth = 8; // roughly 1vh/2 in pixels
    const maxPosition = width - thumbHalfWidth;
    const position = percentage * maxPosition;
    animate(x, position, { type: "tween", duration: 0.15 });
  }, [value, min, max]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const thumbHalfWidth = 8; // roughly 1vh/2 in pixels
    setShowText(true);
    
    const updateValue = (clientX: number) => {
      const rawOffset = clientX - rect.left;
      const maxPosition = rect.width - thumbHalfWidth;
      const constrainedOffset = Math.min(Math.max(rawOffset, 0), maxPosition);
      const percentage = constrainedOffset / maxPosition;
      const rawValue = min + percentage * (max - min);
      const stepped = Math.round(rawValue / step) * step;
      onChange(Math.max(min, Math.min(max, stepped)));
    };

    updateValue(e.clientX);

    const handleMove = (ev: PointerEvent) => updateValue(ev.clientX);
    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      setShowText(false);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  return (
    <Flex
      ref={ref}
      w={w}
      h={h}
      align="center"
      style={{
        position: 'relative',
        borderRadius: theme.radius.xxs,
        background: 'rgba(255, 255, 255, 0.1)',
        cursor: 'pointer',
      }}
      onPointerDown={handlePointerDown}
      title={tooltipLabel} // Utilisation du tooltipLabel comme attribut title
    >
      {/* FILLED GRADIENT TRACK */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: x,
          borderRadius: theme.radius.xxs,
          background: `linear-gradient(90deg,
            ${colorWithAlpha(theme.colors[theme.primaryColor][theme.primaryShade as number], 0.7)} 0%,
            ${colorWithAlpha(theme.colors[theme.primaryColor][theme.primaryShade as number], 0.2)} 100%)`,
        }}
      />

      {/* THUMB */}
      <motion.div
        style={{
          x,
          position: 'absolute',
          width: '1vh',
          height: '150%',
          borderRadius: theme.radius.xxs,
          background: colorWithAlpha(theme.colors[theme.primaryColor][theme.primaryShade as number], 0.5),
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        {hoverLabel && showText && (
          <motion.div
            style={{
              position: 'absolute',
              top: '-200%',
              background: colorWithAlpha(theme.colors[theme.primaryColor][theme.primaryShade as number], 0.3),
              color: theme.white,
              padding: '0.2vh 0.5vh',
              borderRadius: theme.radius.xxs,
              fontSize: '1.2vh',
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Text size="xs" style={{ userSelect: 'none' }}>
              {thumbLabel || (formatLabel ? formatLabel(value) : value.toFixed(2))}
            </Text>
          </motion.div>
        )}
      </motion.div>
    </Flex>
  );
}