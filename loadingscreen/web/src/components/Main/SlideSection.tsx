import { useMantineTheme } from "@mantine/core";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import HeaderBar from './HeaderBar';
import HideTab from './HideTab';
import { useSettings } from "../../stores/settings";

export type SlideSectionProps = {
  title?: string;
  side?: 'left' | 'right' | 'top' | 'bottom'; // direction of slide
  icon: string;
  children?: React.ReactNode;
  left?: string;
  right?: string;
  miw?: string;
  top?: string;
  bottom?: string;
};

const getOppositeSide = (side: string) => {
  switch (side) {
    case 'left': return 'right';
    case 'right': return 'left';
    case 'top': return 'bottom';
    case 'bottom': return 'top';
    default: return 'right';
  }
};

export default function SlideSection(props: SlideSectionProps) {
  const [expanded, setExpanded] = useState(true);
  const theme = useMantineTheme();
  const side = props.side || 'left';

  const animation = useMemo(() => {
    switch (side) {
      case 'right':
        return {
          initial: { x: '100%', y: 0 },
          animate: { x: expanded ? '0%' : '103%', y: 0 },
        };
      case 'top':
        return {
          initial: { y: '-100%', x: 0 },
          animate: { y: expanded ? '0%' : '-103%', x: 0 },
        };
      case 'bottom':
        return {
          initial: { y: '100%', x: 0 },
          animate: { y: expanded ? '0%' : '103%', x: 0 },
        };
      case 'left':
      default:
        return {
          initial: { x: '-100%', y: 0 },
          animate: { x: expanded ? '0%' : '-103%', y: 0 },
        };
    }
  }, [side, expanded]);

  const positioning = {
    left: props.left,
    right: props.right,
    top: props.top,
    bottom: props.bottom,
  };

  const tabSide = getOppositeSide(side);

  const tabStyle = useMemo(() => {
    if (side === 'left' || side === 'right') {
      return {
        position: 'absolute' as const,
        top: '50%',
        [tabSide]: 0,
        transform: 'translateY(-50%)',
        zIndex: 10,
      };
    } else {
      return {
        position: 'absolute' as const,
        left: '50%',
        [tabSide]: 0,
        transform: 'translateX(-50%)',
        zIndex: 10,
      };
    }
  }, [side]);
  
  return (
    <motion.div
      initial={animation.initial}
      animate={animation.animate}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minWidth: props.miw,
        gap: theme.spacing.xs,
        ...positioning,
        overflow: 'visible',

      }}
    >
      <div style={tabStyle}>
        <HideTab
          side={tabSide as 'left' | 'right'}
          icon={props.icon}
          onChange={setExpanded}
          expanded={expanded}
        />
      </div>

      {props.title && <HeaderBar title={props.title.toUpperCase()} />}
      {props.children}
    </motion.div>
  );
}
