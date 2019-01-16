# Electron-Toolbox
Electron Boilerplate built for a plug-in inspired toolbox

# Features
Custom Windows-10 inspired Toolbar
Logging - including uncaught exception logging
Dynamic plugin management - Add/remove plugins by updating a json file
Themes - Create/edit/select your own themes!
Debug mode - a mode for admins/devs to hide tools/items not ready for client 
Notifications - notifications when items are complete, including a notification center logging all notifications
Settings - User centered settings
Monitor Page - Find out who is in the tool
Analytics - Find out how often a tool is ran

# Installation 
Download source code using your preferred method (git, download the zip, wget, curl, etc...)
Open the folder containing the source and perform 
  npm install

# Customization
Open the html files and update as needed. This example uses "CD Toolbox" as it's name, feel free to update as needed. You can replace the cdtoolbox.png/.ico files with your own logo.

# Adding a tool (plugin)
To add a tool to the Electron-Toolbox, you only need to add the information to the tools.json file. Example below:

{
		"name": "Example 1",
		"title": "This will be in the title bar",
		"location": "tools/to/script.js",
		"category": "enter the category you want the tool to appear in",
		"hidden": false, //if true, only shown to those who have "debug mode" on
		"description": "when someone hovers over the tool this is what they'll see"
}

The js file noted above needs 2 functions for the tool to work correctly.

exports.html = function() { 
  //this should return a full string containing all of the html needed for the tool
}
exports.Events = function() { 
  //this should contain all the event listeners for the tool
}
