import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Text, useMantineTheme } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import colorWithAlpha from "../../utils/colorWithAlpha";
import { useSettings } from "../../stores/settings";

type ButtonProps = {
  text: string;
  icon: string;
  onClick: () => void;
}

export function Button(props: ButtonProps) {
  const theme = useMantineTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <motion.button
      onClick={props.onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      initial={{ scale: 1, y: 0 }}
      animate={{
        scale: isPressed ? 0.96 : isHovered ? 1.02 : 1,
        y: isPressed ? 1 : isHovered ? -1 : 0,
      }}
      whileTap={{
        scale: 0.94,
        y: 2
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.8
      }}
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        position: 'relative',
        padding: '0.5vh 1.5vh',
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(0.5vh)',
        borderRadius: theme.radius.xxs,
        boxShadow: isHovered
          ? `0 8px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
          : `0 4px 30px rgba(0, 0, 0, 0.1)`,
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Animated background glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isHovered ? 0.15 : 0,
          scale: isHovered ? 1.2 : 0.8
        }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
          borderRadius: theme.radius.sm,
          pointerEvents: 'none',
        }}
      />
      {/* Shimmer effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '200%', opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 0.5
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
      <FontAwesomeIcon
        icon={props.icon as IconProp}
        style={{
          color: isHovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
          fontSize: '1.8vh',
          marginRight: '0.8vh',
          filter: isHovered ? 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))' : 'none',
          transition: 'all 0.2s ease',
        }}
      />
      {/* Text with animation */}
      <motion.div
        animate={{
          x: isHovered ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      >
        <Text
          style={{
            color: isHovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.8vh',
            fontWeight: '600',
            textShadow: isHovered ? '0 0 8px rgba(255, 255, 255, 0.2)' : 'none',
            transition: 'all 0.2s ease',
            letterSpacing: isHovered ? '0.05em' : '0em',
          }}
        >
          {props.text.toUpperCase()}
        </Text>
      </motion.div>
      {/* Particle effect on click */}
      <AnimatePresence>
        {isPressed && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  scale: 0,
                  x: 0,
                  y: 0,
                  opacity: 1
                }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * Math.PI * 2) / 6) * 20,
                  y: Math.sin((i * Math.PI * 2) / 6) * 20,
                  opacity: [1, 0.8, 0]
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut"
                }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '0.3vh',
                  height: '0.3vh',
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.button>
  )
}