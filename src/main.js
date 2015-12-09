var app = require('app');
var BrowserWindow = require('browser-window');
const dialog = require('dialog');
var exit = false;

require('crash-reporter').start();

var mainWindow = null;


app.on('before-quit', function(e){
	e.preventDefault();
	dialog.showMessageBox(mainWindow, { type: 'question', buttons: ['Да', 'Нет'], title: 'Выход', message:'Выйти из программы?'}, function(response){
		if(response == 0){
			app.exit(0);
		}
	});
}).on('window-all-closed', function(){
	if(process.platform != 'darwin'){
		app.quit();
	}
});

app.on('ready', function(){
	var Screen = require('screen');

	var size = Screen.getPrimaryDisplay().size;

	var width = size.width;
	var height = size.height;

	mainWindow = new BrowserWindow({ width : width, height: height, minWidth: width, minHeight: height, resizeable: false});

	mainWindow.loadUrl('file://'+__dirname+'/index.html');

	mainWindow.openDevTools();

	mainWindow.on('closed', function(){
		mainWindow = null;
	});
});
