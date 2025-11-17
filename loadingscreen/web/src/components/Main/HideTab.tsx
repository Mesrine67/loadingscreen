import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex, useMantineTheme } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { AnimatePresence, motion } from "framer-motion";
import colorWithAlpha from "../../utils/colorWithAlpha";

export type HideTabProps = {
  side?: 'left' | 'right';
  icon: string | IconProp;
  onChange: (expanded: boolean) => void;
  expanded: boolean;
}

export default function HideTab(props: HideTabProps) {
  const {hovered, ref} = useHover();
  const theme = useMantineTheme();
  const side = props.side || 'left';  
  
  return (
    <Flex
      ref={ref}
      pos='absolute'
      left={side === 'left' ? '-4vh' : 'unset'}
      right={side === 'right' ? '-4vh' : 'unset'}
      top='50%'
      style={{
        transform: 'translateY(-50%)',
        zIndex: 1000,
        backdropFilter: 'blur(0.5vh)',
        borderRadius: theme.radius.xxs,
        // glassmorphism effect
        boxShadow: `0 4px 30px rgba(0, 0, 0, 0.1)`,
        pointerEvents: 'auto',
        overflow: 'hidden',
      }}
      bg='rgba(0, 0, 0, 0.5)'
      p='0.9vh'
      justify={'center'}
      align={'center'}
      onClick={() => props.onChange(!props.expanded)}
    >
      <FontAwesomeIcon
        icon={props.expanded ? `angles-${side === 'left' ? 'right' : 'left'}` : (props.icon as IconProp)}
        style={{
          color: 'rgba(255, 255, 255, 0.8)',
          cursor: 'pointer',
          aspectRatio: '1 / 1',
          fontSize: '1.6vh',
        }}
      />
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '200%', opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '50%',
              height: '100%',
              background: `linear-gradient(-65deg, transparent, ${colorWithAlpha(theme.colors[theme.primaryColor][theme.primaryShade as number], 0.6)}, transparent)`,
              transform: 'skewX(-20deg)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    </Flex>
  )
}