// web\src\components\Main\Buttons.tsx
import { Flex } from "@mantine/core";
import { useSettings } from "../../stores/settings";
import { Button } from "./Button";
import { motion } from "framer-motion";

export default function Buttons() {
  const links = useSettings((state) => state.links);
  
  return (
    <Flex
      pos='absolute'
      top='1vh'  // Positionné tout en haut où était le logo
      left='50%'  // Centré horizontalement
      style={{
        transform: 'translateX(-50%)', // Ajustement pour un centrage parfait
        justifyContent: 'center',
        // zIndex: 10
      }}
      gap='sm'
    >
      {links.map((link, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: '-10vh' }}  // Animation modifiée pour venir du haut
          animate={{ opacity: 1, y: '0vh' }}
          transition={{ delay: index * 0.2, duration: 0.4, ease: 'easeOut' }}
        >
          <Button
            text={link.title}
            icon={link.icon}
            onClick={() => {
              // @ts-expect-error There is no such thing as invokeNative outside FiveM
              window.invokeNative("openUrl", link.url);
            }}
          />
        </motion.div>
      ))}
    </Flex>
  );
}