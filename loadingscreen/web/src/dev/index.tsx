// /**
//  * Données réalistes basées sur les vrais logs FiveM
//  */
// const REALISTIC_DATA = {
//   // Fichiers d'animations
//   animations: [
//     'PLATFORM:/ANIM/INGAME/CLIP_ANIM@.RPF',
//     'PLATFORM:/ANIM/INGAME/CLIP_AMB@.RPF',
//     'PLATFORM:/ANIM/INGAME/CLIP_CREATURES@.RPF',
//     'PLATFORM:/ANIM/INGAME/CLIP_MINI@.RPF',
//     'PLATFORM:/ANIM/INGAME/CLIP_MOVE@.RPF',
//     'PLATFORM:/ANIM/INGAME/CLIP_PARACHUTE@.RPF',
//     'PLATFORM:/ANIM/INGAME/CLIP_STUNGUN@.RPF',
//     'PLATFORM:/ANIM/INGAME/CLIP_SWIMMING@.RPF',
//     'PLATFORM:/ANIM/INGAME/CLIP_VEH@.RPF',
//     'PLATFORM:/ANIM/INGAME/CLIP_WEAPON@.RPF',
//   ],
  
//   // Props et niveaux
//   props: [
//     'platform:/levels/gta5/generic/icons.rpf',
//     'platform:/levels/gta5/props/building/v_rooftop.rpf',
//     'platform:/levels/gta5/props/residential/v_electrical.rpf',
//     'platform:/levels/gta5/props/residential/v_kitchen.rpf',
//     'platform:/levels/gta5/props/commercial/v_fastfood.rpf',
//     'platform:/levels/gta5/props/commercial/v_office.rpf',
//     'platform:/levels/gta5/props/industrial/v_industrial.rpf',
//     'platform:/levels/gta5/props/roadside/v_rubbish.rpf',
//     'platform:/levels/gta5/props/vegetation/v_ext_veg.rpf',
//   ],

//   // DLCs
//   dlcs: [
//     { name: 'dlc_mpheist', handlingCount: 12 },
//     { name: 'dlc_mpluxe', handlingCount: 8 },
//     { name: 'dlc_mpluxe2', handlingCount: 6 },
//     { name: 'dlc_mpgunrunning', handlingCount: 15 },
//     { name: 'dlc_mpsmuggler', handlingCount: 11 },
//     { name: 'dlc_mpchristmas2017', handlingCount: 9 },
//     { name: 'dlc_mpvinewood', handlingCount: 14 },
//     { name: 'dlc_mpheist3', handlingCount: 16 },
//     { name: 'dlc_mpsum', handlingCount: 13 },
//     { name: 'dlc_mpTuner', handlingCount: 17 },
//     { name: 'dlc_mpSecurity', handlingCount: 16 },
//     { name: 'dlc_mpG9EC', handlingCount: 10 },
//     { name: 'dlc_MPSUM2', handlingCount: 18 },
//     { name: 'dlc_MPCHRISTMAS3', handlingCount: 13 },
//     { name: 'dlc_MP2023_01', handlingCount: 14 },
//     { name: 'dlc_MP2023_02', handlingCount: 23 },
//     { name: 'dlc_MP2024_01', handlingCount: 21 },
//     { name: 'dlc_MP2024_02', handlingCount: 17 },
//     { name: 'dlc_MP2025_01', handlingCount: 16 },
//     { name: 'dlcSPUpgrade', handlingCount: 12 },
//   ],

//   // Fonctions d'initialisation
//   initFunctions: {
//     INIT_CORE: [
//       'CStreamingManager',
//       'CGameScriptManager',
//       'CNetworkManager',
//       'CPhysicsManager',
//       'CAudioEngine',
//     ],
//     INIT_BEFORE_MAP_LOADED: [
//       'CMapDataLoader',
//       'CWeatherManager',
//       'CTimeManager',
//     ],
//     INIT_SESSION: [
//       'CPlayerManager',
//       'CVehicleManager',
//       'CPedManager',
//       'CScriptEngine',
//       'CDLCScript',
//       'audNorthAudioEngineDLC',
//     ],
//   },

//   // Messages de log réalistes
//   logMessages: [
//     'Initializing game systems...',
//     'Loading game data...',
//     'Parsing content metadata...',
//     'Mounting DLC packages...',
//     'Loading vehicle handling data...',
//     'Initializing audio engine...',
//     'Loading map data...',
//     'Preparing game session...',
//     'Finalizing initialization...',
//     'Game ready!',
//   ],
// };

// /**
//  * Simule une séquence complète de chargement FiveM ultra-réaliste
//  * Basée sur les vrais logs du jeu
//  */
// export const debugFullLoadingSequence = (): void => {
//   if (process.env.NODE_ENV === 'development' && isEnvBrowser()) {
//     const sequence: DebugEvent<EventName>[] = [];
//     let currentProgress = 0.02;

//     // Helper pour ajouter de la progression
//     const addProgress = (increment: number, delay = 50) => {
//       currentProgress = Math.min(currentProgress + increment, 1.0);
//       sequence.push({
//         eventName: 'loadProgress',
//         data: { loadFraction: currentProgress },
//         delay,
//       });
//     };

//     // 1. Démarrage initial
//     sequence.push(
//       { eventName: 'onLogLine', data: { message: REALISTIC_DATA.logMessages[0] }, delay: 100 },
//       { eventName: 'loadProgress', data: { loadFraction: 0.01 }, delay: 200 }
//     );

//     // 2. Chargement des fichiers d'animation
//     sequence.push({
//       eventName: 'startDataFileEntries',
//       data: { count: REALISTIC_DATA.animations.length },
//       delay: 150,
//     });

//     REALISTIC_DATA.animations.forEach((anim, idx) => {
//       sequence.push({
//         eventName: 'onDataFileEntry',
//         data: { name: anim, type: 185, isNew: false },
//         delay: 30,
//       });
      
//       if (idx % 3 === 0) {
//         addProgress(0.001, 30);
//       }
//     });

//     sequence.push({
//       eventName: 'endDataFileEntries',
//       data: {},
//       delay: 100,
//     });

//     addProgress(0.03, 100);

//     // 3. Chargement des props
//     sequence.push(
//       { eventName: 'onLogLine', data: { message: REALISTIC_DATA.logMessages[1] }, delay: 150 },
//       {
//         eventName: 'startDataFileEntries',
//         data: { count: REALISTIC_DATA.props.length },
//         delay: 100,
//       }
//     );

//     REALISTIC_DATA.props.forEach((prop, idx) => {
//       sequence.push({
//         eventName: 'onDataFileEntry',
//         data: { name: prop, type: 185, isNew: false },
//         delay: 40,
//       });
      
//       if (idx % 2 === 0) {
//         addProgress(0.002, 40);
//       }
//     });

//     sequence.push({
//       eventName: 'endDataFileEntries',
//       data: {},
//       delay: 100,
//     });

//     addProgress(0.05, 150);

//     // 4. Init functions INIT_CORE
//     sequence.push(
//       { eventName: 'onLogLine', data: { message: REALISTIC_DATA.logMessages[2] }, delay: 200 },
//       { eventName: 'startInitFunction', data: { type: 'INIT_CORE' }, delay: 150 }
//     );

//     const coreInits = REALISTIC_DATA.initFunctions.INIT_CORE;
//     coreInits.forEach((name, idx) => {
//       sequence.push(
//         {
//           eventName: 'initFunctionInvoking',
//           data: { type: 'INIT_CORE', name, idx, count: coreInits.length },
//           delay: 80,
//         },
//         {
//           eventName: 'initFunctionInvoked',
//           data: { type: 'INIT_CORE', name },
//           delay: 120,
//         }
//       );
//       addProgress(0.02, 100);
//     });

//     sequence.push({
//       eventName: 'endInitFunction',
//       data: { type: 'INIT_CORE' },
//       delay: 150,
//     });

//     // 5. INIT_BEFORE_MAP_LOADED
//     sequence.push(
//       { eventName: 'onLogLine', data: { message: REALISTIC_DATA.logMessages[6] }, delay: 200 },
//       { eventName: 'startInitFunction', data: { type: 'INIT_BEFORE_MAP_LOADED' }, delay: 100 }
//     );

//     const beforeMapInits = REALISTIC_DATA.initFunctions.INIT_BEFORE_MAP_LOADED;
//     beforeMapInits.forEach((name, idx) => {
//       sequence.push(
//         {
//           eventName: 'initFunctionInvoking',
//           data: { type: 'INIT_BEFORE_MAP_LOADED', name, idx, count: beforeMapInits.length },
//           delay: 70,
//         },
//         {
//           eventName: 'initFunctionInvoked',
//           data: { type: 'INIT_BEFORE_MAP_LOADED', name },
//           delay: 100,
//         }
//       );
//       addProgress(0.015, 80);
//     });

//     sequence.push({
//       eventName: 'endInitFunction',
//       data: { type: 'INIT_BEFORE_MAP_LOADED' },
//       delay: 150,
//     });

//     // 6. Chargement des DLCs (la partie la plus longue)
//     sequence.push(
//       { eventName: 'onLogLine', data: { message: REALISTIC_DATA.logMessages[3] }, delay: 200 },
//       { eventName: 'startInitFunction', data: { type: 'INIT_SESSION' }, delay: 150 }
//     );

//     REALISTIC_DATA.dlcs.forEach((dlc, idx) => {
//       // Chargement du content.xml
//       sequence.push(
//         { eventName: 'onLogLine', data: { message: `Loading content XML: ${dlc.name}CRC:/content.xml` }, delay: 50 },
//         {
//           eventName: 'initFunctionInvoking',
//           data: { type: 'INIT_SESSION', name: dlc.name, idx, count: REALISTIC_DATA.dlcs.length + 3 },
//           delay: 60,
//         },
//         {
//           eventName: 'initFunctionInvoked',
//           data: { type: 'INIT_SESSION', name: dlc.name },
//           delay: 80,
//         }
//       );

//       // Chargement du handling.meta
//       if (dlc.handlingCount > 0) {
//         sequence.push({
//           eventName: 'onLogLine',
//           data: { message: `Loading ${dlc.handlingCount} handling entries from ${dlc.name}CRC:/common/data/handling.meta` },
//           delay: 60,
//         });
//       }

//       addProgress(0.015, 70);
//     });

//     // 7. Fonctions finales de session
//     const sessionInits = REALISTIC_DATA.initFunctions.INIT_SESSION;
//     sessionInits.forEach((name, idx) => {
//       sequence.push(
//         {
//           eventName: 'initFunctionInvoking',
//           data: { 
//             type: 'INIT_SESSION', 
//             name, 
//             idx: REALISTIC_DATA.dlcs.length + idx,
//             count: REALISTIC_DATA.dlcs.length + sessionInits.length + 1,
//           },
//           delay: 80,
//         },
//         {
//           eventName: 'initFunctionInvoked',
//           data: { type: 'INIT_SESSION', name },
//           delay: 100,
//         }
//       );
//       addProgress(0.01, 90);
//     });

//     // 8. Finalisation
//     sequence.push(
//       {
//         eventName: 'initFunctionInvoking',
//         data: { 
//           type: 'INIT_SESSION', 
//           name: 'FinalizeLoad', 
//           idx: REALISTIC_DATA.dlcs.length + sessionInits.length,
//           count: REALISTIC_DATA.dlcs.length + sessionInits.length + 1,
//         },
//         delay: 100,
//       },
//       { eventName: 'loadProgress', data: { loadFraction: 1.0 }, delay: 150 },
//       {
//         eventName: 'endInitFunction',
//         data: { type: 'INIT_SESSION' },
//         delay: 100,
//       },
//       { eventName: 'onLogLine', data: { message: REALISTIC_DATA.logMessages[9] }, delay: 200 }
//     );

//     console.log(`🎮 Simulation de ${sequence.length} événements de chargement FiveM`);
//     debugLoadingScreen(sequence, 0);
//   }
// };

// /**
//  * Version simplifiée mais plus réaliste pour tester la progression
//  * Simule des paliers de chargement comme dans le vrai jeu
//  */
// export const debugSimpleProgress = (): void => {
//   if (process.env.NODE_ENV === 'development' && isEnvBrowser()) {
//     const events: DebugEvent<EventName>[] = [];

//     // Paliers réalistes de chargement FiveM
//     const loadingStages = [
//       { progress: 0.02, message: 'Initializing...', delay: 300 },
//       { progress: 0.05, message: 'Loading core systems...', delay: 400 },
//       { progress: 0.12, message: 'Loading animations...', delay: 600 },
//       { progress: 0.18, message: 'Loading game data...', delay: 500 },
//       { progress: 0.25, message: 'Loading props and objects...', delay: 700 },
//       { progress: 0.35, message: 'Initializing core functions...', delay: 800 },
//       { progress: 0.45, message: 'Loading map data...', delay: 600 },
//       { progress: 0.55, message: 'Mounting DLC packages...', delay: 900 },
//       { progress: 0.65, message: 'Loading DLC content...', delay: 1200 },
//       { progress: 0.75, message: 'Loading vehicle data...', delay: 800 },
//       { progress: 0.85, message: 'Initializing session...', delay: 700 },
//       { progress: 0.92, message: 'Loading audio engine...', delay: 500 },
//       { progress: 0.97, message: 'Finalizing...', delay: 400 },
//       { progress: 1.0, message: 'Ready!', delay: 300 },
//     ];

//     loadingStages.forEach((stage) => {
//       events.push(
//         {
//           eventName: 'onLogLine',
//           data: { message: stage.message },
//           delay: stage.delay,
//         },
//         {
//           eventName: 'loadProgress',
//           data: { loadFraction: stage.progress },
//           delay: 50,
//         }
//       );
//     });

//     console.log(`🎮 Simulation de progression simplifiée (${loadingStages.length} étapes)`);
//     debugLoadingScreen(events, 0);
//   }
// };

// /**
//  * Test rapide - Progression linéaire en 3 secondes
//  */
// export const debugQuickProgress = (): void => {
//   if (process.env.NODE_ENV === 'development' && isEnvBrowser()) {
//     const steps = 20;
//     const events: DebugEvent<'loadProgress'>[] = [];

//     for (let i = 0; i <= steps; i++) {
//       events.push({
//         eventName: 'loadProgress',
//         data: { loadFraction: i / steps },
//         delay: 150,
//       });
//     }

//     console.log(` Test rapide de progression (${steps} étapes, ~3s)`);
//     debugLoadingScreen(events, 0);
//   }
// };
