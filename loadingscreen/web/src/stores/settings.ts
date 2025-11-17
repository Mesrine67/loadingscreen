import { create } from 'zustand';
import type { SettingsProps } from './../typings';

export const useSettings = create<SettingsProps>(() => ({
  name: 'PaPi', 
  primaryColor: 'orange', 
  primaryShade: 6,
  carouselTime: 15,
  links: [
    {
      title: 'Discord',
      icon: 'fab fa-discord',
      url: 'https://discord.gg/your-discord-link'
    },
    // {
    //   title: 'Tebex',
    //   icon: 'fa-store',
    //   url: 'https://your-tebex-store-link'
    // },
  ],
  backgroundImages: 2,
  changelogs: [
    {
      title: 'Initial Release',
      date: '2023-10-01',
      entries: [
        {
          type: 'addition',
          content: 'Added initial release of the application.'
        },
        {
          type: 'change',
          content: 'Updated the UI to be more user-friendly.'
        },
        {
          type: 'fix',
          content: 'Fixed bugs in the login process. Fixed bugs in the login process. Fixed bugs in the login process. Fixed bugs in the login process. Fixed bugs in the login process.'
        }
      ]
    },
    {
      title: 'Version 1.1',
      date: '2023-10-15',
      entries: [
        {
          type: 'addition',
          content: 'Added new features to the application.'
        },
        {
          type: 'change',
          content: 'Improved performance of the application.'
        },
        {
          type: 'fix',
          content: 'Fixed issues with the settings page.'
        },
        // Autres entrées de changelog...
      ]
    },
  ],
  songs: [
    {
      title: 'Keep It Gangsta',
      artist: 'Nhale feat Dezzy Hollow',
      fileName: 'keep_it_gangsta.mp3',
      coverArt: 'https://i.ytimg.com/vi/wFnfw9qezKM/hq720.jpg'
    },
    {
      title: 'California Love',
      artist: '2Pac feat. Dr. Dre',
      fileName: 'california_love.mp3',
      coverArt: 'https://i.ytimg.com/vi/5wBTdfAkqGU/maxresdefault.jpg'
    },
    {
      title: 'Still D.R.E.',
      artist: 'Dr. Dre feat. Snoop Dogg',
      fileName: 'still_dre.mp3',
      coverArt: 'https://i.ytimg.com/vi/_CL6n0FJZpk/maxresdefault.jpg'
    },
    {
      title: 'Music and me',
      artist: 'Nate Dogg',
      fileName: 'music_and_me.mp3',
      coverArt: 'https://i.ytimg.com/vi/hK-JRSM0F34/maxresdefault.jpg'
    }
  ],
  // Ajouter une liste par défaut des membres du staff
  serverStaff: [
    {
      name: "Ryan miller",
      role: "Fondateur",
      discordId: "905676330652278854",
      icon: "crown",
      color: "#FFD700"
    },
    {
      name: "sxnsha",
      role: "Co-Fondateur",
      discordId: "1401415239353761876",
      icon: "shield",
      color: "#C0C0C0"
    },
    {
      name: "teddy_91",
      role: "Administrateur",
      discordId: "601541909768568834",
      icon: "user-shield",
      color: "#CD7F32"
    },
    {
      name: "aurelien_ghd",
      role: "Modérateur",
      discordId: "1086625833470414929",
      icon: "user-gear",
      color: "#4682B4"
    },
    {
      name: "PaPi",
      role: "Développeur",
      discordId: "706224646978273311",
      icon: "code",
      color: "#32CD32"
    }
  ]
}));