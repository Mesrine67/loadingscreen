local changelogs = {
    {
        title = 'Lancement du Serveur',
        date = '14/06/2025',
        entries = {
            {
                type = 'addition',
                content = 'Ouverture officielle du serveur avec les fonctionnalités de base.'
            },
            {
                type = 'addition',
                content = 'Mise en place du système d\'économie et des emplois principaux.'
            },
            {
                type = 'addition',
                content = 'Ajout du système de propriétés et de véhicules personnalisés.'
            }
        }
    },
    {
        title = 'Mise à jour majeure',
        date = '16/11/2025',
        entries = {
            {
                type = 'addition',
                content = 'Nouvel écran de chargement interactif avec lecteur de musique intégré.'
            },
            {
                type = 'addition',
                content = 'Intégration de la liste du staff avec synchronisation Discord.'
            },
            {
                type = 'change',
                content = 'Amélioration des performances générales du serveur.'
            },
        }
    },
    {
        title = 'Nouveautés Gameplay',
        date = '21/06/2025',
        entries = {
            {
                type = 'addition',
                content = 'Nouveau système de gang/crew.'
            },
        }
    },
}

AddEventHandler('playerConnecting', function(name, _setKickReason, deferrals)
    local discordBotToken = 'MTQyMTkzMzc1NjE1NDkwNDcwNg.GOjstr.3hMgjPsF5TUQhjsxNvG7jD0qmmzWhMH8bxl2ok'
    local staffMembers = {
        {
            name = "Ryan miller",
            role = "Fondateur",
            discordId = "905676330652278854",
            icon = "crown",
            color = "#FFD700" -- Or
        },
        {
            name = "sxnsha",
            role = "Co-Fondateur",
            discordId = "1401415239353761876",
            icon = "shield",
            color = "#C0C0C0" -- Argent
        },
        {
            name = "teddy_91",
            role = "Administrateur",
            discordId = "601541909768568834",
            icon = "user-shield",
            color = "#CD7F32" -- Bronze
        },
        {
            name = "aurelien_ghd",
            role = "Modérateur",
            discordId = "1086625833470414929",
            icon = "user-gear",
            color = "#4682B4" -- Bleu acier
        },
        {
            name = "PaPi",
            role = "Développeur",
            discordId = "706224646978273311",
            icon = "code",
            color = "#32CD32" -- Vert lime
        }
    }
    if discordBotToken ~= 'VOTRE_TOKEN_DISCORD_ICI' then
        for i, member in ipairs(staffMembers) do
            if member.discordId then
                local headers = {
                    ['Authorization'] = 'Bot ' .. discordBotToken,
                    ['Content-Type'] = 'application/json'
                }
                local errorCode, resultData, resultHeaders = PerformHttpRequestAwait('https://discord.com/api/v10/users/' .. member.discordId, 'GET', '', headers)
                if errorCode == 200 and resultData then
                    local userData = json.decode(resultData)
                    if userData then
                        staffMembers[i].discordUsername = userData.username
                        if userData.avatar then
                            local extension = string.sub(userData.avatar, 1, 2) == 'a_' and '.gif' or '.png'
                            staffMembers[i].discordAvatar = 'https://cdn.discordapp.com/avatars/' .. member.discordId .. '/' .. userData.avatar .. extension
                        end
                    end
                else
                    print('Erreur lors de la récupération des données Discord pour ' .. member.name .. ' (ID: ' .. member.discordId .. '): ' .. tostring(errorCode))
                end
                Wait(100)
            end
        end
    end
    local primaryColor = 'orange'
    local primaryShade = 6
    local carouselTime = 15
    local links = {
        { title = 'Discord', icon = 'fab fa-discord', url = 'https://discord.gg/UmrhD4TVRg' },
        { title = 'Tebex', icon = 'fas fa-shopping-cart', url = 'https://www.youtube.com/watch?v=xvFZjo5PgG0' }
    }
    local songs = {
        {
            title = 'Keep It Gangsta',
            artist = 'Nhale feat Dezzy Hollow',
            fileName = 'keep_it_gangsta.mp3',
            coverArt = 'https://i.ytimg.com/vi/wFnfw9qezKM/hq720.jpg'
        },
        {
            title = 'California Love',
            artist = '2Pac feat. Dr. Dre',
            fileName = 'california_love.mp3',
            coverArt = 'https://i.ytimg.com/vi/5wBTdfAkqGU/maxresdefault.jpg'
        },
        {
            title = 'Still D.R.E.',
            artist = 'Dr. Dre feat. Snoop Dogg',
            fileName = 'still_dre.mp3',
            coverArt = 'https://i.ytimg.com/vi/_CL6n0FJZpk/hq720.jpg'
        },
        {
            title = 'Music and me',
            artist = 'Nate Dogg',
            fileName = 'music_and_me.mp3',
            coverArt = 'https://i.ytimg.com/vi/hK-JRSM0F34/hq720.jpg'
        },
    }
    local backgroundImages = 2
    local data = {
        primaryColor = primaryColor,
        primaryShade = primaryShade,
        carouselTime = carouselTime,
        links = links,
        songs = songs,
        changelogs = changelogs,
        backgroundImages = backgroundImages,
        serverStaff = staffMembers
    }
    deferrals.handover(data)
end)