//Require fixer 
let settings;
let ipc;
let remote;
let fs;
let path;
let child_process;
let uuid;
let nconsole;
let tools;
let cdtlb;
let jquery;
function get_path()
{
	if (path == null)
	{
		return path = window.require('path');
	}
	else
	{
		return path;
	}
	//return path || path = window.require('path');
}
function get_edge()
{
	if (edge == null)
	{
		return edge = window.require("electron-edge-js");
	}
	else
	{
		return edge;
	}
}
function get_settings()
{
	if (settings == null)
	{
		settings = window.require("electron-settings");
		if (get_settings().has('Main.OutlineProgress'))
		{
			
		}
		else
		{
			setsettings();
		}
		return settings;
	}
	else
	{
		return settings;
	}
}

function get_jquery()
{
	if (jquery == null)
	{
		return jquery = window.require("jquery");
	}
	else
	{
		return jquery;
	}
}
function get_username()
{
	if (username == null)
	{
		return username = window.require("username");
	}
	else
	{
		return username;
	}
}
function get_uuid()
{
	if (uuid == null)
	{
		return uuid = window.require('uuid/v1');
	}
	else
	{
		return uuid;
	}
}
function get_winston()
{
	if (winston == null)
	{
		return winston = window.require("winston");
	}
	else
	{
		return winston;
	}
}

function get_dialog()
{
	if (dialog == null)
	{
		return {dialog} = window.require('electron').remote;
	}
	else
	{
		return {dialog};
	}
}
function get_fs()
{
	if (fs == null)
	{
		return fs = window.require('fs');
	}
	else 
	{
		return fs;
	}
}
function get_path()
{
	if (path == null)
	{
		return path = window.require('path');
	}
	else
	{
		return path;
	}
}
function get_remote()
{
	if (remote == null)
	{
		return remote = window.require('electron').remote;
	}
	else
	{
		return remote;
	}
}
function get_nodeConsole()
{
	if (nconsole == null)
	{
		return nconsole = window.require('console');
	}
	else
	{
		return nodeConsole;
	}
}
function get_myConsole()
{
	if (myConsole == null)
	{
		return myConsole = new nodeConsole.Console(process.stdout, process.stderr);
	}
	else
	{
		return myConsole;
	}
}
function get_ipc()
{
	if (ipc == null)
	{
		return ipc = window.require('electron').ipcRenderer;
	}
	else
	{
		return ipc;
	}
}
function get_childprocess()
{
	if (child_process == null)
	{
		return child_process = window.require('child_process');
	}
	else
	{
		return child_process;
	}
}
function get_tools()
{
	if (tools == null)
	{
		return tools = window.require('./scripts/tools.json').tools;
	}
	else
	{
		return tools;
	}
}
function get_cdtlb()
{
	if (cdtlb == null)
	{
		return cdtlb = window.require('./scripts/tools/libraries/CDToolboxLib2.js');
	}
	else
	{
		return cdtlb;
	}
}
function setsettings()
{
	get_settings().deleteAll();
		
		get_settings().set('Main', {
			DefaultTab: '#tab-cd'
			, DefaultTextColor: '#000'
			, DefaultBackgroundColor: '#fff'
			, DefaultBackgroundImage: "none"
			, DefaultAccentColor: '#cccccc'
			, SelectedTheme: 'Plain'
			, Debugmode: false
			, UseNotifications: true
			, Environment: 3 //##	Change to 3 when released to prod	##//
			, Notifications: '<li id="defaultnotif">No New Notifications...</li>'
			, ShowFilePath: false
			, OutlineProgress: false
			, isinPTA: false
		});
}