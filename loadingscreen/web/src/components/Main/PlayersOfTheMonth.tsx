import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex, Text, useMantineTheme } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { useMemo, useState } from "react";
import { useSettings } from "../../stores/settings";
import type { StaffMember } from './../../typings';
import { motion } from "framer-motion";
import HeaderBar from './HeaderBar';
import HideTab from './HideTab';
import { IconProp } from "@fortawesome/fontawesome-svg-core";

function StaffMemberComponent(props: StaffMember) {
  const theme = useMantineTheme();
  const { hovered, ref } = useHover();
  const isLarge = hovered;
  const size = isLarge ? "12vh" : "10vh";
  const iconProp = useMemo(() => {
    return ["fas", props.icon] as IconProp;
  }, [props.icon]);
  const displayName = props.discordUsername || props.name || "Unknown";
  const avatarUrl = props.discordAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(props?.name || "Unknown")}&background=random`;
  return (
    <Flex
      ref={ref}
      direction="column"
      align="center"
      justify="flex-end"
      style={{
        height: size,
        width: size,
        borderRadius: theme.radius.xxs,
        backgroundImage: `url(${avatarUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
        overflow: "hidden",
        aspectRatio: "1 / 1",
        position: "relative",
        transition: "all 0.3s ease",
        cursor: "pointer",
        transform: hovered ? "scale(1.05)" : "scale(1)",
        margin: "0.5vh",
      }}
    >
      {/* Icon for role */}
      <FontAwesomeIcon
        icon={iconProp}
        style={{
          position: "absolute",
          top: "0.5vh",
          left: "1vh",
          color: props.color,
          fontSize: isLarge ? "2vh" : "1.5vh",
          textShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
          transition: "all 0.3s ease",
        }}
      />
      
      {/* Staff name and role */}
      <Flex 
        direction="column" 
        w="100%" 
        bg="rgba(0, 0, 0, 0.6)" 
        style={{
          backdropFilter: "blur(2px)",
        }}
      >
        <Text
          w="100%"
          ta="center"
          style={{
            padding: "0.7vh 0 0 0",
            fontSize: isLarge ? "1.3vh" : "1vh",
            letterSpacing: "0.2vh",
            fontWeight: 600,
            transition: "all 0.3s ease",
          }}
        >
          {displayName?.toUpperCase()}
        </Text>
        <Text
          w="100%"
          ta="center"
          style={{
            padding: "0 0 0.7vh 0",
            fontSize: isLarge ? "1vh" : "0.8vh",
            fontStyle: "italic",
            color: props.color,
            transition: "all 0.3s ease",
          }}
        >
          {props.role}
        </Text>
      </Flex>
    </Flex>
  );
}

export default function ServerStaff() {
  // États et logique de SlideSection
  const [expanded, setExpanded] = useState(true);
  const theme = useMantineTheme();
  const side = 'left';

  // Utiliser le store Zustand pour accéder aux membres du staff
  const staffMembers = useSettings((state) => state.serverStaff);
  
  const animation = useMemo(() => {
    return {
      initial: { x: '-100%', y: 0 },
      animate: { x: expanded ? '0%' : '-103%', y: 0 },
    };
  }, [expanded]);
  
  const positioning = {
    left: '1vh',
    top: '1vh',
  };
  
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
        gap: theme.spacing.xs,
        ...positioning,
        overflow: 'visible',
        maxWidth: '40vh',
      }}
    >
      <div style={{
        position: 'absolute' as const,
        top: '50%',
        right: 0,
        transform: 'translateY(-50%)',
        zIndex: 10,
      }}>
        <HideTab
          side="right"
          icon={["fas", "users"] as IconProp}
          onChange={setExpanded}
          expanded={expanded}
        />
      </div>
      
      <HeaderBar title="STAFF DU SERVEUR" />
      
      {/* Contenu des membres du staff */}
      <Flex 
        direction="row" 
        align="center" 
        justify="center"
        wrap="wrap" 
        gap="sm" 
        w="100%"
        p="1vh"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: theme.radius.sm,
          backdropFilter: 'blur(5px)',
        }}
      >
        {staffMembers.map((member, index) => (
          <StaffMemberComponent key={index} {...member} />
        ))}
      </Flex>
    </motion.div>
  );
}