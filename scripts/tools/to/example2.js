//# sourceURL=preflighter.js
var preftoast;

//***	getPreflighterui houses the html for the tool	***//
exports.html = function() {
	var html = "";
	var inspireversion = '<label for="inspireversion" class="basiclabel" title="Inspire Version">Inspire Version*:</label><select id="inspireversion" class="dropdown" title="Select an Inspire Version"><option value="Version 10.1">v10.1</option><option value="Version 11.1" selected>v11.1</option><option value="Version 12.0">v12.0</option><option value="Version 12.1">v12.1</option></select><button type="reset" id="clearbutton" class="basicbutton" title="Revert entered items to default state">Clear</button><button type="submit" class="basicbutton" id="RunButton" name="RunButton" title="Preflight Data File(s)">Preflight</button><button type="button" class="basicbutton hidden" id="showlasterr" name="showlasterr" title="Show previous warnings last shown">Show Previous<br>Warnings</button>';
	var wfdinput = '<p><label for="wfdfilepath" class="basiclabel" title="WFD">WFD*:</label><input type="text" placeholder="Enter WFD File" name="wfdfilepath" id="wfdfilepath" class="inputfield" size="50"" title="Enter a WFD File"><button type="button" class="basicbrowsebutton" id="uploadTrigger-Matrix" name="uploadTrigger-Matrix" title="Browse for WFD file">...</button><input type="file" class="hidden" id="uploadFile-Matrix"/><label id="wfderror" class="inputerror"><br>Please enter a valid wfd file</label></p>';
	var wildcards = '<p><div id="boxforpreflight"><table id="wildcards"><tr><th><label class="basiclabel">Parameter</label></th><th class="values"><label class="basiclabel">Default Value</label></th></tr></table></div></p>';
	html = inspireversion + wfdinput + wildcards;
	return html;
}

//***	Preflighterui is the "onload" event for the tool	***//
//##	This sets up all the change/click/settings events	##//
exports.Events = function() {
	//##	Run preflight on data file	##//
	$("#RunButton").click(function () {
		event.preventDefault();
		try {preftoast.dismiss()}catch(err){}
		preftoast = get_cdtlb().proposeatoast("Seed Galley", "Grabbing form data...", '-1');
		if (get_settings().get('Main.OutlineProgress') == true){
			preftoast.show();
		}
		try {
			if (get_fs().existsSync(wfdfile) || wfdfile.toLowerCase().indexOf("vcs:") > -1) {
				get_cdtlb().updateProgress('Grabbed Form Data!', -1, preftoast);
				get_cdtlb().updateProgress("Preflighting datafile", -1, preftoast);
				logger.log('info', 'Preflighting datafile', {
					'Params': params
					, "WFD File": wfdfile
					, "Time Ran": Date().toLocaleString()
				});
				//##	Run Preflight	##//
				console.log('run something');
			} else {
				get_cdtlb().notify("Please select a valid wfd file", true);
			}
		} catch (err) {
			logger.log('error', "Failed to preflight the datafile " + err);
			get_cdtlb().notify("Failed to preflight the datafile " + err, true);
			console.error(err);
		}
	});
	//##	Resets form to onload	##//
	$("#clearbutton").click(function () {
		$("#wildcards").find("tr:gt(0)").remove();
		get_cdtlb().updateProgress("Ready...", 0);
	});
	//##	UI Functionality	##//
	//##	Browse Buttons	##//
	$("#uploadTrigger-Matrix").click(function () {
		$("#uploadFile-Matrix").click();
	});
	$("#uploadFile-Matrix").change(function () {
		var path = document.getElementById("uploadFile-Matrix").files[0].path;
		$("#wfdfilepath").val(path);
		$("#wfdfilepath").trigger('change');
	});
	//##	Drag and drop the WFD onto the file	##//
	document.ondragover = document.ondrop = (ev) => {
		ev.preventDefault();
	}
	document.body.ondrop = (ev) => {
			var files = ev.dataTransfer.files;
			try {
				$("#wfdfilepath").val(files[0].path);
				$("#wfdfilepath").trigger('change');
			} catch (error) {
				console.error(error);
			}
			ev.preventDefault();
		}
		//##	Choose which inspire version to use	##//
}

