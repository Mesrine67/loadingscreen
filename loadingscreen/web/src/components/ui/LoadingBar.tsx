import React, { useEffect, useRef, useState } from 'react';
import { Box, Text, Flex, Badge } from '@mantine/core';
import { createStyles, keyframes } from '@mantine/emotion';
import { isEnvBrowser } from "./../../utils/misc";
import { motion, useMotionValue, animate } from "framer-motion";
import { useMantineTheme } from '@mantine/core';
import { useResizeObserver } from '@mantine/hooks';
import colorWithAlpha from "../../utils/colorWithAlpha";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faFile, faFileCode, faFileLines, faMap, faCubes, faSpinner,
  faCircleNotch, faCircleCheck, faCheckDouble, faCode, faCog,
  faServer, faDatabase, faNetworkWired, faGlobe, faTerminal,
  faAngleRight, faCircle
} from '@fortawesome/free-solid-svg-icons';
import { faJs } from '@fortawesome/free-brands-svg-icons';
import type { EventsData } from './../../typings';
import { fetchNui } from '../../utils/fetchNui';
import { debugLoadingScreen } from '../../utils/debugLoadingScreen';
// Fonction utilitaire pour fusionner plusieurs refs
function mergeRefs<T = any>(...refs: React.Ref<T>[]) {
  return (node: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && typeof ref === 'object') {
        (ref as React.MutableRefObject<T>).current = node;
      }
    });
  };
}

// Animations pour la barre de chargement
const moveStripes = keyframes({
  '0%': { backgroundPosition: '0 0' },
  '100%': { backgroundPosition: '40px 0' }
});

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' }
});

const shimmer = keyframes({
  '0%': { left: '-100%' },
  '100%': { left: '200%' }
});

const pulseBackground = keyframes({
  '0%': { backgroundPosition: '0% 50%' },
  '50%': { backgroundPosition: '100% 50%' },
  '100%': { backgroundPosition: '0% 50%' }
});

const equalizer = keyframes({
  '0%': { height: '3px' },
  '50%': { height: '12px' },
  '100%': { height: '3px' }
});

const fadeIn = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 }
});

const pulse = keyframes({
  '0%': { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.05)' },
  '100%': { transform: 'scale(1)' }
});

const blink = keyframes({
  '0%': { opacity: 1 },
  '50%': { opacity: 0 },
  '100%': { opacity: 1 }
});

const typewriter = keyframes({
  '0%': { width: '0%' },
  '100%': { width: '100%' }
});

const useStyles = createStyles((theme, _, u) => ({
  container: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    width: '45%',
    padding: '12px',
    borderRadius: theme.radius.md,
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
    zIndex: 1000,
    animation: `${fadeIn} 0.5s ease-out`,
    transform: 'translateX(0)', // Commencer au milieu (pas de décalage négatif)
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: theme.radius.md,
      background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(16, 185, 129, 0.1), rgba(139, 92, 246, 0.1))',
      backgroundSize: '200% 200%',
      animation: `${pulseBackground} 3s linear infinite`,
      opacity: 0.5,
      transition: 'opacity 0.3s ease',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      width: '200%',
      height: '200%',
      background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 20%, transparent 60%)',
      top: '-50%',
      left: '-50%',
      animation: `${spin} 12s linear infinite`,
      opacity: 0.5,
      filter: 'blur(15px)',
      pointerEvents: 'none',
    },
    [u.smallerThan('sm')]: {
      width: '85%',
      transform: 'translateX(-25%)', // Décalage partiel pour les petits écrans
    }
  },
  
  loadingText: {
    color: 'white',
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: '8px',
    textShadow: '0 0 5px rgba(0,0,0,0.7)',
    fontSize: theme.fontSizes.md,
    [u.smallerThan('sm')]: {
      fontSize: theme.fontSizes.sm
    }
  },
  
  progressContainer: {
    position: 'relative',
    width: '100%',
    height: '1.2vh',
    borderRadius: theme.radius.sm,
    background: 'rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '50%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
      animation: `${shimmer} 2s infinite`,
      transform: 'skewX(-25deg)',
      zIndex: 1,
    }
  },
  
  equalizerBar: {
    width: '0.3rem',
    background: 'linear-gradient(to top, rgba(139, 92, 246, 0.7), rgba(16, 185, 129, 0.7))',
    borderRadius: '1rem',
    transition: 'all 0.2s ease',
    boxShadow: '0 0 10px rgba(139, 92, 246, 0.3)',
    animation: `${equalizer} 1.2s ease-in-out infinite`,
    transformOrigin: 'bottom',
  },
  
  spinAnimation: {
    animation: `${spin} 1.5s linear infinite`
  },
  
  hexGrid: {
    position: 'absolute',
    width: '10rem',
    height: '20rem',
    opacity: 0.15,
    backgroundImage: 'linear-gradient(to right, rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(139, 92, 246, 0.3) 1px, transparent 1px)',
    backgroundSize: '1rem 1rem',
    transform: 'rotate(45deg)',
    pointerEvents: 'none',
    zIndex: -1,
  },
  
  glowEffect: {
    position: 'absolute',
    width: '15rem',
    height: '15rem',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0) 70%)',
    pointerEvents: 'none',
    zIndex: -1,
  },
  
  fileEntry: {
    animation: `${fadeIn} 0.3s ease-out`,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
    }
  },
  
  fileIcon: {
    animation: `${pulse} 1s ease-in-out infinite`,
  },
  
  // Style amélioré pour le conteneur de logs avec un look terminal
  logContainer: {
    background: 'rgba(0, 0, 0, 0.7)',
    borderRadius: theme.radius.sm,
    borderLeft: '2px solid rgba(139, 92, 246, 0.5)',
    maxHeight: '80px',
    overflow: 'auto',
    position: 'relative',
    fontFamily: 'monospace',
    padding: '8px 0 0 0',
    boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5)',
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(0, 0, 0, 0.2)',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(139, 92, 246, 0.5)',
      borderRadius: theme.radius.sm,
    }
  },
  
  // Style pour chaque ligne de log dans le terminal
  logLine: {
    display: 'flex',
    alignItems: 'flex-start',
    paddingLeft: '8px',
    paddingRight: '8px',
    marginBottom: '4px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    '&:last-child': {
      borderBottom: 'none',
    }
  },
  
  // Style pour le prompt du terminal
  terminalPrompt: {
    color: theme.colors.green[5],
    marginRight: '8px',
    fontSize: '0.7rem',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  
  // Style pour le curseur clignotant du terminal
  terminalCursor: {
    display: 'inline-block',
    width: '6px',
    height: '12px',
    backgroundColor: theme.colors.green[5],
    marginLeft: '2px',
    animation: `${blink} 1s infinite`,
  },
  
  statusBadge: {
    animation: `${fadeIn} 0.3s ease-out, ${pulse} 2s infinite ease-in-out`,
  }
}));

// Types pour le suivi des phases de chargement
type LoadingPhase = 'initial' | 'dataFiles' | 'initFunctions' | 'mapLoading' | 'complete';

const LoadingBar: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Chargement...');
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [dataFileCount, setDataFileCount] = useState(0);
  const [totalDataFiles, setTotalDataFiles] = useState(0);
  const [currentDataFile, setCurrentDataFile] = useState('');
  const [initFunctionCount, setInitFunctionCount] = useState(0);
  const [initFunctionTotal, setInitFunctionTotal] = useState(0);
  const [currentInitFunction, setCurrentInitFunction] = useState('');
  const [currentInitType, setCurrentInitType] = useState('');
  const [fileType, setFileType] = useState('');
  const [isNewFile, setIsNewFile] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>('initial');
  const [mapLoadIndex, setMapLoadIndex] = useState(0);
  
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const x = useMotionValue(0);
  const barRef = useRef<HTMLDivElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Utilisation du hook useResizeObserver pour surveiller la taille du conteneur
  const [resizeRef, rect] = useResizeObserver();
  
  // Créer une ref fusionnée pour éviter les problèmes d'assignation
  const mergedContainerRef = mergeRefs(containerRef, resizeRef);
  
  // Mise à jour de la position en fonction de la taille de l'écran
  useEffect(() => {
    if (containerRef.current) {
      const updatePosition = () => {
        if (window.innerWidth < 768) {
          containerRef.current!.style.transform = 'translateX(-25%)';
        } else {
          containerRef.current!.style.transform = 'translateX(0)';
        }
      };
      
      updatePosition();
      window.addEventListener('resize', updatePosition);
      return () => window.removeEventListener('resize', updatePosition);
    }
  }, []);
  
  // Mise à jour de la position de la barre de progression
  useEffect(() => {
    if (!barRef.current) return;
    const width = barRef.current.offsetWidth;
    const percentage = progress / 100;
    const position = percentage * width;
    animate(x, position, { type: "tween", duration: 0.3 });
  }, [progress, rect.width]); // Ajout de rect.width pour réagir aux changements de taille
  
  // Ajout d'un message de log avec limite de taille
  const addLogMessage = (message: string) => {
    setLogMessages(prev => {
      const newLogs = [...prev, message];
      // Garder seulement les 5 derniers messages
      return newLogs.slice(-5);
    });
  };
  
  // Gestionnaire d'événements pour les messages FiveM
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object' || !data.eventName) return;
      
      try {
        console.log(`Received event: ${data.eventName}`, JSON.stringify(data, null, 2));
      } catch (e) {
        console.log(`Received event: ${data.eventName}`, data);
      }
      switch (data.eventName) {
        case 'loadProgress':
          // Mise à jour de la progression
          const loadFraction = (data as unknown as EventsData['loadProgress']).loadFraction;
          setProgress(loadFraction * 100);
          
          // Mise à jour du texte en fonction de la progression
          if (loadFraction < 0.3) {
            setLoadingText('Chargement des ressources...');
            setLoadingPhase('initial');
          } else if (loadFraction < 0.6) {
            setLoadingText('Initialisation du monde...');
            setLoadingPhase('initFunctions');
          } else if (loadFraction < 0.9) {
            setLoadingText('Presque prêt...');
          } else {
            setLoadingText('Bienvenue !');
            setLoadingPhase('complete');
          }
          break;
          
        case 'onLogLine':
          // Affichage des messages de log
          const message = (data as unknown as EventsData['onLogLine']).message;
          if (message) {
            addLogMessage(message);
          }
          break;
          
        // Reste des cas...
        // ...
      }
    };
    
    // Ajout de l'écouteur d'événements
    window.addEventListener('message', handleMessage);
    
    // Nettoyage de l'écouteur d'événements
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  
  // Auto-scroll des logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logMessages]);
  
  // Simulation de progression en mode développement (navigateur)
  useEffect(() => {
    if (isEnvBrowser()) {
      // Code de simulation existant...
    }
  }, [loadingPhase]);
  
  // Fonctions utilitaires existantes...
  const getLoadingIcon = (): IconProp => {
    if (progress < 33) {
      return faSpinner;
    } else if (progress < 66) {
      return faCircleNotch;
    } else if (progress < 100) {
      return faCircleCheck;
    } else {
      return faCheckDouble;
    }
  };
  
  const getPhaseIcon = (): IconProp => {
    switch (loadingPhase) {
      case 'initial': return faServer;
      case 'dataFiles': return faDatabase;
      case 'initFunctions': return faCode;
      case 'mapLoading': return faGlobe;
      case 'complete': return faCheckDouble;
      default: return faSpinner;
    }
  };
  
  const getPhaseColor = (): string => {
    switch (loadingPhase) {
      case 'initial': return 'blue';
      case 'dataFiles': return 'violet';
      case 'initFunctions': return 'cyan';
      case 'mapLoading': return 'orange';
      case 'complete': return 'green';
      default: return theme.primaryColor;
    }
  };
  
  // Génération des barres d'égaliseur pour l'effet audio
  const renderEqualizerBars = () => {
    return Array.from({ length: 8 }).map((_, index) => (
      <div 
        key={index} 
        className={classes.equalizerBar}
        style={{
          height: `${Math.random() * 50 + 30}%`,
          animationDuration: `${Math.random() * 0.8 + 0.4}s`,
          animationDelay: `${index * 0.1}s`
        }}
      />
    ));
  };
  
  // Autres fonctions utilitaires...
  const getFileIcon = (fileName: string): IconProp => {
    if (!fileName) return faFile;
    
    if (fileName.includes('.lua')) return faFileCode;
    if (fileName.includes('.js')) return faJs;
    if (fileName.includes('.meta')) return faFileLines;
    if (fileName.includes('.ymap')) return faMap;
    if (fileName.includes('.ytyp')) return faCubes;
    if (fileName.includes('.xml')) return faFileCode;
    
    return faFile;
  };
  
  const getFileColor = (fileName: string): string => {
    if (!fileName) return 'gray';
    
    if (fileName.includes('.lua')) return 'blue';
    if (fileName.includes('.js')) return 'yellow';
    if (fileName.includes('.meta')) return 'green';
    if (fileName.includes('.ymap')) return 'violet';
    if (fileName.includes('.ytyp')) return 'orange';
    if (fileName.includes('.xml')) return 'cyan';
    
    return 'gray';
  };
  
  const formatFileName = (fileName: string): string => {
    if (!fileName) return '';
    
    // Extraire juste le nom du fichier sans le chemin complet
    const parts = fileName.split('/');
    return parts[parts.length - 1];
  };
  
  const getPhaseText = (): string => {
    switch (loadingPhase) {
      case 'initial': return 'Initialisation';
      case 'dataFiles': return 'Fichiers de données';
      case 'initFunctions': return 'Fonctions d\'initialisation';
      case 'mapLoading': return 'Chargement de la carte';
      case 'complete': return 'Terminé';
      default: return 'Chargement';
    }
  };
  
  // Fonction pour générer un timestamp pour les logs
  const getLogTimestamp = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  };

  return (
    <Box 
      className={classes.container} 
      ref={mergedContainerRef}
    >
      {/* Effets de fond */}
      <div className={classes.hexGrid} style={{ left: '-5rem', top: '20%' }}></div>
      <div className={classes.glowEffect} style={{ left: '70%', top: '30%' }}></div>
      
      {/* Badge de phase actuelle */}
      <Flex justify="center" mb="xs">
        <Badge 
          className={classes.statusBadge}
          size="sm" 
          color={getPhaseColor()} 
          variant="filled"
          leftSection={<FontAwesomeIcon icon={getPhaseIcon()} size="xs" />}
        >
          {getPhaseText()}
        </Badge>
      </Flex>
      
      <Text className={classes.loadingText}>
        {loadingText}
      </Text>
      
      {/* Barre de progression principale */}
      <Flex
        ref={barRef}
        align="center"
        className={classes.progressContainer}
      >
        {/* Fond de la barre avec animation de rayures */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: x,
            borderRadius: theme.radius.sm,
            background: `linear-gradient(90deg,
              ${colorWithAlpha(theme.colors[getPhaseColor()][theme.primaryShade as number], 0.7)} 0%,
              ${colorWithAlpha(theme.colors[getPhaseColor()][theme.primaryShade as number], 0.2)} 100%)`,
            backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)',
            backgroundSize: '40px 40px',
            animation: `${moveStripes} 2s linear infinite`,
            zIndex: 0,
          }}
        />
        
        {/* Effet d'égaliseur sur la barre de progression */}
        {progress > 0 && (
          <Flex 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${progress}%`,
              justifyContent: 'space-around',
              alignItems: 'flex-end',
              paddingBottom: '2px',
              zIndex: 1,
            }}
          >
            {renderEqualizerBars()}
          </Flex>
        )}
        
        {/* Thumb */}
        <motion.div
          style={{
            x,
            position: 'absolute',
            width: '1vh',
            height: '150%',
            borderRadius: theme.radius.sm,
            background: colorWithAlpha(theme.colors[getPhaseColor()][theme.primaryShade as number], 0.5),
            transform: 'translateX(-50%)',
            boxShadow: `0 0 10px ${colorWithAlpha(theme.colors[getPhaseColor()][theme.primaryShade as number], 0.7)}`,
            zIndex: 2,
          }}
        />
      </Flex>
      
      {/* Informations sur le fichier en cours de chargement */}
      <Flex mt="xs" justify="space-between" align="center">
        <Flex align="center" gap="xs" className={classes.fileEntry}>
          {loadingPhase === 'dataFiles' && currentDataFile ? (
            <>
              <FontAwesomeIcon
                icon={getFileIcon(currentDataFile)}
                className={classes.fileIcon}
                style={{ 
                  fontSize: '1.2rem',
                  color: theme.colors[getFileColor(currentDataFile)][5],
                }}
              />
              <Text size="xs" c="dimmed">
                <Text span fw={500} c={getFileColor(currentDataFile)}>
                  {formatFileName(currentDataFile)}
                </Text>
                {isNewFile && <Badge size="xs" color="green" ml={5} variant="dot">Nouveau</Badge>}
              </Text>
            </>
          ) : loadingPhase === 'initFunctions' && currentInitFunction ? (
            <>
              <FontAwesomeIcon
                icon={faCog}
                className={classes.fileIcon}
                style={{ 
                  fontSize: '1.2rem',
                  color: theme.colors.cyan[5],
                }}
              />
              <Text size="xs" c="dimmed">
                <Text span fw={500} c="cyan">
                  {currentInitFunction.split('/').pop()}
                </Text>
                {currentInitType && (
                  <Badge size="xs" color="blue" ml={5} variant="dot">{currentInitType}</Badge>
                )}
              </Text>
            </>
          ) : loadingPhase === 'mapLoading' ? (
            <>
              <FontAwesomeIcon
                icon={faGlobe}
                className={classes.fileIcon}
                style={{ 
                  fontSize: '1.2rem',
                  color: theme.colors.orange[5],
                }}
              />
              <Text size="xs" c="dimmed">
                <Text span fw={500} c="orange">
                  Chargement de la carte
                </Text>
                {mapLoadIndex > 0 && (
                  <Badge size="xs" color="orange" ml={5} variant="dot">Index {mapLoadIndex}</Badge>
                )}
              </Text>
            </>
          ) : (
            <Text size="xs" c="dimmed">{loadingText}</Text>
          )}
        </Flex>
        
        <Flex align="center" gap="xs">
          <FontAwesomeIcon
            icon={getLoadingIcon()}
            style={{ 
              fontSize: '1.2rem', 
              color: progress === 100 ? theme.colors.green[5] : theme.colors[getPhaseColor()][5],
              animation: progress < 100 ? `${spin} 1.5s linear infinite` : 'none'
            }}
          />
          <Text size="xs" fw={600} style={{ 
            minWidth: '35px', 
            textAlign: 'right',
            background: `linear-gradient(90deg, ${theme.colors[getPhaseColor()][5]}, ${theme.colors[getPhaseColor()][3]})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {Math.round(progress)}%
          </Text>
        </Flex>
      </Flex>
      
      {/* Affichage des logs avec style terminal */}
      {logMessages.length > 0 && (
        <Box 
          mt="xs"
          className={classes.logContainer}
          ref={logContainerRef}
        >
          {/* En-tête du terminal */}
          <Flex justify="space-between" px="xs" pb="4px" 
            style={{ 
              borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
              background: 'rgba(0, 0, 0, 0.4)'
            }}
          >
            <Text size="xs" c="dimmed" fw={500}>Terminal</Text>
            <Text size="xs" c={theme.colors[getPhaseColor()][5]}>
              {getLogTimestamp()}
            </Text>
          </Flex>
          
          {/* Messages de log avec style terminal */}
          {logMessages.map((message, index) => (
            <div key={index} className={classes.logLine}>
              <div className={classes.terminalPrompt}>
                <FontAwesomeIcon icon={faAngleRight} size="xs" />
                <FontAwesomeIcon 
                  icon={faCircle} 
                  size="2xs" 
                  style={{ 
                    color: index === logMessages.length - 1 
                      ? theme.colors.green[5] 
                      : theme.colors.gray[5] 
                  }} 
                />
              </div>
              <Text 
                size="xs" 
                c="dimmed" 
                style={{ 
                  fontFamily: 'monospace',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  flex: 1,
                  animation: index === logMessages.length - 1 
                    ? `${typewriter} 0.5s steps(40, end)` 
                    : 'none',
                }}
              >
                {message}
                {index === logMessages.length - 1 && (
                  <span className={classes.terminalCursor}></span>
                )}
              </Text>
            </div>
          ))}
        </Box>
      )}
      
      {/* Statistiques de chargement */}
      <Flex justify="space-between" mt="xs" wrap="wrap">
        {totalDataFiles > 0 && (
          <Flex align="center" gap={5}>
            <FontAwesomeIcon icon={faFile} style={{ fontSize: '0.8rem', color: theme.colors[theme.primaryColor][5] }} />
            <Text size="xs" c="dimmed" style={{ fontSize: '0.7rem' }}>
              <Text span c={theme.primaryColor} fw={500}>{dataFileCount}</Text>
              <Text span c="dimmed">/{totalDataFiles}</Text> fichiers
            </Text>
          </Flex>
        )}
        
        {initFunctionTotal > 0 && (
          <Flex align="center" gap={5}>
            <FontAwesomeIcon icon={faCode} style={{ fontSize: '0.8rem', color: theme.colors[theme.primaryColor][5] }} />
            <Text size="xs" c="dimmed" style={{ fontSize: '0.7rem' }}>
              <Text span c={theme.primaryColor} fw={500}>{initFunctionCount}</Text>
              <Text span c="dimmed">/{initFunctionTotal}</Text> fonctions
            </Text>
          </Flex>
        )}
        
        {currentInitFunction && loadingPhase === 'initFunctions' && (
          <Flex align="center" gap={5}>
            <FontAwesomeIcon icon={faCog} style={{ fontSize: '0.8rem', color: theme.colors.blue[5] }} />
            <Text size="xs" c="dimmed" style={{ fontSize: '0.7rem' }}>
              {currentInitFunction.split('/').pop()}
            </Text>
          </Flex>
        )}
        
        {loadingPhase === 'complete' && (
          <Flex align="center" gap={5}>
            <FontAwesomeIcon icon={faTerminal} style={{ fontSize: '0.8rem', color: theme.colors.green[5] }} />
            <Text size="xs" c="green" style={{ fontSize: '0.7rem' }}>
              Chargement terminé
            </Text>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default LoadingBar;