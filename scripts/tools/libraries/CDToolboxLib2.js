//Global Requires
require('events').EventEmitter.prototype._maxListeners = 100;
const {
	dialog
} = window.require('electron').remote;
var nodeConsole = get_nodeConsole();
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

//***	RunCommandLineSynchronous CMD Line Call	***//
exports.RunCommandLine = function(FilenameAndParams, toast, status) {
	
	var output = "";
	try {
		//var child_process = window.('child_process');
		output = get_childprocess().execSync(FilenameAndParams);
		//##	Output is usually blank for me, depends on the app?	##//
		console.log(output.toString());
		this.updateProgress(status, 100, toast);
			this.notify(status);
	} catch (error) {
		console.error(error);
	}
	return output;
}

//***	openfile - Based on system settings, open file in default environment	***//
exports.RunCommandLineAsync = function(contents, toast, status) {
	debugger;
	//var child_process = window.('child_process');
	try {
		get_childprocess().exec(contents, (error, stdout, stderr) => {
			if (stdout.indexOf("Complete") > -1)
			{
				
			}
			else if (error) {
				console.error(`exec error: ${error}`);
				return;
			}
			this.updateProgress(status, 100, toast);
			this.notify(status);
		});
	} catch (error) {
		throw error;
	}
}

//***	findFilesInDir - Searches every file in the directory, incluiding subdirectories, matching the filter	***//
exports.findFilesInDir = function(startPath, filter) {
	var results = [];
	if (!get_fs().existsSync(startPath)) {
		return;
	}
	var files = get_fs().readdirSync(startPath);
	for (var i = 0; i < files.length; i++) {
		var filename = get_path().join(startPath, files[i]);
		var stat = get_fs().lstatSync(filename);
		if (stat.isDirectory()) {
			results = results.concat(this.findFilesInDir(filename, filter));
		} else if (filename.toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
			results.push(filename);
		}
	}
	return results;
}

//***	findFilesInDirTopLayer - Searches every file in the directory, matching the filter	***//
exports.findFilesInDirTopLayer = function(startPath, filter) {
	var files = [];
	if (get_fs().existsSync(startPath) != true)
	{
		return files;
	}
	var results = get_fs().readdirSync(startPath);
	

	for (var r = 0; r < results.length; r++)
	{
		if (results[r].toLowerCase().indexOf(filter.toLowerCase()) > -1)
		{
			files.push(get_path().join(startPath,results[r]));
		}
	}
	return files;
}

//***	deletefile - Synchronously deletes a file. (Does it need to be synchronous?)	***//
exports.deletefile = function(file) {
	get_fs().unlink(file, (err) => {
		if (err) {
			sleep(1)
			deletefile(file);
		}
		//console.log('path/file.txt was deleted');
	});
}

//***	checkfilenames - asset validation - check that filenames aren't larger than 80 characters	***//
exports.checkfilenames = function(files) {
	var results = [];
	for (var i = 0; i < files.length; i++) {
		var filename = files[i];
		if (get_path().basename(filename).length > 80) {
			logger.log('info', 'Long asset file name found ' + filename);
			results.push(filename);
		}
	}
	return results;
}

//***	checkfilesizes - asset validation - check that the file sizes are smaller than 10Mb	***//
exports.checkfilesizes = function(files) {
	var results = [];
	for (var i = 0; i < files.length; i++) {
		var filename = files[i];
		const stats = get_fs().statSync(filename);
		const fileSizeInBytes = stats.size;
		const fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
		if (fileSizeInMegabytes > 9) {
			logger.log('info', 'File bigger than 9mb found: ' + filename);
			results.push(filename);
		}
	}
	return results;
}

//***	openpathinexploror - Opens the folder or file in your explorer window	***//
exports.openpathinexploror = function(path) {
	const {
		shell
	} = window.require('electron');
	shell.openItem(path);
}

//***	hexToRgb -Converts a hex color to RGB object	***//
//https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
exports.hexToRgb = function(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16)
		, g: parseInt(result[2], 16)
		, b: parseInt(result[3], 16)
	} : null;
}

//***	xlsx2json - Converts an Excel file to JSON data	***//
exports.xlsx2json = function(xlsxfile) {
	var parser = window.require('simple-excel-to-json');
	var doc = parser.parseXls2Json(xlsxfile);
	return doc;
}

//***	dedupearray - Remove duplicates from array	***//
exports.dedupearray = function(array) {
	var newarray = array;
	//##	No idea how this works	##//
	newarray = newarray.filter((el, i, arr) => arr.indexOf(el) === i);
	return newarray;
}

//***	removeemptiesinarray - Removes empty items from an array	***//
exports.removeemptiesinarray = function(array) {
	var newarray = array;
	newarray = newarray.filter(Boolean);
	return newarray;
}

//***	addarraytosselect - Give it an array and a select, and the items will be added to the array	***//
exports.addarraytosselect = function(opts, select) {
	select.find('option').not(':first').remove();
	for (var i = 0; i < opts.length; i++) {
		if (opts[i].length == 3) {
			select.append('<option value="' + opts[i] + '" data-count="' + i + '">' + opts[i] + '</option>');
		} else {}
	}
}

//***	notify - Based on user settings, sends the user a notification	***//
exports.notify = function(message, warn = false, title = "CD Toolbox") {
	//##	Add notification to the notification panel	##//
	addtonotifbar(message);
	if (get_settings().get('Main.UseNotifications')) {
		//##	Set icon	##//
		var icon = "images/toolbox_icon_64.png";
		if (warn == true) {
			//##	Use warning icon if needed	##//
			icon = "images/caution_icon_64.png";
		}
		//##	Create Notification	##//
		var notification = new Notification(title, {
			icon: icon
			, body: message
		});
		//##	When clicked, open system prompt of same message	##//
		notification.onclick = function (event) {
			this.newalert(message);
		}
	} else {
		//##	Use system prompt if user does not like notifications	##//
		this.newalert(message, title, warn);
	}
}

//***	addtonotifbar - adds notification to the notification panel	***//
function addtonotifbar(message) {
	var notif = message;
	notif = '<li>' + message + ' <span class="deletebutton" name="deletenotif">&#10060;</span></li>';
	//##	Add notification to the top	##//
	$("#allnotifications").prepend(notif);
	try {
		//##	Remove the "No new notifications" Messaging, if it exists	##//
		$("#defaultnotif").remove();
	} catch (err) {}
	//##	Remembers the last notifications, to make them persistent	##//
	get_settings().set('Main.Notifications', $("#allnotifications").html());
	var count = $('ul#allnotifications li').length
	$("#notifications").attr("data-badge", count);
}

//***	prompt - Pop up message where user can select an option	***//
exports.prompt = function(message, title = "CD Toolbox", opt1 = "Yes", opt2 = "No") {
	try {
		const choice = dialog.showMessageBox({
			type: 'question'
			, buttons: [opt1, opt2], //##	Can probably have a couple hundred options	##//
			title: title
			, message: message
			, defaultId: 0, //##	Default button (to click enter to accept	##//
			cancelId: 1 //##	Built in cancel function	##//
		});

		const leave = (choice === 0);
		if (leave) {
			return true;
		}
		return false;
	} catch (err) {
		console.error(err);
	}
}

//***	newalert - stop using alert, use this instead. Same thing, just utilizes system prompts	***//
exports.newalert = function(message, title = "CD Toolbox", prompt = false, opt1 = "Ok") {
	var type = "info";
	if (prompt == true) {
		type = "error";
	}
	try {
		const choice = dialog.showMessageBox({
			type: type
			, buttons: [opt1]
			, title: title
			, message: message
			, defaultId: 0
			, cancelId: 1
		});
		const leave = (choice === 0);
		if (leave) {
			return true;
		}
		return false;
	} catch (err) {
		console.error(err);
	}
}

//***	openfile - Based on system settings, open file in default environment	***//
exports.openfile = function(contents) {
	//var child_process = window.('child_process');
	try {
		get_childprocess().exec('"' + contents + '"');
	} catch (error) {
		throw error;
	}
}

//***	updateProgress - Updates the status bar and label in one function	***//
exports.updateProgress = function(status, value = 100, toast = null) {
	$("#progresslabel").text(status);
	//##	Pass a -1 to make the bar continously scrolling	##//
	if (value == -1) {
		$("#progress").removeAttr("value");
	} else {
		$("#progress").attr('value', value);
	}
	if (get_settings().has('Main.OutlineProgress'))
	{
	
	}
	else
	{
		get_settings().set('Main.OutlineProgress', false);
	}
	if (toast == null || get_settings().get('Main.OutlineProgress') == false)
	{}
	else
	{
		toast.append(status);
	}
}

//***	replaceAll - Replace function replaces the first instance, this replaces all instances	***//
exports.replaceAll = function(str, find, replace) {
	//##	Not very sure what's happening here	##//
	return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

//***	escapeRegExp - Compliment function to replaceAll	***//
function escapeRegExp(str) {
	//##	Not very sure what's happening here	##//
	return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

//***	grablastfromarray - Grab the last object in the provided array	***//
/*exports.grablastfromarray = function(array) {
	var last = array.slice(-1)[0];
	return last;
}*/

//***	removefromarray - Remove provided value from provided array	***//
exports.removefromarray = function(array, search_term) {
	for (var y = array.length - 1; y >= 0; y--) {
		if (array[y] === search_term) {
			array.splice(y, 1);
			return array;
		}
	}
	return array;
}

//***	sleep - Similar to .net's thread.wait(), freezes the form while it waits for a process to finish	***//
exports.sleep = function(seconds) {
	//##	Gets current time, down to the second, and adds the seconds to wait. then waits till it hits that time before releasing to the next step	##//
	var e = new Date().getTime() + (seconds * 1000);
	while (new Date().getTime() <= e) {}
}

exports.sleep2 = function(path, seconds) {
	var seconds = setInterval(function () {
		const file = path;
		const fileExists = get_fs().existsSync(file);
		if (fileExists == false) {
			clearInterval(seconds * 1000);
		}
	}, seconds);
};

//***	getfilesfromselect - Grabs all opt's values from a select and returns them in an array	***//
exports.getfilesfromselect = function(selectid) {
	var assets = [];
	$('#' + selectid + ' option').each(function () {
		var val = $(this).val();
		assets.push(val);
	});
	return assets;
}

//***	getfilenamesfromselect - Grabs all opt's texts from a select and returns them in an array	***//
exports.getfilenamesfromselect = function(selectid) {
	var assets = [];
	$('#' + selectid + ' option').each(function () {
		var txt = $(this).text();
		assets.push(txt);
	});
	return assets;
}

//*** updatearrayforsettings - Updates an array for storing to settings	***//
exports.updatearrayforsettings = function(settingarray, value) {
	var newarray = settingarray;
	//##	If the array contains the value, remove it	##//
	if (newarray.indexOf(value) > 0) {
		var index = newarray.indexOf(value);
		newarray.splice(index, 1);
	}
	//##	If array contains part of the value, remove it (special occassions)	##//
	else if (newarray.indexOf(parseInt(value, 10)) > 0) {
		var index = newarray.indexOf(parseInt(value, 10));
		newarray.splice(index, 1);
	}
	//##	Add item to the beginning of the array, so the last item entered is the first item selected on load	##//
	newarray.unshift(value);
	//##	Can't remember what this does... Maybe dedupes it as a catchall?	##//
	newarray = newarray.filter((el, i, arr) => arr.indexOf(el) === i);
	return newarray;
}

//***	cleanEmptyFoldersRecursively - Searches and deletes all empty folders within given directory	***//
exports.cleanEmptyFoldersRecursively = function(bundle) {
	get_deleteempty()(bundle).then(deleted => console.log(deleted)).catch(console.error);
}


//##	listitemsinpopup - Give it an array, and it'll produce a new window containing the contents of the array	##//
exports.listitemsinpopup = function(array) {
	const {
		BrowserWindow
	} = window.require('electron').remote;
	//const modalPath =  get_path().join(process.cwd(), 'popup.html');
	const modalPath = 'popup.html';
	//##	Create window. change size?	##//
	win = new BrowserWindow({
		title: "CD Toolbox"
		, show: false, //##	Hide till ready	##//
		backgroundColor: '#002b36', //##	Prevents white flash on load	##//
		width: 1000
		, height: 600
		, frame: false
		, icon: 'images/cdtoolboxicon.png'
		, parent: remote.getCurrentWindow()
		, modal: true
	});
	//##	Ensure the window releases all	##//
	win.on('close', () => {
		win = null
	});
	//##	Handle crashes	##//
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
	//##	Once the DOM is ready, show the window	##//
	win.on('ready-to-show', function () {
		win.show();
		win.focus();
	});
	//##	Handle window hangs	##//
	win.on('unresponsive', () => {
		const options = {
			type: 'info'
			, title: 'Renderer Process Hanging'
			, message: 'This process is hanging.'
			, buttons: ['Reload', 'Wait', 'Close']
		}
		dialog.showMessageBox(options, (index) => {
			if (index === 0) {
				win.reload()
			} else if (index === 1) {} else {
				win.close()
			}
		})
	})
	win.loadFile("popup.html");
	//##	Pass the array once the dom/scripts loaded	##//
	win.webContents.on('did-finish-load', () => {
		win.webContents.send('message', array);
	});
}

exports.isNullOrWhitespace = function(input) {
	return !input || !input.trim();
}

exports.logmetrics = function(tool, result, variable) {
	get_fs().appendFile('path-to\\Metrics\\Metrics.csv', "\n" + tool + ',' + result.time + ',' + '"' + variable + '"' + ',' + this.gettoday(), function (err) {
		if (err) throw err;
	});
}

exports.humanFileSize = function(size) {

	var i = Math.floor(Math.log(size) / Math.log(1024));
	return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

exports.gethumanfilesize = function(file)
{
	var variable = get_fs().statSync(file);
	variable = variable["size"];
	variable = this.humanFileSize(variable);
	return variable;
}

exports.isMyScriptLoaded = function(url) {
	if (!url) url = "http://xxx.co.uk/xxx/script.js";
	url = get_path().basename(url);
	var scripts = document.getElementsByTagName('script');
	for (var i = scripts.length; i--;) {
		try {
			var src = get_path().basename(scripts[i].src);
			if (src == url) return true;
		} catch (err) {

		}
	}
	return false;
}

exports.proposeatoast = function(title, content, timeout='32000', position='bottom left')
{
	var toast = new Toast({
			title: title,
			content: content,
			timeout: timeout,
			position: position,
			type: 'info',
			showProgress: true
	});
		
	return toast;
		//toast.show();
		//console.log(toast.getcontent());
		//toast.update('REEEEEEEEEEEEEEEEEEE');
		//toast.show();
		//toast.dismiss();
}
//***	gettoday - Get today's date in a MM-DD-YYYY format	***//
exports.gettoday = function() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    today = mm + '-' + dd + '-' + yyyy;
    return today;
}
exports.stringToBool = function(val) {
    return (val + '').toLowerCase() === 'true';
}

exports.longestcolumn = function(arr)
{
	var longest = arr.reduce(function (a, b) { return a.length > b.length ? a : b; });
	return longest.length;
}

exports.getfileserver = function(jobnum)
{
	var env = parseInt(get_settings().get('Main.Environment'), 10);
	if (env == 1 || env == 2)
	{
		return "chcdafsq1";
	}
	else if (env == 3)
	{
		var folder = getJobFolder(jobnum);
		folder = folder.substring(2);
		folder = folder.substring(0, folder.indexOf('\\'));
		console.log(folder);
		return folder
	}
	
}

exports.init = function() {
	let window = get_remote().getCurrentWindow();
	const minButton = document.getElementById('min-button')
		, maxButton = document.getElementById('max-button')
		, restoreButton = document.getElementById('restore-button')
		, closeButton = document.getElementById('close-button');
	minButton.addEventListener("click", event => {
		window = get_remote().getCurrentWindow();
		window.minimize();
	});
	maxButton.addEventListener("click", event => {
		window = get_remote().getCurrentWindow();
		window.maximize();
		toggleMaxRestoreButtons();
	});
	restoreButton.addEventListener("click", event => {
		window = get_remote().getCurrentWindow();
		window.unmaximize();
		toggleMaxRestoreButtons();
	});
	toggleMaxRestoreButtons();
	window.on('maximize', toggleMaxRestoreButtons);
	window.on('unmaximize', toggleMaxRestoreButtons);
	closeButton.addEventListener("click", event => {
		window = get_remote().getCurrentWindow();
		window.close();
	});

	function toggleMaxRestoreButtons() {
		window = get_remote().getCurrentWindow();
		if (window.isMaximized()) {
			maxButton.style.display = "none";
			restoreButton.style.display = "flex";
		} else {
			restoreButton.style.display = "none";
			maxButton.style.display = "flex";
		}
	}
}
exports.shownotifs = function() {
	try {cdtbtoast.dismiss()}catch(err){}
	cdtbtoast = proposeatoast("Notifications<label class='basiclabel' id='clearall' onclick='clearallnotifs()' style='cursor:pointer;'>Clear All</label>", get_settings().get('Main.Notifications'), '32000', 'top right');
	cdtbtoast.show();
}

exports.clearallnotifs = function() {
	$('.toast-content').html('<li id="defaultnotif">No New Notifications...</li>');
	get_settings().set('Main.Notifications', $('.toast-content').html());
}
