import '@mantine/carousel/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './index.css';
import './niceFont.css';
import './scrollBar.css';
import './loadingBar.css';

import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { emotionTransform, MantineEmotionProvider } from '@mantine/emotion';

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import ErrorBoundary from './providers/errorBoundary';
import theme from './theme';
import { useSettings } from './stores/settings';
import type { SettingsProps } from './typings';
import { useNuiEvent } from './hooks/useNuiEvent';
import AudioPlayer from './components/Main/AudioPlayer';
import Buttons from './components/Main/Buttons';
import Changelog from './components/Main/Changelogs';
import PlayerOfTheMonth from './components/Main/PlayersOfTheMonth';
import Background from './components/ui/Background';
import Logo from './components/ui/Logo';
import LoadingBar from './components/ui/LoadingBar';
import type { EventsData } from './typings';
library.add(fas, far, fab);

declare global {
  interface Window {
    nuiHandoverData?: SettingsProps;
  }
}
const root = document.getElementById('root');
const App: React.FC = () => {
  const [curTheme, setCurTheme] = useState(theme);
  const primaryColor = useSettings((state) => state.primaryColor);
  const primaryShade = useSettings((state) => state.primaryShade);

  useEffect(() => {
    const updatedTheme = {
      ...theme,
      colors: { ...theme.colors },
      primaryColor: primaryColor,
      primaryShade: primaryShade,
    };
    setCurTheme(updatedTheme);
  }, [primaryColor, primaryShade]);
  
  useEffect(() => {
    useSettings.setState((state) => ({...state, ...window.nuiHandoverData,}));
  }, []);
  
  useNuiEvent('UPDATE_SETTINGS', (data: Partial<SettingsProps>) => {
    useSettings.setState((state) => ({...state, ...data,}));
  });

  // Gestionnaire d'événements DOMContentLoaded
  useEffect(() => {
    const handleDOMContentLoaded = () => {
      console.log('Page chargée, initialisation de l\'écran de chargement');
      console.log(`Vous vous connectez à ${window.nuiHandoverData?.serverAddress}`);
    };
    document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
  }, []);

  return (  
    <MantineEmotionProvider>
      <MantineProvider theme={curTheme} defaultColorScheme='dark' stylesTransform={emotionTransform}>
        <Logo/>
        <PlayerOfTheMonth/>
        <Changelog/>
        <AudioPlayer />
        <Buttons/>
        <Background/>
        <LoadingBar />
      </MantineProvider>
    </MantineEmotionProvider>
  );
};

ReactDOM.createRoot(root!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);