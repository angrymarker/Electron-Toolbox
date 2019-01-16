//***	Importings items needed	***//
console.time('init')


const {
	app
	, BrowserWindow
	, dialog
	, Menu
	, MenuItem
	, ipcMain
, } = require('electron');
let win;
var allowclose = false;
var devtoolsadded = false;

//app.commandLine.appendSwitch('--disable-http2')
app.disableHardwareAcceleration(); 
//##	Fully quit app when all windows are closed	##//
app.on('window-all-closed', () => {
	app.quit();
})

//##	Starting process	##//
app.on('activate', () => {
	if (win === null) {
		createWindow();
	}
})

app.on('ready', () => {
	createWindow();
	  console.timeEnd('init')

});
const menu = new Menu();

//***	Context Menu	***//
//##	All items within the context menu	##//

//##	Undo and redo	##//
menu.append(new MenuItem({
	label: 'Undo'
	, role: 'undo'
}));
menu.append(new MenuItem({
	label: 'Redo'
	, role: 'redo'
}));
menu.append(new MenuItem({
	type: 'separator'
}));
//##	Select all/cut/copy/paste	##//
menu.append(new MenuItem({
	label: 'Select all'
	, role: 'selectall'
}));
menu.append(new MenuItem({
	label: 'Cut'
	, role: 'cut'
}));
menu.append(new MenuItem({
	label: 'Copy'
	, role: 'copy'
}));
menu.append(new MenuItem({
	label: 'Paste'
	, role: 'pasteandmatchstyle'
}));
menu.append(new MenuItem({
	type: 'separator'
}));
//##	Reload page	##//
menu.append(new MenuItem({
	label: 'Reload'
	, role: 'forcereload'
}));
//##	Zoom in/out/reset	##//
menu.append(new MenuItem({
	label: 'Zoom In'
	, role: 'zoomin'
}));
menu.append(new MenuItem({
	label: 'Zoom Out'
	, role: 'zoomout'
}));
menu.append(new MenuItem({
	label: 'Reset Zoom'
	, role: 'resetzoom'
}));

menu.append(new MenuItem({
			type: 'separator'
		}));
		menu.append(new MenuItem({
			label: 'Open Dev Tools'
			, role: 'toggledevtools'
		}));

function createcontextmenu(createdebug = false)
{
//##	Open the dev tools	##//
try {
	if (createdebug == true && devtoolsadded == false) {
		devtoolsadded = true;
		menu.append(new MenuItem({
			type: 'separator'
		}));
		menu.append(new MenuItem({
			label: 'Open Dev Tools'
			, role: 'toggledevtools'
		}));
	}
} catch (err) {

}


}
//##	Create main interface window	##//
function createWindow() {
	win = new BrowserWindow({
		title: "CD Toolbox"
		, show: true, //##	Hide till it's ready to show	##//
		backgroundColor: '#a1af6c', //##	Prevent white flash during load/page change	##//
		width: 1050
		, height: 650
		, frame: false, //##	Custom title bar	##//
		icon: 'images/cdtoolboxicon.png'
	});
	//##	loadFile for relative path	##//
	win.loadFile('index.html');

	//##	Release resources when closed	##//
	win.on('closed', () => {
			win = null;
		})
		//##	Handle Crashes	##/
	win.webContents.on('crashed', () => {
		const options = {
			type: 'info'
			, title: 'Renderer Process Crashed'
			, message: 'This process has crashed.'
			, buttons: ['Reload', 'Close']
		};
		dialog.showMessageBox(options, (index) => {
			if (index === 0) win.reload();
			else win.close();
		});
	});
	//##	Wait till dom is loaded before opening window	##//
	win.on('ready-to-show', function () {
		//win.show();
		win.focus();
	});

	win.on('close', function (e) {
		
		if (allowclose == false) {
			console.log('closing');
			e.preventDefault();
			allowclose = true;
			win.webContents.send('info', {
				msg: 'hello from main process'
			});
		}
		setTimeout(function () {
			try
			{
				win.close();
			}
			catch (err)
			{}
		}, 100);
	});
	
	//##	Handle Hanging - temporarily disabled	##//
	/*win.on('unresponsive', () => {
	    const options = {
	        type: 'info',
	        title: 'Renderer Process Hanging',
	        message: 'This process is hanging.',
	        buttons: ['Reload', 'Wait', 'Close']
	    }
	    dialog.showMessageBox(options, (index) => {
	    	if (index === 0) {win.reload()}
	    	else if (index === 1) {}
	    	else {win.close()}
	    })
	})*/

}

ipcMain.on('createcontext', (event, arg) => {
  console.log(arg) // prints "ping"
  createcontextmenu(arg);
})
	
//##	Allow renderer to pop up the context menu	##//
app.on('browser-window-created', (event, win) => {
	win.webContents.on('context-menu', (e, params) => {
		menu.popup(win, params.x, params.y)
	})
})

ipcMain.on('show-context-menu', (event) => {
	const win = BrowserWindow.fromWebContents(event.sender)
	menu.popup(win)
})