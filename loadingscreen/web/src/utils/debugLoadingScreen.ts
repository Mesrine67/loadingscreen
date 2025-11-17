import { isEnvBrowser } from './misc';

// Types des événements de loading screen FiveM
export interface EventsData {
  loadProgress: {
    eventName: 'loadProgress',
    loadFraction: number,
  };
  onLogLine: {
    eventName: 'onLogLine',
    message: string,
  };
  startDataFileEntries: {
    eventName: 'startDataFileEntries',
    count: number,
  };
  onDataFileEntry: {
    eventName: 'onDataFileEntry',
    name: string,
    type: number,
    isNew: boolean,
  };
  performMapLoadFunction: {
    eventName: 'performMapLoadFunction',
    idx: number,
  };
  endDataFileEntries: {
    eventName: 'endDataFileEntries',
  };
  startInitFunction: {
    eventName: 'startInitFunction',
    type: string,
  };
  startInitFunctionOrder: {
    eventName: 'startInitFunctionOrder',
    type: string,
    order: number,
    count: number,
  };
  initFunctionInvoking: {
    eventName: 'initFunctionInvoking',
    type: string,
    name: string,
    idx: number,
    count: number,
  };
  initFunctionInvoked: {
    eventName: 'initFunctionInvoked',
    type: string,
    name: string,
  };
  endInitFunction: {
    eventName: 'endInitFunction',
    type: string,
  };
}

// Type helper pour extraire les événements
type EventName = keyof EventsData;
type EventData<T extends EventName> = EventsData[T];

interface DebugEvent<T extends EventName> {
  eventName: T;
  data: Omit<EventData<T>, 'eventName'>;
  delay?: number; // Délai optionnel pour cet événement spécifique
}

/**
 * Émule les événements de loading screen FiveM pour le développement en navigateur
 *
 * @param events - Les événements à simuler
 * @param baseDelay - Délai de base entre chaque événement (ms)
 */
export const debugLoadingScreen = <T extends EventName>(
  events: DebugEvent<T>[],
  baseDelay = 100
): void => {
  if (process.env.NODE_ENV === 'development' && isEnvBrowser()) {
    let cumulativeDelay = 0;
    for (const event of events) {
      const eventDelay = event.delay ?? baseDelay;
      cumulativeDelay += eventDelay;
      setTimeout(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              eventName: event.eventName,
              ...event.data,
            },
          })
        );
      }, cumulativeDelay);
    }
  }
};

/**
 * Données réalistes basées sur les vrais logs FiveM
 * Améliorées avec les informations extraites du fichier CitizenFX_log_ok.log
 */
const REALISTIC_DATA = {
  // Fichiers d'animations
  animations: [
    'PLATFORM:/ANIM/INGAME/CLIP_ANIM@.RPF',
    'PLATFORM:/ANIM/INGAME/CLIP_AMB@.RPF',
    'PLATFORM:/ANIM/INGAME/CLIP_CREATURES@.RPF',
    'PLATFORM:/ANIM/INGAME/CLIP_MINI@.RPF',
    'PLATFORM:/ANIM/INGAME/CLIP_MOVE@.RPF',
    'PLATFORM:/ANIM/INGAME/CLIP_PARACHUTE@.RPF',
    'PLATFORM:/ANIM/INGAME/CLIP_STUNGUN@.RPF',
    'PLATFORM:/ANIM/INGAME/CLIP_SWIMMING@.RPF',
    'PLATFORM:/ANIM/INGAME/CLIP_VEH@.RPF',
    'PLATFORM:/ANIM/INGAME/CLIP_WEAPON@.RPF',
    'PLATFORM:/ANIM/INGAME/CLIP_COMBAT@.RPF',
    'PLATFORM:/ANIM/INGAME/CLIP_STEALTH@.RPF',
  ],
  // Props et niveaux
  props: [
    'platform:/levels/gta5/generic/icons.rpf',
    'platform:/levels/gta5/props/building/v_rooftop.rpf',
    'platform:/levels/gta5/props/residential/v_electrical.rpf',
    'platform:/levels/gta5/props/residential/v_kitchen.rpf',
    'platform:/levels/gta5/props/commercial/v_fastfood.rpf',
    'platform:/levels/gta5/props/commercial/v_office.rpf',
    'platform:/levels/gta5/props/industrial/v_industrial.rpf',
    'platform:/levels/gta5/props/roadside/v_rubbish.rpf',
    'platform:/levels/gta5/props/vegetation/v_ext_veg.rpf',
    'platform:/levels/gta5/props/urban/v_urban.rpf',
    'platform:/levels/gta5/props/transport/v_transport.rpf',
  ],
  // DLCs
  dlcs: [
    { name: 'dlc_mpheist', handlingCount: 12 },
    { name: 'dlc_mpluxe', handlingCount: 8 },
    { name: 'dlc_mpluxe2', handlingCount: 6 },
    { name: 'dlc_mpgunrunning', handlingCount: 15 },
    { name: 'dlc_mpsmuggler', handlingCount: 11 },
    { name: 'dlc_mpchristmas2017', handlingCount: 9 },
    { name: 'dlc_mpvinewood', handlingCount: 14 },
    { name: 'dlc_mpheist3', handlingCount: 16 },
    { name: 'dlc_mpsum', handlingCount: 13 },
    { name: 'dlc_mpTuner', handlingCount: 17 },
    { name: 'dlc_mpSecurity', handlingCount: 16 },
    { name: 'dlc_mpG9EC', handlingCount: 10 },
    { name: 'dlc_MPSUM2', handlingCount: 18 },
    { name: 'dlc_MPCHRISTMAS3', handlingCount: 13 },
    { name: 'dlc_MP2023_01', handlingCount: 14 },
    { name: 'dlc_MP2023_02', handlingCount: 23 },
    { name: 'dlc_MP2024_01', handlingCount: 21 },
    { name: 'dlc_MP2024_02', handlingCount: 17 },
    { name: 'dlc_MP2025_01', handlingCount: 16 },
    { name: 'dlcSPUpgrade', handlingCount: 12 },
  ],
  // Fonctions d'initialisation - Améliorées avec les données réelles du log
  initFunctions: {
    INIT_CORE: [
      'InitSystem',
      'CShaderLib',
      'PostFX',
      'CGtaAnimManager',
      'CStreamingManager',
      'CGameScriptManager',
      'CNetworkManager',
      'CPhysicsManager',
      'CAudioEngine',
      'CVisualEffects',
      'CNavigationManager',
      'CDecalSystem',
      'CPopulationStreaming',
      'CPathFind',
      'CRenderPhases',
    ],
    INIT_BEFORE_MAP_LOADED: [
      'CMapDataLoader',
      'CWeatherManager',
      'CTimeManager',
      'CZoneManager',
      'CCrashHandler',
      'CWorldStreaming',
    ],
    INIT_AFTER_MAP_LOADED: [
      'CPathNodes',
      'CRenderTargets',
      'CSceneMgr',
      'CWaterSystem',
    ],
    INIT_SESSION: [
      'CPlayerManager',
      'CVehicleManager',
      'CPedManager',
      'CScriptEngine',
      'CDLCScript',
      'audNorthAudioEngineDLC',
      'NetworkConceal',
      'SyncedScenes',
      'FinalizeLoad',
    ],
  },
  // Messages de log réalistes - Améliorés avec les données réelles du log
  logMessages: [
    'Initializing game systems...',
    'Loading game data...',
    'Parsing content metadata...',
    'Mounting DLC packages...',
    'Loading vehicle handling data...',
    'Initializing audio engine...',
    'Loading map data...',
    'Preparing game session...',
    'Finalizing initialization...',
    'Game ready!',
    'Initializing INIT_CORE functions...',
    'Completed INIT_CORE initialization',
    'Starting INIT_BEFORE_MAP_LOADED sequence...',
    'Loading streaming assets...',
    'Preparing world data...',
    'Processing map data...',
    'Initializing network components...',
    'Connecting to server...',
    'Loading session data...',
    'Finalizing session setup...',
  ],
  // Progression de chargement réaliste basée sur les valeurs réelles du log
  loadFractions: [
    0.007314897413024085,
    0.007374368123699078,
    0.007433838834374071,
    0.007463574189711567,
    0.007493309545049063,
    0.0075,
    0.01,
    0.015,
    0.025,
    0.035,
    0.05,
    0.075,
    0.1,
    0.15,
    0.2,
    0.25,
    0.3,
    0.35,
    0.4,
    0.45,
    0.5,
    0.55,
    0.6,
    0.65,
    0.7,
    0.75,
    0.8,
    0.85,
    0.9,
    0.95,
    0.975,
    0.99,
    1.0
  ]
};

/**
 * Simule une séquence complète de chargement FiveM ultra-réaliste
 * Basée sur les vrais logs du jeu et améliorée avec les données du fichier CitizenFX_log_ok.log
 */
export const debugFullLoadingSequence = (): void => {
  if (process.env.NODE_ENV === 'development' && isEnvBrowser()) {
    const sequence: DebugEvent<EventName>[] = [];
    let currentProgress = 0.02;
    let progressIndex = 0;

    // Helper pour ajouter de la progression avec des valeurs réalistes
    const addProgress = (delay = 50) => {
      if (progressIndex < REALISTIC_DATA.loadFractions.length) {
        currentProgress = REALISTIC_DATA.loadFractions[progressIndex++];
      } else {
        currentProgress = Math.min(currentProgress + 0.01, 1.0);
      }
      
      sequence.push({
        eventName: 'loadProgress',
        data: { loadFraction: currentProgress },
        delay,
      });
    };

    // 1. Démarrage initial - INIT_CORE
    sequence.push(
      { eventName: 'onLogLine', data: { message: REALISTIC_DATA.logMessages[10] }, delay: 100 },
      { eventName: 'loadProgress', data: { loadFraction: 0.01 }, delay: 200 },
      { eventName: 'startInitFunction', data: { type: 'INIT_CORE' }, delay: 150 }
    );

    // Ajout de startInitFunctionOrder pour INIT_CORE
    sequence.push({
      eventName: 'startInitFunctionOrder',
      data: { type: 'INIT_CORE', order: 0, count: REALISTIC_DATA.initFunctions.INIT_CORE.length },
      delay: 100,
    });

    // Fonctions INIT_CORE
    REALISTIC_DATA.initFunctions.INIT_CORE.forEach((name, idx) => {
      sequence.push(
        {
          eventName: 'initFunctionInvoking',
          data: { 
            type: 'INIT_CORE', 
            name, 
            idx, 
            count: REALISTIC_DATA.initFunctions.INIT_CORE.length 
          },
          delay: 80,
        },
        {
          eventName: 'initFunctionInvoked',
          data: { type: 'INIT_CORE', name },
          delay: 120,
        }
      );
      addProgress(100);
    });

    sequence.push({
      eventName: 'endInitFunction',
      data: { type: 'INIT_CORE' },
      delay: 150,
    });
    
    sequence.push(
      { eventName: 'onLogLine', data: { message: REALISTIC_DATA.logMessages[11] }, delay: 200 }
    );

    // 2. Chargement des fichiers d'animation
    sequence.push(
      { eventName: 'onLogLine', data: { message: REALISTIC_DATA.logMessages[1] }, delay: 150 },
      {
        eventName: 'startDataFileEntries',
        data: { count: REALISTIC_DATA.animations.length },
        delay: 150,
      }
    );

    REALISTIC_DATA.animations.forEach((anim, idx) => {
      sequence.push({
        eventName: 'onDataFileEntry',
        data: { name: anim, type: 185, isNew: false },
        delay: 30,
      });
      if (idx % 3 === 0) {
        addProgress(30);
      }
    });

    sequence.push({
      eventName: 'endDataFileEntries',
      data: {},
      delay: 100,
    });
    
    addProgress(100);

    // 3. INIT_BEFORE_MAP_LOADED
    sequence.push(
      { eventName: 'onLogLine', data: { message: REALISTIC_DATA.logMessages[12] }, delay: 200 },
      { eventName: 'startInitFunction', data: { type: 'INIT_BEFORE_MAP_LOADED' }, delay: 100 }
    );

    // Ajout de startInitFunctionOrder pour INIT_BEFORE_MAP_LOADED
    sequence.push({
      eventName: 'startInitFunctionOrder',
      data: { 
        type: 'INIT_BEFORE_MAP_LOADED', 
        order: 0, 
        count: REALISTIC_DATA.initFunctions.INIT_BEFORE_MAP_LOADED.length 
      },
      delay: 100,
    });

    const beforeMapInits = REALISTIC_DATA.initFunctions.INIT_BEFORE_MAP_LOADED;
    beforeMapInits.forEach((name, idx) => {
      sequence.push(
        {
          eventName: 'initFunctionInvoking',
          data: { 
            type: 'INIT_BEFORE_MAP_LOADED', 
            name, 
            idx, 
            count: beforeMapInits.length 
          },
          delay: 70,
        },
        {
          eventName: 'initFunctionInvoked',
          data: { type: 'INIT_BEFORE_MAP_LOADED', name },
          delay: 100,
        }
      );
      addProgress(80);
    });

    sequence.push({
      eventName: 'endInitFunction',
      data: { type: 'INIT_BEFORE_MAP_LOADED' },
      delay: 150,
    });

    // 4. Chargement des props
    sequence.push(
      { eventName: 'onLogLine', data: { message: REALISTIC_DATA.logMessages[13] }, delay: 150 },
      {
        eventName: 'startDataFileEntries',
        data: { count: REALISTIC_DATA.props.length },
        delay: 100,
      }
    );

    REALISTIC_DATA.props.forEach((prop, idx) => {
      sequence.push({
        eventName: 'onDataFileEntry',
        data: { name: prop, type: 185, isNew: false },
        delay: 40,
      });
      if (idx % 2 === 0) {
        addProgress(40);
      }
    });

    sequence.push({
      eventName: 'endDataFileEntries',
      data: {},
      delay: 100,
    });
    
    addProgress(150);

    // 5. INIT_AFTER_MAP_LOADED
    sequence.push(
      { eventName: 'onLogLine', data: { message: REALISTIC_DATA.logMessages[15] }, delay: 200 },
      { eventName: 'startInitFunction', data: { type: 'INIT_AFTER_MAP_LOADED' }, delay: 100 }
    );

    // Ajout de startInitFunctionOrder pour INIT_AFTER_MAP_LOADED
    sequence.push({
      eventName: 'startInitFunctionOrder',
      data: { 
        type: 'INIT_AFTER_MAP_LOADED', 
        order: 0, 
        count: REALISTIC_DATA.initFunctions.INIT_AFTER_MAP_LOADED.length 
      },
      delay: 100,
    });

    const afterMapInits = REALISTIC_DATA.initFunctions.INIT_AFTER_MAP_LOADED;
    afterMapInits.forEach((name, idx) => {
      sequence.push(
        {
          eventName: 'initFunctionInvoking',
          data: { 
            type: 'INIT_AFTER_MAP_LOADED', 
            name, 
            idx, 
            count: afterMapInits.length 
          },
          delay: 70,
        },
        {
          eventName: 'initFunctionInvoked',
          data: { type: 'INIT_AFTER_MAP_LOADED', name },
          delay: 100,
        }
      );
      addProgress(80);
    });

    sequence.push({
      eventName: 'endInitFunction',
      data: { type: 'INIT_AFTER_MAP_LOADED' },
      delay: 150,
    });

    // 6. Chargement des DLCs (la partie la plus longue)
    sequence.push(
      { eventName: 'onLogLine', data: { message: REALISTIC_DATA.logMessages[3] }, delay: 200 },
      { eventName: 'startInitFunction', data: { type: 'INIT_SESSION' }, delay: 150 }
    );

    // Ajout de startInitFunctionOrder pour INIT_SESSION
    sequence.push({
      eventName: 'startInitFunctionOrder',
      data: { 
        type: 'INIT_SESSION', 
        order: 0, 
        count: REALISTIC_DATA.dlcs.length + REALISTIC_DATA.initFunctions.INIT_SESSION.length 
      },
      delay: 100,
    });

    REALISTIC_DATA.dlcs.forEach((dlc, idx) => {
      // Chargement du content.xml
      sequence.push(
        { 
          eventName: 'onLogLine', 
          data: { message: `Loading content XML: ${dlc.name}CRC:/content.xml` }, 
          delay: 50 
        },
        {
          eventName: 'initFunctionInvoking',
          data: { 
            type: 'INIT_SESSION', 
            name: dlc.name, 
            idx, 
            count: REALISTIC_DATA.dlcs.length + REALISTIC_DATA.initFunctions.INIT_SESSION.length 
          },
          delay: 60,
        },
        {
          eventName: 'initFunctionInvoked',
          data: { type: 'INIT_SESSION', name: dlc.name },
          delay: 80,
        }
      );

      // Chargement du handling.meta
      if (dlc.handlingCount > 0) {
        sequence.push({
          eventName: 'onLogLine',
          data: { message: `Loading ${dlc.handlingCount} handling entries from ${dlc.name}CRC:/common/data/handling.meta` },
          delay: 60,
        });
      }
      
      addProgress(70);
    });

    // 7. Fonctions finales de session
    const sessionInits = REALISTIC_DATA.initFunctions.INIT_SESSION;
    sessionInits.forEach((name, idx) => {
      sequence.push(
        {
          eventName: 'initFunctionInvoking',
          data: {
            type: 'INIT_SESSION',
            name,
            idx: REALISTIC_DATA.dlcs.length + idx,
            count: REALISTIC_DATA.dlcs.length + sessionInits.length,
          },
          delay: 80,
        },
        {
          eventName: 'initFunctionInvoked',
          data: { type: 'INIT_SESSION', name },
          delay: 100,
        }
      );
      
      addProgress(90);
    });

    // 8. Finalisation
    sequence.push(
      { eventName: 'onLogLine', data: { message: REALISTIC_DATA.logMessages[8] }, delay: 200 },
      { eventName: 'loadProgress', data: { loadFraction: 0.99 }, delay: 150 },
      {
        eventName: 'endInitFunction',
        data: { type: 'INIT_SESSION' },
        delay: 100,
      },
      { eventName: 'loadProgress', data: { loadFraction: 1.0 }, delay: 150 },
      { eventName: 'onLogLine', data: { message: REALISTIC_DATA.logMessages[9] }, delay: 200 }
    );

    console.log(`🎮 Simulation de ${sequence.length} événements de chargement FiveM`);
    debugLoadingScreen(sequence, 0);
  }
};

/**
 * Version simplifiée mais plus réaliste pour tester la progression
 * Simule des paliers de chargement comme dans le vrai jeu
 * Améliorée avec les données réelles du log
 */
export const debugSimpleProgress = (): void => {
  if (process.env.NODE_ENV === 'development' && isEnvBrowser()) {
    const events: DebugEvent<EventName>[] = [];
    
    // Paliers réalistes de chargement FiveM basés sur les logs réels
    const loadingStages = [
      { progress: 0.01, message: 'Initializing...', delay: 300 },
      { progress: 0.03, message: 'Initializing INIT_CORE functions...', delay: 400 },
      { progress: 0.07, message: 'Loading core systems...', delay: 600 },
      { progress: 0.12, message: 'Loading animations...', delay: 500 },
      { progress: 0.18, message: 'Loading game data...', delay: 700 },
      { progress: 0.25, message: 'Loading props and objects...', delay: 800 },
      { progress: 0.35, message: 'Starting INIT_BEFORE_MAP_LOADED sequence...', delay: 600 },
      { progress: 0.45, message: 'Loading map data...', delay: 900 },
      { progress: 0.55, message: 'Processing map data...', delay: 800 },
      { progress: 0.65, message: 'Mounting DLC packages...', delay: 1200 },
      { progress: 0.75, message: 'Loading vehicle data...', delay: 800 },
      { progress: 0.85, message: 'Initializing session...', delay: 700 },
      { progress: 0.92, message: 'Loading audio engine...', delay: 500 },
      { progress: 0.97, message: 'Finalizing...', delay: 400 },
      { progress: 1.0, message: 'Game ready!', delay: 300 },
    ];

    loadingStages.forEach((stage) => {
      events.push(
        {
          eventName: 'onLogLine',
          data: { message: stage.message },
          delay: stage.delay,
        },
        {
          eventName: 'loadProgress',
          data: { loadFraction: stage.progress },
          delay: 50,
        }
      );
    });

    console.log(`🎮 Simulation de progression simplifiée (${loadingStages.length} étapes)`);
    debugLoadingScreen(events, 0);
  }
};

/**
 * Test rapide - Progression linéaire en 3 secondes
 */
export const debugQuickProgress = (): void => {
  if (process.env.NODE_ENV === 'development' && isEnvBrowser()) {
    const steps = 20;
    const events: DebugEvent<'loadProgress'>[] = [];
    
    for (let i = 0; i <= steps; i++) {
      events.push({
        eventName: 'loadProgress',
        data: { loadFraction: i / steps },
        delay: 150,
      });
    }
    
    console.log(`🎮 Test rapide de progression (${steps} étapes, ~3s)`);
    debugLoadingScreen(events, 0);
  }
};

/**
 * Nouvelle fonction pour simuler un chargement ultra-réaliste avec des micro-incréments
 * Basée sur les valeurs réelles observées dans le log
 */
export const debugMicroProgress = (): void => {
  if (process.env.NODE_ENV === 'development' && isEnvBrowser()) {
    const events: DebugEvent<EventName>[] = [];
    const microSteps = 100;
    
    // Progression non-linéaire pour imiter le vrai comportement de FiveM
    // Commence très lentement, puis accélère au milieu, et ralentit à la fin
    for (let i = 0; i <= microSteps; i++) {
      // Formule pour créer une progression non-linéaire
      let progress;
      if (i < microSteps * 0.3) {
        // Début lent
        progress = (i / microSteps) * 0.15;
      } else if (i < microSteps * 0.7) {
        // Milieu rapide
        progress = 0.15 + ((i - microSteps * 0.3) / (microSteps * 0.4)) * 0.7;
      } else {
        // Fin lente
        progress = 0.85 + ((i - microSteps * 0.7) / (microSteps * 0.3)) * 0.15;
      }
      
      events.push({
        eventName: 'loadProgress',
        data: { loadFraction: Math.min(progress, 1.0) },
        delay: Math.floor(Math.random() * 30) + 20, // Délai aléatoire entre 20 et 50ms
      });
      
      // Ajouter quelques messages de log à des moments stratégiques
      if (i === 5) {
        events.push({
          eventName: 'onLogLine',
          data: { message: 'Initializing game systems...' },
          delay: 100,
        });
      } else if (i === 20) {
        events.push({
          eventName: 'onLogLine',
          data: { message: 'Loading core components...' },
          delay: 100,
        });
      } else if (i === 40) {
        events.push({
          eventName: 'onLogLine',
          data: { message: 'Loading map data...' },
          delay: 100,
        });
      } else if (i === 60) {
        events.push({
          eventName: 'onLogLine',
          data: { message: 'Mounting DLC packages...' },
          delay: 100,
        });
      } else if (i === 80) {
        events.push({
          eventName: 'onLogLine',
          data: { message: 'Finalizing initialization...' },
          delay: 100,
        });
      } else if (i === 99) {
        events.push({
          eventName: 'onLogLine',
          data: { message: 'Game ready!' },
          delay: 100,
        });
      }
    }
    
    console.log(`🎮 Simulation de progression micro (${microSteps} micro-étapes)`);
    debugLoadingScreen(events, 0);
  }
};