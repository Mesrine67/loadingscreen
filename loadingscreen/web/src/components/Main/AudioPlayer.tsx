import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flex, Image, Text, useMantineTheme, Tooltip, Badge, TypographyStylesProvider, ScrollArea, Grid, Card, Box } from '@mantine/core';
import { useHover, useLocalStorage, useHotkeys } from '@mantine/hooks';
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useSettings } from '../../stores/settings';
import getImgUrl from '../../utils/getImgUrl';
import HeaderBar from './HeaderBar';
import HideTab from './HideTab';
import Slider from './Slider';
import { motion } from 'framer-motion';

type SlideSectionProps = {
  title?: string;
  side?: 'left' | 'right' | 'top' | 'bottom';
  icon: string;
  children?: React.ReactNode;
  left?: string;
  right?: string;
  miw?: string;
  mw?: string;
  top?: string;
  bottom?: string;
  expanded?: boolean;
  onChange?: (expanded: boolean) => void;
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

function SlideSection(props: SlideSectionProps) {
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
  
  const positioning = {left: props.left, right: props.right, top: props.top, bottom: props.bottom};
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
  }, [side, tabSide]);
  
  useEffect(() => {
    if (props.expanded !== undefined) {
      setExpanded(props.expanded);
    }
  }, [props.expanded]);
  
  const handleExpandChange = (newExpanded: boolean) => {
    setExpanded(newExpanded);
    if (props.onChange) {
      props.onChange(newExpanded);
    }
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
        minWidth: props.miw,
        maxWidth: props.mw,
        gap: theme.spacing.xs,
        ...positioning,
        overflow: 'visible',
      }}
    >
      <div style={tabStyle}>
        <HideTab
          side={tabSide as 'left' | 'right'}
          icon={props.icon}
          onChange={handleExpandChange}
          expanded={expanded}
        />
      </div>
      {props.title && <HeaderBar title={props.title.toUpperCase()} />}
      {props.children}
    </motion.div>
  );
}

// Interface pour les types de morceaux
interface Song {
  title?: string;
  artist?: string;
  fileName?: string;
  coverArt?: string;
}

export default function AudioPlayer() {
  const songs = useSettings((state) => state.songs);
  const [premuteVolume, setPremuteVolume] = useLocalStorage<number>({
    key: 'premuteVolume',
    defaultValue: 1,
  });
  const [volume, setVolume] = useLocalStorage<number>({
    key: 'volume',
    defaultValue: 1,
  });
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const theme = useMantineTheme();
  const [isPlaying, setIsPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [playMode, setPlayMode] = useLocalStorage<'normal' | 'repeat' | 'shuffle'>({
    key: 'playMode',
    defaultValue: 'normal',
  });
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [shuffleIndex, setShuffleIndex] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = songs[currentTrackIndex];
  
  // Génère un ordre aléatoire pour la lecture en mode shuffle
  const generateShuffledIndices = useCallback(() => {
    const indices = Array.from({ length: songs.length }, (_, i) => i);
    const currentIdx = indices.indexOf(currentTrackIndex);
    if (currentIdx !== -1) {
      indices.splice(currentIdx, 1);
    }
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    if (currentIdx !== -1) {
      indices.unshift(currentTrackIndex);
    }
    return indices;
  }, [songs.length, currentTrackIndex]);
  
  // Initialiser les indices mélangés quand les chansons changent
  useEffect(() => {
    if (playMode === 'shuffle') {
      setShuffledIndices(generateShuffledIndices());
      setShuffleIndex(0);
    }
  }, [songs, playMode, generateShuffledIndices]);
  
  // Fonction pour gérer le changement d'état de lecture
  const togglePlayState = () => {
    setIsPlaying((prev) => !prev);
    
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(error => {
          console.warn('Erreur lors de la lecture audio:', error);
        });
      }
    }
  };
  
  // Fonction pour gérer le changement de volume
  const handleVolumeChange = (value: number) => {
    const clampedValue = Math.min(Math.max(value, 0), 1);
    setVolume(clampedValue);
    
    const audio = audioRef.current;
    if (audio) {
      audio.volume = clampedValue;
      if (clampedValue === 0 && !muted) {
        setMuted(true);
      } else if (clampedValue > 0 && muted) {
        setMuted(false);
      }
    }
  };
  
  const handleProgressChange = (value: number) => {
    const audio = audioRef.current;
    if (audio && duration > 0) {
      const newTime = (value / 100) * duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  const playPreviousTrack = () => {
    if (currentTime > 5) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    } else {
      if (playMode === 'shuffle') {
        const newShuffleIndex = (shuffleIndex - 1 + shuffledIndices.length) % shuffledIndices.length;
        setShuffleIndex(newShuffleIndex);
        setCurrentTrackIndex(shuffledIndices[newShuffleIndex]);
      } else {
        const newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : songs.length - 1;
        setCurrentTrackIndex(newIndex);
      }
    }
  };
  
  const playNextTrack = useCallback(() => {
    if (playMode === 'repeat' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    } else if (playMode === 'shuffle') {
      const newShuffleIndex = (shuffleIndex + 1) % shuffledIndices.length;
      setShuffleIndex(newShuffleIndex);
      setCurrentTrackIndex(shuffledIndices[newShuffleIndex]);
    } else {
      const newIndex = currentTrackIndex < songs.length - 1 ? currentTrackIndex + 1 : 0;
      setCurrentTrackIndex(newIndex);
    }
  }, [currentTrackIndex, songs.length, playMode, shuffledIndices, shuffleIndex]);
  
  const togglePlayMode = () => {
    if (playMode === 'normal') {
      setPlayMode('repeat');
    } else if (playMode === 'repeat') {
      setPlayMode('shuffle');
      setShuffledIndices(generateShuffledIndices());
      setShuffleIndex(0);
    } else {
      setPlayMode('normal');
    }
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Gestion des événements audio
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = Math.min(Math.max(volume, 0), 1);
      audio.muted = muted;
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      
      const handleEnded = () => {
        playNextTrack();
      };
      
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [currentTrackIndex, volume, muted, playNextTrack]);
  
  // Mise à jour de la source audio quand la piste change
  useEffect(() => {
    if (currentTrack?.fileName) {
      const audio = audioRef.current;
      if (audio) {
        audio.src = getImgUrl(`music/${currentTrack.fileName}`);
        
        // Vérifier si le fichier audio existe
        const testAudio = new Audio(audio.src);
        testAudio.addEventListener('error', () => {
          console.error('Audio file failed to load:', audio.src);
          useSettings.setState((state) => ({
            songs: state.songs.filter((song, index) => index !== currentTrackIndex),
          }));
        });
        
        audio.load();
        if (isPlaying) {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.warn('Autoplay was prevented:', error);
              const enableAutoplay = () => {
                audio.play().catch(console.error);
                document.removeEventListener('click', enableAutoplay);
                document.removeEventListener('keydown', enableAutoplay);
              };
              document.addEventListener('click', enableAutoplay);
              document.addEventListener('keydown', enableAutoplay);
            });
          }
        }
      }
    }
  }, [currentTrackIndex, currentTrack, isPlaying]);
  
  // Tentative d'autoplay au chargement
  useEffect(() => {
    if (songs.length > 0 && currentTrack && currentTrack.fileName) {
      const audio = audioRef.current;
      if (audio) {
        const attemptAutoplay = () => {
          audio.play().catch((error) => {
            console.warn('Initial autoplay was prevented:', error);
            const enableAutoplay = () => {
              audio.play().catch(console.error);
              document.removeEventListener('click', enableAutoplay);
              document.removeEventListener('keydown', enableAutoplay);
            };
            document.addEventListener('click', enableAutoplay);
            document.addEventListener('keydown', enableAutoplay);
          });
        };
        setTimeout(attemptAutoplay, 100);
      }
    }
  }, [songs, currentTrack]);
  
  // Fonction pour rechercher les paroles d'une chanson
  const searchLyrics = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const songTitle = currentTrack?.title || "Chanson inconnue";
      const artistName = currentTrack?.artist || "Artiste inconnu";
      setLyrics(`
        <h2>${songTitle}</h2>
        <h3>par ${artistName}</h3>
        <br>
        <p>Ceci est un exemple de paroles.</p>
        <p>Dans une vraie implémentation, vous récupéreriez les paroles depuis une API.</p>
        <br>
        <p>Verse 1:</p>
        <p>Voici les paroles du premier couplet</p>
        <p>Qui continueraient sur plusieurs lignes</p>
        <p>Comme un vrai texte de chanson</p>
        <br>
        <p>Chorus:</p>
        <p>Et voici le refrain qui est souvent répété</p>
        <p>Avec des mots qui restent dans la tête</p>
        <p>Et qui font que la chanson est mémorable</p>
      `);
      setShowLyrics(true);
    } catch (error) {
      console.error("Erreur lors de la recherche des paroles:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Raccourcis clavier
  useHotkeys([
    ['space', () => {
      if (!document.activeElement || document.activeElement === document.body) {
        togglePlayState();
      }
    }],
    ['m', () => {
      setMuted((prev) => !prev);
      if (muted) {
        setVolume(premuteVolume);
      } else {
        setPremuteVolume(volume);
        setVolume(0);
      }
    }],
    ['ArrowRight', () => playNextTrack()],
    ['ArrowLeft', () => playPreviousTrack()],
    ['ArrowUp', () => {
      const newVolume = Math.min(volume + 0.05, 1);
      handleVolumeChange(newVolume);
    }],
    ['ArrowDown', () => {
      const newVolume = Math.max(volume - 0.05, 0);
      handleVolumeChange(newVolume);
    }],
  ]);
  
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  // Fonction pour jouer une piste spécifique
  const playTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };
  
  // Style commun pour les conteneurs
  const containerStyle = {
    backdropFilter: 'blur(0.5vh)',
    borderRadius: theme.radius.xxs,
    boxShadow: `0 4px 30px rgba(0, 0, 0, 0.1)`,
  };
  
  // Obtenir le chemin de la cover art
  const getCoverArtPath = (song: Song) => {
    if (song.coverArt) {
      return song.coverArt;
    }
    
    // Si fileName existe, on peut essayer de trouver une image correspondante
    if (song.fileName) {
      const baseName = song.fileName.split('.')[0];
      return getImgUrl(`cover/${baseName}.png`);
    }
    
    return 'https://community.mp3tag.de/uploads/default/original/2X/a/acf3edeb055e7b77114f9e393d1edeeda37e50c9.png';
  };

  const getPlaylistColumnCount = () => {
    return 3;
  };
  return (  
    <>
      {/* Lecteur audio standard pour les fichiers locaux */}
      <audio
        ref={audioRef}
        src={currentTrack?.fileName ? getImgUrl(`music/${currentTrack.fileName}`) : ''}
        loop={playMode === 'repeat'}
        autoPlay={true}
        id="audio"
        hidden
      />
      
      <SlideSection
        side='left'
        icon='music'
        miw='80vh' // meme largeur que le playlist partout 
        mw='80vh'
        bottom='2vh'
        left='2vh'
        expanded={isExpanded}
        onChange={setIsExpanded}
      >
        <Box w="100%" maw="100%" style={{ overflow: 'hidden' }}>
          <Grid gutter="md">
            {/* Première ligne - Informations principales et contrôles */}
            <Grid.Col span={12}>
              <Card shadow="sm" padding="md" radius="sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(0.5vh)' }}>
                <Flex gap='md' align="flex-start">
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <Image
                      opacity={0.6}
                      w='10vh'
                      h='10vh'
                      src={currentTrack ? getCoverArtPath(currentTrack) : 'https://community.mp3tag.de/uploads/default/original/2X/a/acf3edeb055e7b77114f9e393d1edeeda37e50c9.png'}
                      radius={'xs'}
                      style={{
                        transition: 'transform 0.3s ease',
                        transform: isPlaying ? 'scale(1)' : 'scale(0.95)',
                      }}
                    />
                    {playMode !== 'normal' && (
                      <Badge
                        size="xs"
                        variant="filled"
                        color={playMode === 'repeat' ? 'blue' : 'violet'}
                        style={{
                          position: 'absolute',
                          bottom: '5px',
                          right: '5px',
                        }}
                      >
                        {playMode === 'repeat' ? 'Repeat' : 'Shuffle'}
                      </Badge>
                    )}
                  </div>
                  
                  <Flex
                    w='100%'
                    direction={'column'}
                    gap='xs'
                  >
                    <Flex justify="space-between" align="center" w="100%">
                      <Text
                        size='2.2vh'
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '40vh',
                        }}
                        title={currentTrack?.title || 'No Track'}
                      >
                        {currentTrack?.title || 'No Track'}
                      </Text>
                      <Text
                        size='xs'
                        c='dimmed'
                      >
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </Text>
                    </Flex>
                    
                    <Text
                      c='dimmed'
                      size='xs'
                      lh={1.2}
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '40vh',
                      }}
                      title={currentTrack?.artist || 'Unknown Artist'}
                    >
                      {currentTrack?.artist || 'Unknown Artist'}
                    </Text>
                    
                    <Flex
                      mt='xs'
                      w='100%'
                      align='center'
                    >
                      <Slider
                        min={0}
                        max={100}
                        step={0.1}
                        hoverLabel={true}
                        value={progressPercentage}
                        onChange={handleProgressChange}
                        w='100%'
                        formatLabel={(val) => formatTime((val / 100) * duration)}
                      />
                    </Flex>
                    
                    <Flex
                      w='100%'
                      justify='space-between'
                      gap='md'
                      mt='xs'
                    >
                      <Tooltip label="Mode de lecture" position="top" withArrow>
                        <div>
                          <MediaControlIcon
                            icon={playMode === 'normal' ? 'fa-solid fa-arrow-right' : 
                                  playMode === 'repeat' ? 'fa-solid fa-repeat' : 
                                  'fa-solid fa-shuffle'}
                            onClick={togglePlayMode}
                          />
                        </div>
                      </Tooltip>
                      
                      <Tooltip label="Précédent" position="top" withArrow>
                        <div>
                          <MediaControlIcon
                            icon='fa-solid fa-backward-step'
                            onClick={playPreviousTrack}
                          />
                        </div>
                      </Tooltip>
                      
                      <Tooltip label={isPlaying ? "Pause" : "Lecture"} position="top" withArrow>
                        <div>
                          <MediaControlIcon
                            icon={isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'}
                            onClick={togglePlayState}
                            size="2.2vh"
                          />
                        </div>
                      </Tooltip>
                      
                      <Tooltip label="Suivant" position="top" withArrow>
                        <div>
                          <MediaControlIcon
                            icon='fa-solid fa-forward-step'
                            onClick={playNextTrack}
                          />
                        </div>
                      </Tooltip>
                      
                      <Tooltip label={muted ? "Activer le son (M)" : "Couper le son (M)"} position="top" withArrow>
                        <div>
                          <MediaControlIcon
                            icon={muted ? 'fa-solid fa-volume-xmark' : 
                                  volume < 0.3 ? 'fa-solid fa-volume-low' : 
                                  'fa-solid fa-volume-high'}
                            onClick={() => {
                              setMuted(!muted);
                              if (muted) {
                                setVolume(premuteVolume);
                              } else {
                                setPremuteVolume(volume);
                                setVolume(0);
                              }
                            }}
                          />
                        </div>
                      </Tooltip>
                      
                      <Tooltip label={showPlaylist ? "Masquer la playlist" : "Afficher la playlist"} position="top" withArrow>
                        <div>
                          <MediaControlIcon
                            icon='fa-solid fa-list'
                            onClick={() => setShowPlaylist(!showPlaylist)}
                            color={showPlaylist ? theme.colors[theme.primaryColor][theme.primaryShade as number] : undefined}
                          />
                        </div>
                      </Tooltip>
                      
                      <Tooltip label={showLyrics ? "Masquer les paroles" : "Afficher les paroles"} position="top" withArrow>
                        <div>
                          <MediaControlIcon
                            icon='fa-solid fa-align-left'
                            onClick={() => {
                              if (!showLyrics && !lyrics) {
                                searchLyrics();
                              } else {
                                setShowLyrics(!showLyrics);
                              }
                            }}
                            color={showLyrics ? theme.colors[theme.primaryColor][theme.primaryShade as number] : undefined}
                          />
                        </div>
                      </Tooltip>
                    </Flex>
                  </Flex>
                </Flex>

                {/* Contrôle du volume */}
                <Flex mt="md" gap='md' align={'center'}>
                  <FontAwesomeIcon 
                    icon={(muted ? 'fa-solid fa-volume-xmark' : 
                          volume < 0.3 ? 'fa-solid fa-volume-low' : 
                          'fa-solid fa-volume-high') as IconProp} 
                    style={{ fontSize: '1.6vh', color: 'rgba(255, 255, 255, 0.8)' }}
                  />
                  <Slider
                    value={volume}
                    onChange={handleVolumeChange}
                    min={0}
                    max={1}
                    step={0.01}
                    formatLabel={(val) => (val * 100).toFixed(0) + '%'}
                    w='100%'
                  />
                  <Text size="xs" fw={500} style={{ minWidth: '30px', textAlign: 'right' }}>
                    {(volume * 100).toFixed(0)}%
                  </Text>
                </Flex>
              </Card>
            </Grid.Col>
            
            {/* Playlist */}
            {showPlaylist && (
              <Grid.Col span={12}>
                <Card shadow="sm" padding="md" radius="sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(0.5vh)' }}>
                  <Card.Section inheritPadding py="xs">
                    <Flex align="center" gap="sm">
                      <FontAwesomeIcon icon={'fa-solid fa-list' as IconProp} style={{ fontSize: '1.8vh' }} />
                      <Text size="sm" fw={500}>Playlist</Text>
                    </Flex>
                  </Card.Section>
                  
                  <ScrollArea h={200} scrollbarSize={6} mt="md" type="auto" offsetScrollbars>
                    <Box pr={10}>
                      <Grid gutter={8}>
                        {songs.map((song, index) => (
                          <Grid.Col span={12/getPlaylistColumnCount()} key={index}>
                            <Card
                              padding="xs"
                              radius="sm"
                              style={{
                                backgroundColor: currentTrackIndex === index ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.3)',
                                cursor: 'pointer',
                                width: 'calc(100% - 8px)',
                                height: 'auto', // Hauteur automatique pour s'adapter au contenu
                                minHeight: '180px', // Hauteur minimale pour assurer une bonne présentation
                                maxWidth: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                              onClick={() => playTrack(index)}
                            >
                              <Card.Section>
                                <div style={{ position: 'relative' }}>
                                  <Image
                                    src={getCoverArtPath(song)}
                                    height={130} // Hauteur augmentée pour une meilleure visibilité
                                    alt={song.title}
                                    fit="cover"
                                  />
                                  {currentTrackIndex === index && (
                                    <div style={{
                                      position: 'absolute',
                                      bottom: '8px',
                                      right: '8px',
                                      backgroundColor: 'rgba(0,0,0,0.7)',
                                      borderRadius: '50%',
                                      width: '22px', // Taille légèrement augmentée
                                      height: '22px', // Taille légèrement augmentée
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      zIndex: 2
                                    }}>
                                      <FontAwesomeIcon
                                        icon={(isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play') as IconProp}
                                        style={{ fontSize: '10px', color: 'white' }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </Card.Section>
                              
                              <Text
                                fw={500}
                                size="xs"
                                mt="xs"
                                style={{
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  fontSize: '0.75rem', // Taille légèrement augmentée
                                }}
                                title={song.title || "Sans titre"}
                              >
                                {song.title || "Sans titre"}
                              </Text>

                              <Text
                                size="xs"
                                c="dimmed"
                                style={{
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  fontSize: '0.7rem', // Taille légèrement augmentée
                                  marginTop: '2px', // Petit espacement ajouté
                                }}
                                title={song.artist || "Artiste inconnu"}
                              >
                                {song.artist || "Artiste inconnu"}
                              </Text>
                            </Card>
                          </Grid.Col>
                        ))}
                      </Grid>
                    </Box>
                  </ScrollArea>
                </Card>
              </Grid.Col>
            )}
            
            {/* Paroles */}
            {showLyrics && lyrics && (
              <Grid.Col span={12}>
                <Card shadow="sm" padding="md" radius="sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(0.5vh)' }}>
                  <Card.Section inheritPadding py="xs">
                    <Flex align="center" gap="sm">
                      <FontAwesomeIcon icon={'fa-solid fa-align-left' as IconProp} style={{ fontSize: '1.8vh' }} />
                      <Text size="sm" fw={500}>Paroles</Text>
                    </Flex>
                  </Card.Section>
                  
                  <ScrollArea h={250} scrollbarSize={6} mt="md">
                    <TypographyStylesProvider>
                      <div dangerouslySetInnerHTML={{ __html: lyrics }} />
                    </TypographyStylesProvider>
                  </ScrollArea>
                </Card>
              </Grid.Col>
            )}
          </Grid>
        </Box>
      </SlideSection>
    </>
  );
}

function MediaControlIcon(props: {
  icon: string,
  onClick: () => void,
  color?: string,
  size?: string
}) {
  const {hovered, ref} = useHover();
  const size = props.size || '1.8vh';
  
  return (
    <Flex
      ref={ref}
      justify='center'
      align='center'
      style={{
        width: '3.5vh',
        height: '3.5vh',
        cursor: 'pointer',
        borderRadius: '50%',
        backgroundColor: hovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        transition: 'background-color 0.2s ease',
      }}
    >
      <FontAwesomeIcon
        icon={props.icon as IconProp}
        style={{
          color: props.color || (hovered ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)'),
          fontSize: size,
          transition: 'transform 0.2s ease, color 0.2s ease',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
        }}
        onClick={props.onClick}
      />
    </Flex>
  )
}