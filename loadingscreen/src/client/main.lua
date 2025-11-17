RegisterNUICallback('consoleLog', function(data, cb)
    print(json.encode(data, { indent = true, sort_keys = true }))
    cb({})
end)