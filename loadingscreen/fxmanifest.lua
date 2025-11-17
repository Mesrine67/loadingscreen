fx_version 'cerulean'
use_experimental_fxv2_oal 'yes'
lua54 'yes'
game 'gta5'

name 'loadingscreen'
author 'https://github.com/Mesrine67'
version '0.0.1'
description 'loadingscreen by PaPi'

files {
	'web/build/index.html',
	'web/build/public/*',
	'web/build/**/*',
	'web/assets/*.*',
	'web/assets/**/*.*',
}

server_scripts {
  'src/server/*.lua',
}
client_scripts {
    'src/client/*.lua',
}

loadscreen 'web/build/index.html'
loadscreen_cursor 'yes'
loadscreen_manual_shutdown 'yes'
