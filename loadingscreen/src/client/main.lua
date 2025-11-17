RegisterNUICallback('consoleLog', function(data, cb)
    print(json.encode(data, { indent = true, sort_keys = true }))
    cb({})
end)

AddEventHandler('esx:loadingScreenOff', function()
    print('loadingScreen: OFF')
    SendNUIMessage({ type = 'loadingScreenState', state = false })
end)