import { MantineColor, MantineColorShade, MantineColorsTuple } from "@mantine/core";

export interface EventsData {
  loadProgress: { // Triggered when the loading progress percentage is updated.
    eventName: 'loadProgress', // The event name.
    loadFraction: number, // The total loading percentage as a fraction from 0 to 1 (inclusive).
  };
  onLogLine: { // Triggered to log the initialization of resources.
    eventName: 'onLogLine', // The event name.
    message: string, // The log message.
  };
  startDataFileEntries: { // Triggered when data file entries are incoming. | Several onDataFileEntry events will be triggered after this, and a endDataFileEntries event will be triggered after the given data files entries are done.
    eventName: 'startDataFileEntries', // The event name.
    count: number, // The amount of data file entries incoming.
  };
  onDataFileEntry: { // Triggered when a data file entry occurred, as either a result of startDataFileEntries or initFunctionInvoking.
    eventName: 'onDataFileEntry', // The event name.
    name: string, // The name of the data file entry.
    type: number, // The type of the data file entry.
    isNew: boolean, // Whether this data file entry is new.
  };
  performMapLoadFunction: { // Triggered when a map load function was called, either by itself or as a result of onDataFileEntry.
    eventName: 'performMapLoadFunction', // The event name.
    idx: number, // The map index.
  };
  endDataFileEntries: { // Triggered when data file entries have ended, after the startDataFileEntries event and several onDataFileEntry events.
    eventName: 'endDataFileEntries', // The event name.
  };
  startInitFunction: { // startInitFunctionOrder will be triggered after this with additional info, in turn triggering multiple initFunctionInvoking and in turn initFunctionInvoked triggers. After the init functions were invoked, startInitFunctionOrder will be triggered again with additional functions, or endInitFunction will be triggered, finalizing the process.
    eventName: 'startInitFunction', // The event name.
    type: string, // The type of init functions to be invoked.
  };
  startInitFunctionOrder: { // Triggered after startInitFunction, with additional data. May be triggered multiple times under the same init function type, but with a different order value. | Several initFunctionInvoking and in turn initFunctionInvoked events will be triggered after this. After the init functions were invoked, startInitFunctionOrder may be triggered again with additional functions, or endInitFunction will be triggered, finalizing the process.
    eventName: 'startInitFunctionOrder', // The event name.
    type: string, // The type of init functions to be invoked.
    order: number, // The order of the init functions to be invoked.
    count: number, // The amount of init function to be invoked.
  };
  initFunctionInvoking: { // Triggered when an init function is being invoked, as a result of startInitFunctionOrder. | Several onDataFileEntry may be triggered after this. After the init function finishes invoking, initFunctionInvoked will be triggered.
    eventName: 'initFunctionInvoking', // The event name.
    type: string, // The type of init function being invoked.
    name: string, // The name of the init function.
    idx: number, // The index of the init function.
  };
  initFunctionInvoked: { // Triggered after an init function was invoked, after initFunctionInvoking.
    eventName: 'initFunctionInvoked', // The event name.
    type: string, // The type of init function that was invoked.
    name: string, // The name of the init function.
  };
  endInitFunction: { // Triggered when init functions completed invoking, finalizing the startInitFunction event process.
    eventName: 'endInitFunction', // The event name.
    type: string, // The type of init functions that finished invoking.
  };
}

export type ChangelogEntryProps = {
  title: string; 
  date: string;
  entries: {
    type: 'addition' | 'change' | 'fix';
    content: string;
  }[];
}

export type Track = {
  title?: string;
  artist?: string;
  fileName?: string;
  coverArt?: string;
}

export type LinkProps = {
  title: string;
  icon: string;
  url: string;
}

// Définition du type pour les membres du staff
export type StaffMember = {
  name?: string;
  role: string;
  discordId: string;
  icon: string;
  color: string;
  // Champs optionnels qui peuvent être remplis par l'API Discord
  discordUsername?: string;
  discordAvatar?: string;
}

export type SettingsProps = {
  serverAddress?: string;
  name: string;
  primaryColor: MantineColor;
  primaryShade: MantineColorShade;
  carouselTime: number;
  links: LinkProps[];
  songs: Track[];
  changelogs: ChangelogEntryProps[];
  backgroundImages: number;
  // Ajouter le tableau des membres du staff
  serverStaff: StaffMember[];
};
