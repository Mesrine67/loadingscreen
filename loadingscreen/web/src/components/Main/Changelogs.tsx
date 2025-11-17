import { Flex, Text, useMantineTheme, ScrollArea } from "@mantine/core";
import { useSettings } from "../../stores/settings";
import { useMemo, useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import HeaderBar from './HeaderBar';
import HideTab from './HideTab';
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export type ChangeLogProps = {
  title: string;
  date: string;
  entries: {
    type: 'addition' | 'change' | 'fix';
    content: string;
  }[];
};

export default function Changelog() {
  const theme = useMantineTheme();
  const changelogs = useSettings((state) => state.changelogs);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [expanded, setExpanded] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const [viewportHeight, setViewportHeight] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  
  // Utiliser une référence pour le viewport au lieu du ScrollArea
  const viewportRef = useRef<HTMLDivElement>(null);

  // Navigation des changelogs
  const nextChangelog = () => {
    setDirection('right');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % changelogs.length);
  };

  const prevChangelog = () => {
    setDirection('left');
    setCurrentIndex((prevIndex) => (prevIndex - 1 + changelogs.length) % changelogs.length);
  };

  const currentChangelog = useMemo(() => {
    return changelogs[currentIndex];
  }, [currentIndex, changelogs]);

  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < changelogs.length - 1;

  // Animation pour le slide section
  const animation = useMemo(() => {
    return {
      initial: { x: '100%', y: 0 },
      animate: { x: expanded ? '0%' : '103%', y: 0 },
    };
  }, [expanded]);

  // Génération des catégories uniques pour le filtre
  const categories = useMemo(() => {
    const allTypes = changelogs.flatMap(log => log.entries.map(entry => entry.type));
    return [...new Set(allTypes)];
  }, [changelogs]);

  // État pour filtrer les types d'entrées
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Toggle un filtre
  const toggleFilter = (type: string) => {
    if (activeFilters.includes(type)) {
      setActiveFilters(activeFilters.filter(t => t !== type));
    } else {
      setActiveFilters([...activeFilters, type]);
    }
  };

  // Filtrer les entrées en fonction des filtres actifs
  const filteredEntries = useMemo(() => {
    if (activeFilters.length === 0) return currentChangelog.entries;
    return currentChangelog.entries.filter(entry => activeFilters.includes(entry.type));
  }, [currentChangelog, activeFilters]);

  // Couleurs pour les types d'entrées
  const typeColors = {
    'addition': 'rgba(26, 120, 26, 0.3)',
    'change': 'rgba(19, 42, 133, 0.46)',
    'fix': 'rgba(255, 0, 0, 0.3)'
  };

  // Icônes pour les types d'entrées
  const typeIcons = {
    'addition': 'plus',
    'change': 'pen',
    'fix': 'wrench'
  };

  // Gestion du défilement
  const handleScroll = (position: { x: number, y: number }) => {
    setScrollPosition(position);
    setIsScrolling(true);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  // Nettoyer le timeout lors du démontage du composant
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Vérifier si le défilement est nécessaire
  const needsScrollbar = useMemo(() => {
    return scrollHeight > viewportHeight;
  }, [scrollHeight, viewportHeight]);

  // Calculer la position du curseur de défilement
  const scrollThumbPosition = useMemo(() => {
    if (!needsScrollbar || viewportHeight === 0) return 0;
    const scrollRatio = scrollPosition.y / (scrollHeight - viewportHeight);
    return scrollRatio * (viewportHeight - 30);
  }, [scrollPosition.y, scrollHeight, viewportHeight, needsScrollbar]);

  // Mettre à jour les dimensions lors du changement de filtre ou de changelog
  useEffect(() => {
    // Réinitialiser le défilement lors du changement de changelog ou de filtre
    if (viewportRef.current) {
      viewportRef.current.scrollTo({ top: 0 });
    }
  }, [currentIndex, activeFilters]);

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
        top: '1vh',
        right: '1vh',
        overflow: 'visible',
        minWidth: '40vh',
        maxWidth: '40vh',
      }}
    >
      <div style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        transform: 'translateY(-50%)',
        zIndex: 10,
      }}>
        <HideTab
          side="left"
          icon={["fas", "book"] as IconProp}
          onChange={setExpanded}
          expanded={expanded}
        />
      </div>
      
      <HeaderBar title="CHANGELOG" />
      
      {/* Navigation des changelogs */}
      <Flex
        w='100%'
        p='xs'
        bg='rgba(0, 0, 0, 0.5)'
        style={{
          backdropFilter: 'blur(0.5vh)',
          borderRadius: theme.radius.xxs,
          boxShadow: `0 4px 30px rgba(0, 0, 0, 0.1)`,
        }}
        align='center'
        justify='space-between'
        gap='sm'
      >
        <FontAwesomeIcon
          icon={['fas', 'angle-left'] as IconProp}
          style={{
            cursor: 'pointer',
            color: canGoLeft ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)',
            pointerEvents: canGoLeft ? 'auto' : 'none',
            fontSize: '1.6vh',
          }}
          onClick={prevChangelog}
        />

        <Flex
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            height: '4vh',
            overflow: 'hidden',
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentChangelog.title + currentChangelog.date}
              initial={{
                x: direction === 'left' ? '-100%' : '100%',
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              exit={{
                x: direction === 'left' ? '100%' : '-100%',
                opacity: 0,
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Text
                fz='xs'
                c='rgba(255, 255, 255, 0.8)'
                style={{
                  fontWeight: 'bold',
                  letterSpacing: '0.1vh',
                  textAlign: 'center',
                }}
              >
                {currentChangelog.title}
              </Text>
              <Text
                size='xxs'
                c='dimmed'
              >
                {currentChangelog.date}
              </Text>
            </motion.div>
          </AnimatePresence>
        </Flex>

        <FontAwesomeIcon
          icon={['fas', 'angle-right'] as IconProp}
          style={{
            cursor: 'pointer',
            color: canGoRight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)',
            pointerEvents: canGoRight ? 'auto' : 'none',
            fontSize: '1.6vh',
          }}
          onClick={nextChangelog}
        />
      </Flex>

      {/* Filtres */}
      <Flex
        w='100%'
        p='xs'
        bg='rgba(0, 0, 0, 0.5)'
        style={{
          backdropFilter: 'blur(0.5vh)',
          borderRadius: theme.radius.xxs,
          boxShadow: `0 4px 30px rgba(0, 0, 0, 0.1)`,
        }}
        align='center'
        justify='center'
        gap='sm'
        wrap="wrap"
      >
        {categories.map(type => (
          <Flex
            key={type}
            p='xs'
            style={{
              borderRadius: theme.radius.xxs,
              backgroundColor: activeFilters.includes(type) ? typeColors[type as keyof typeof typeColors] : 'rgba(0, 0, 0, 0.3)',
              cursor: 'pointer',
              opacity: activeFilters.length === 0 || activeFilters.includes(type) ? 1 : 0.5,
              transition: 'all 0.2s ease',
            }}
            onClick={() => toggleFilter(type)}
            align='center'
            gap='xs'
          >
            <FontAwesomeIcon
              icon={['fas', typeIcons[type as keyof typeof typeIcons]] as IconProp}
              style={{
                fontSize: '0.8vh',
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            />
            <Text
              size='xxs'
              c='rgba(255, 255, 255, 0.8)'
              style={{
                fontWeight: 500,
                letterSpacing: '0.1vh',
                textTransform: 'capitalize',
              }}
            >
              {type}
            </Text>
          </Flex>
        ))}
        {activeFilters.length > 0 && (
          <Flex
            p='xs'
            style={{
              borderRadius: theme.radius.xxs,
              backgroundColor: 'rgba(150, 150, 150, 0.3)',
              cursor: 'pointer',
            }}
            onClick={() => setActiveFilters([])}
            align='center'
            gap='xs'
          >
            <FontAwesomeIcon
              icon={['fas', 'times'] as IconProp}
              style={{
                fontSize: '0.8vh',
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            />
            <Text
              size='xxs'
              c='rgba(255, 255, 255, 0.8)'
              style={{
                fontWeight: 500,
                letterSpacing: '0.1vh',
              }}
            >
              Clear
            </Text>
          </Flex>
        )}
      </Flex>

      {/* Contenu des changelogs avec ScrollArea de Mantine */}
      <div style={{ 
        width: '100%', 
        position: 'relative',
        background: 'rgba(0, 0, 0, 0.5)',
        borderRadius: theme.radius.xxs,
        boxShadow: `0 4px 30px rgba(0, 0, 0, 0.1)`,
        backdropFilter: 'blur(0.5vh)',
      }}>
        <ScrollArea 
          h="auto"  // Changé de "30vh" à "auto" pour s'adapter au contenu
          mah="30vh" // Hauteur maximale pour limiter la taille
          type="always"
          scrollbarSize={4}
          scrollHideDelay={1000}
          viewportRef={viewportRef}
          onScrollPositionChange={handleScroll}
          styles={{
            root: {
              width: '100%',
            },
            viewport: {
              padding: theme.spacing.xs,
              minHeight: filteredEntries.length > 0 ? 'unset' : '15vh', // Hauteur minimale pour éviter l'écrasement
            },
            scrollbar: {
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent',
              }
            },
            thumb: {
              backgroundColor: isScrolling ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)',
              transition: 'background-color 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              }
            }
          }}
        >
          <motion.div
            layout
            initial={false}
            animate={{ height: "auto" }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.sm,
              paddingBottom: '0.5vh', // Ajouter un peu d'espace en bas
            }}
          >
            {filteredEntries.length > 0 ? (
              filteredEntries.map((change, index) => (
                <motion.div
                  key={`${currentIndex}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.1,
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: theme.spacing.xs,
                  }}
                >
                  <FontAwesomeIcon
                    icon={['fas', typeIcons[change.type as keyof typeof typeIcons]] as IconProp}
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: theme.fontSizes.xxs,
                      aspectRatio: '1/1',
                      marginRight: '0.5vh',
                      minWidth: '2.5vh',
                      borderRadius: theme.radius.xxs,
                      padding: '0.5vh',
                      backgroundColor: typeColors[change.type as keyof typeof typeColors],
                    }}
                  />

                  <Text
                    size='xxs'
                    c='rgba(255, 255, 255, 0.8)'
                    style={{
                      fontWeight: 500,
                      letterSpacing: '0.1vh',
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      flex: 1,
                    }}
                  >
                    {change.content}
                  </Text>
                </motion.div>
              ))
            ) : (
              <Flex
                align="center"
                justify="center"
                direction="column"
                p="md"
                style={{ 
                  opacity: 0.7,
                  minHeight: '15vh', // Hauteur minimale pour le message "No entries"
                }}
              >
                <FontAwesomeIcon
                  icon={['fas', 'filter-circle-xmark'] as IconProp}
                  style={{ fontSize: '2vh', marginBottom: '1vh' }}
                />
                <Text size="xs" ta="center">
                  No entries match your filters
                </Text>
              </Flex>
            )}
          </motion.div>
        </ScrollArea>
      </div>

      {/* Indicateur de pagination */}
      <Flex
        justify="center"
        align="center"
        gap="xs"
        style={{ marginTop: '0.5vh' }}
      >
        {changelogs.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: '0.8vh',
              height: '0.8vh',
              borderRadius: '50%',
              backgroundColor: idx === currentIndex 
                ? 'rgba(255, 255, 255, 0.8)' 
                : 'rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => {
              setDirection(idx > currentIndex ? 'right' : 'left');
              setCurrentIndex(idx);
            }}
          />
        ))}
      </Flex>
    </motion.div>
  );
}