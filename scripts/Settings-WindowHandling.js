//# sourceURL=Settings-WindowHandling.js
get_ipc().on('info', function (event, data) {
	try
	{
		logger.info('Closed toolbox at ' + Date().toLocaleString());
		winston.transport.on('finish', function (info) {
			logger.end();
		});
	}
	catch(err)
	{
		console.log(err);
	}
});
$(window).on('load', function () {
	//##	Only use this if we need to keep it global, also place on the other	##//
	//get_cdtlb().updateGMCSettings('Version 11.1');
	//##	Update CSS variables as per settings selected theme	##//
	document.documentElement.style.setProperty('--main-bg-image', get_settings().get('Main.DefaultBackgroundImage'));
	document.documentElement.style.setProperty('--main-bg-color', get_settings().get('Main.DefaultBackgroundColor'));
	document.documentElement.style.setProperty('--main-bg-accent-color', get_settings().get('Main.DefaultAccentColor'));
	document.documentElement.style.setProperty('--main-txt-color', get_settings().get('Main.DefaultTextColor'));
	//##	Set up titlebar functions (min,max,close,etc.)	##//
	//##	Reset settings to default	##//
	$("#ResetSettings").click(function () {
		//##	Completely wipe settings	##//
		resetsettings();
	});
	//##	Set inspire settings	##//
	/*$("#GMCSetting").change(function () {
		if ($("#GMCSetting").val() == "Version 12.1") {
			$("#GMCPort").text("12101");
			$("#GMCServer").text("chcdspl1");
			$("#GMCServerFile").text("\\\\chgmc1\\Inspire Designers\\GMC\\Inspire Designer 12.1 64bit\\InspirePSCLI.exe");
		}
		else if ($("#GMCSetting").val() == "Version 12.0") {
			$("#GMCPort").text("12001");
			$("#GMCServer").text("chcdspl1");
			$("#GMCServerFile").text("\\\\chgmc1\\Inspire Designers\\GMC\\Inspire Designer 12.0 64bit\\InspirePSCLI.exe");
		}
		else if ($("#GMCSetting").val() == "Version 11.1") {
			$("#GMCPort").text("11101");
			$("#GMCServer").text("chcdspl1");
			$("#GMCServerFile").text("\\\\chgmc1\\Inspire Designers\\GMC\\Inspire Designer 11.1 64bit\\InspirePSCLI.exe");
		}
		else if ($("#GMCSetting").val() == "Version 10.1") {
			$("#GMCPort").text("10101");
			$("#GMCServer").text("chcdspl1");
			$("#GMCServerFile").text("\\\\chgmc1\\Inspire Designers\\GMC\\Inspire Designer 10.1 64bit\\InspirePSCLI.exe");
		}
	});*/
	if (get_cdtlb().isMyScriptLoaded("scripts/tools/libraries/Logger.js") == true) {} else {
		$("head").append('<script src="scripts/tools/libraries/Logger.js"></script>');
	}
	$("[name=Save]").click(function () {
		get_settings().set('Main.DefaultBackgroundImage', document.documentElement.style.getPropertyValue('--main-bg-image'));
		get_settings().set('Main.DefaultBackgroundColor', document.documentElement.style.getPropertyValue('--main-bg-color'));
		get_settings().set('Main.DefaultTextColor', document.documentElement.style.getPropertyValue('--main-txt-color'));
		get_settings().set('Main.DefaultAccentColor', document.documentElement.style.getPropertyValue('--main-bg-accent-color'));
		get_settings().set('Main.SelectedTheme', $('#themeselection').val());
		get_settings().set('Main.UseNotifications', $('#usenotification').prop("checked"));
		get_settings().set('Main.Debugmode', $('#DebugMode').prop("checked"));
		get_settings().set('Main.ShowFilePath', $('#showfilepath').prop("checked"));
		get_settings().set('Main.OutlineProgress', $("#OutlineProgress").prop('checked'));
		//get_settings().set('GMC.Port', $("#GMCPort").text());
		//get_settings().set('GMC.Server', $("#GMCServer").text());
		//get_settings().set('GMC.Serverfile', $("#GMCServerFile").text());
		//get_settings().set('GMC.Version', $("#GMCSetting option:selected").text());
		get_settings().set('Main.Environment', $("#FoundationServer").val());
		get_settings().set('IWCO_Naehas_WYSIWYG.UseHtmlProofer', $('#usetextarea').prop("checked"));
		logger.log('info', 'Updated Settings', {
			'Default Background Image': get_settings().get('Main.DefaultBackgroundImage')
			, 'Default Background Color': get_settings().get('Main.DefaultBackgroundColor')
			, "Text Color": get_settings().get('Main.DefaultTextColor')
			, "Accent Color": get_settings().get('Main.DefaultAccentColor')
			, "Theme": get_settings().get('Main.SelectedTheme')
			, "GMC Version": get_settings().get('GMC.Version')
			, "Time Ran": Date().toLocaleString()
		});
		//##	Say the form has not been changed	##//
		$("form").data("changed", false);
		get_cdtlb().notify("Updated Settings");
	});
	//##	Tab selection	##//
	$('ul.tabs li').click(function () {
		var tab_id = $(this).attr('data-tab');
		$('ul.tabs li').removeClass('current');
		$('.tab-content').removeClass('current');
		$(this).addClass('current');
		$("#" + tab_id).addClass('current');
	});
	//##	Theme selection	##//
	$('#themeselection').change(function () {
		var selection = $('#themeselection').val();
		if (selection == 'Forest') {
			document.documentElement.style.setProperty('--main-bg-image', "url('../images/forestbridge.jpg')");
			document.documentElement.style.setProperty('--main-bg-color', '#2f4f4f');
			document.documentElement.style.setProperty('--main-bg-accent-color', '#2f4f4f');
			document.documentElement.style.setProperty('--main-txt-color', '#fff');
			$("#Theme-Area").html("");
		} else if (selection == 'Meringue') { //##	banana cream	##//
			document.documentElement.style.setProperty('--main-bg-image', "url('../images/wp-workspace.jpg')");
			document.documentElement.style.setProperty('--main-bg-color', '#fffdd0');
			document.documentElement.style.setProperty('--main-bg-accent-color', '#fffdd0');
			document.documentElement.style.setProperty('--main-txt-color', '#000');
			$("#Theme-Area").html("");
		} else if (selection == 'Inspo') {
			document.documentElement.style.setProperty('--main-bg-image', "url('../images/inspo-morroco.jpg')");
			document.documentElement.style.setProperty('--main-bg-color', '#8A5776');
			document.documentElement.style.setProperty('--main-bg-accent-color', '#8A5776');
			document.documentElement.style.setProperty('--main-txt-color', '#fff');
			$("#Theme-Area").html("");
		} else if (selection == 'Plain') {
			document.documentElement.style.setProperty('--main-bg-image', "none");
			document.documentElement.style.setProperty('--main-bg-color', '#FFF');
			document.documentElement.style.setProperty('--main-bg-accent-color', '#cccccc');
			document.documentElement.style.setProperty('--main-txt-color', '#000');
			$("#Theme-Area").html("");
		} else if (selection == 'Dark') {
			document.documentElement.style.setProperty('--main-bg-image', "none");
			document.documentElement.style.setProperty('--main-bg-color', '#000');
			document.documentElement.style.setProperty('--main-bg-accent-color', '#808080');
			document.documentElement.style.setProperty('--main-txt-color', '#fff');
			$("#Theme-Area").html("");
		} else if (selection == 'IWCO') {
			document.documentElement.style.setProperty('--main-bg-image', "none");
			document.documentElement.style.setProperty('--main-bg-color', '#a1af6c');
			document.documentElement.style.setProperty('--main-bg-accent-color', '#8098aa');
			document.documentElement.style.setProperty('--main-txt-color', '#000');
			$("#Theme-Area").html("");
		}
		//##	Custom theming	##//
		else if (selection == 'Custom') {
			var Header = '<p><label for="header" class="basiclabel">Enter any html compliant color (rgb/hex/etc.):</label>';
			var BGColorselect = '<p><label for="bgcolor" class="basiclabel">Background color:</label><input type="text" id="bgcolor" class="smallinputfield" name="bgcolor" onchange="updateui()" value="' + document.documentElement.style.getPropertyValue('--main-bg-color') + '"></p>';
			var TxtColorselect = '<p><label for="txtcolor" class="basiclabel">Text Color:</label><input type="text" id="txtcolor" class="smallinputfield" name="txtcolor" onchange="updateui()" value="' + document.documentElement.style.getPropertyValue('--main-txt-color') + '"></p>';
			var bgimagenote = '<p><label for="bgimagenote" class="basiclabel">When using an image, please use the following format: url("placeurlhere")</label></p>';
			var bgimage = "<p><label for='bgimage' class='basiclabel'>Background Image:</label><input type='text' id='bgimage' class='smallinputfield' name='bgimage' onchange='updateui()' value='" + document.documentElement.style.getPropertyValue('--main-bg-image') + "'></p>";
			var Colorselect = '<p><label for="accentcolor" class="basiclabel">Accent Color:</label><input type="text" id="accentcolor" class="smallinputfield" onchange="updateui()" name="accentcolor" value="' + document.documentElement.style.getPropertyValue('--main-bg-accent-color') + '"></p>';
			html = Header + BGColorselect + TxtColorselect + bgimagenote + bgimage + Colorselect;
			$("#Theme-Area").html(html);
		}
	});
	//##	Open folder containing logs	##//
	$("#OpenLogs").click(function () {
		get_cdtlb().openpathinexploror('\\\\chcd1\\chcd1_data\\ClientTemplates\\CDToolBox Log\\Electron-CDToolbox\\');
	});
	//##	Persistent notifications	##//
	$("#allnotifications").html(get_settings().get('Main.Notifications'));
	var count = $('ul#allnotifications li').length;
	if (count == 1) {} else {
		//##	Add notif badge	##//
		$("#notifications").attr("data-badge", count);
	}
	//##	Delete single notification	##//
	$(document).on('click', "[name='deletenotif']", function () {
		try {
			$(this).parent().slideUp("slow", function () {
				$(this).remove();
				var toastcontent = cdtbtoast.getcontent();

				if (toastcontent.indexOf('span') > -1) {
				} else {
					$('.toast-content').html('<li id="defaultnotif">No New Notifications...</li>');
				}
				//##	Set the notifications in settings to be called back later	##//
				get_settings().set('Main.Notifications', $('.toast-content').html());
			});

		} catch (err) {
			console.log(err);
		}

	});
	//##	Clear all notifications	##//
	
	
	//##	Set forms as defined to settings	##//
	$('#themeselection').val(get_settings().get('Main.SelectedTheme'));
	$('#themeselection').trigger("change");
	$('#GMCSetting').val(get_settings().get('GMC.Version'));
	$('#FoundationServer').val(get_settings().get('Main.Environment'));
	$('#GMCSetting').trigger("change");
	$('#DebugMode').prop("checked", get_settings().get('Main.Debugmode'));
	$('#usenotification').prop("checked", get_settings().get('Main.UseNotifications'));
	$('#usetextarea').prop("checked", get_settings().get('IWCO_Naehas_WYSIWYG.UseHtmlProofer'));
	$('#showfilepath').prop("checked", get_settings().get('Main.ShowFilePath'));
	$('#OutlineProgress').prop('checked', get_settings().get('Main.OutlineProgress'));
	$('#emailAD').text(get_settings().get('Main.Email'));
	$('#userAD').text(get_settings().get('Main.User'));
	//$('#tab-admin').hide();
	$("#GMCSettingArea").hide();
	$("#GMCServerFileArea").hide();
	$("#GMCPortArea").hide();
	//##	Hide/show based on admin settings	##//
	if (get_settings().get('Main.isinPTA') == true) {
		$('#tab-admin').show();
		$('#tab-monitor').show();
		$("#tab-analytics").show();
		grabaveragmetrics();
		if (get_cdtlb().isMyScriptLoaded("scripts/tools/libraries/igniteapicall.js") == true) {} else {
			$("head").append('<script src="scripts/tools/libraries/igniteapicall.js"></script>');
		}
		//getcurrentignitejobs();
		getallignitejobstatusfilltable();
	} else {
		$('#tab-admin').hide();
		$('#tab-monitor').hide();
		$("#tab-analytics").hide();
	}
	if (get_settings().get('Main.Debugmode') == true) {
		//##	This shows admin only items	##//
	} else {
		//##	this hides admin only items	##//
		$('option[name=DebugOnly]').hide();
	}
	//##	If user tries to leave after changing something without saving, let them know	##//
	$("form").change(function () {
		$("form").data("changed", true);
	});
	$("a").click(function () {
		if ($("form").data("changed") == true) {
			//##	Settings saved, confirm before continuing	##//
			event.preventDefault();
			if (get_cdtlb().prompt("Leave without saving settings?") == true) {
				try {
					//##	Redirect back to cd toolbox	##//
					window.location.href = "index.html";
				} catch (err) {
					console.log(err);
				}
			} else {

			}
		}
	});

	$("#getcurrusers").click(function () {
		var latestlogs = getlatestuserlogs();
		var openusers = getopenusers(latestlogs);
		filloutcurrentusers(openusers);
		$("#onlineusers").prepend('<div id="inlineprogress"></div>');
		setTimeout(function(){ $("#inlineprogress").remove(); }, 800);
	});
	var latestlogs = getlatestuserlogs();
	var openusers = getopenusers(latestlogs);
	filloutcurrentusers(openusers);
	get_cdtlb().init();
	
	if (get_cdtlb().isMyScriptLoaded("scripts/tools/libraries/toast.js") == true) {} else {
		$("head").append('<link href="css/toast.css" rel="stylesheet">');
		$("head").append('<script src="scripts/tools/libraries/toast.js"></script>');
	}
	$("#selprocess").change(function(){
		var metrics = JSON.parse($(this).find(":selected").val());
    	$("#avgtime").text(metrics.AverageTime);
    	$("#totalruns").text(metrics.TimesRan);
    	$("#runsthismonth").text(metrics.MonthRuns);
	});
	$("#getcurrjobstatus").click(function () {
		getallignitejobstatusfilltable();
		$("#jobstatuses").before('<div id="inlineprogress-table"></div>');
		setTimeout(function(){ $("#inlineprogress-table").remove(); }, 3000);
	});
	$("#getcurrmetrics").click(function () {
		grabaveragmetrics();
		$("#metrictable").prepend('<div id="inlineprogress-table-quick"></div>');
		setTimeout(function(){ $("#inlineprogress-table-quick").remove(); }, 1000);
	});
	$("#refreshall").click(function () {
		$("#getcurrusers").click();
		$("#getcurrmetrics").click();
		$("#getcurrjobstatus").click();
	});
	$("#tab-other").click();
	setTimeout(function () {
		$("#fullloader").fadeOut('slow');
		$("#mainarea").fadeIn('slow');
		$("head").append('<link rel="prerender" href="index.html">');
	}, 500);
});

function filloutcurrentusers(currentusers) {
	$("#onlineusers").html('');
	for (var c = 0; c < currentusers.length; c++) {
		$("#onlineusers").append('<li>' + currentusers[c] + '</li>');
	}
}

function gettodayslogs() {
	try
	{
	var todayslogs = get_cdtlb().findFilesInDirTopLayer('\\\\chcd1\\chcd1_data\\ClientTemplates\\CDToolBox Log\\Electron-CDToolbox\\', get_cdtlb().gettoday());
	var openusers = [];
	for (var i = 0; i < todayslogs.length; i++) {
		var contents = get_fs().readFileSync(todayslogs[i]).toString();
		contents = contents.split("\r\n");
		var lastopen = -1;
		var lastclose = -1;
		for (var l = 0; l < contents.length; l++) {
			if (contents[l].indexOf("Loaded toolbox at") > -1) {
				lastopen = l;
			} else if (contents[l].indexOf("Closed toolbox at") > -1) {
				lastclose = l;
			}
		}
		if (lastopen > lastclose) {
			var user = todayslogs[i];
			user = get_path().basename(user);
			user = user.substring(0, user.indexOf("_"));
			openusers.push(user);
		}
	}
	return openusers;
	}
	catch (err)
	{
		console.log(err);
	}
}

function getopenusers(todayslogs) {
	var openusers = [];
	for (var i = 0; i < todayslogs.length; i++) {
		try
		{
		var contents = get_fs().readFileSync(todayslogs[i]).toString();
		contents = contents.split("\r\n");
		var lastopen = -1;
		var lastclose = -1;
		for (var l = 0; l < contents.length; l++) {
			if (contents[l].indexOf("Loaded toolbox at") > -1) {
				lastopen = l;
			} else if (contents[l].indexOf("Closed toolbox at") > -1) {
				lastclose = l;
			}
		}
		if (lastopen > lastclose) {
			var user = todayslogs[i];
			user = get_path().basename(user);
			user = user.substring(0, user.indexOf("_"));
			openusers.push(user);
		}
	}
	catch (err)
	{
		console.log(err);
	}
	}
	return openusers;
	
	
}

function getlatestuserlogs()
{
	try
	{
		var latestlogs = [];
	var users = getallusers();
	for (var u = 0; u < users.length; u++)
	{
		var userslogs = get_cdtlb().findFilesInDirTopLayer('\\\\chcd1\\chcd1_data\\ClientTemplates\\CDToolBox Log\\Electron-CDToolbox\\', users[u]);
		var highestdate = null;
		for (var l = 0; l < userslogs.length; l++)
		{
			if (latestlogs.length == u + 1)
			{
				
			}
			else
			{
				latestlogs.push(userslogs[l]);
			}
			var date = get_path().basename(userslogs[l]);
			date = date.substring(date.indexOf('_') + 1);
			date = date.substring(0, date.indexOf('.'));
			if (highestdate == null)
			{
				highestdate = date;
			}
			else if (dates.compare(date, highestdate) == 1)
			{
				highestdate = date;
				latestlogs[u] = userslogs[l];
			}
			//console.log('date: ' + date + ' hdate: ' + highestdate + ' result: ' + dates.compare(date, highestdate));
		}
	}
	return latestlogs;
	}
	catch(err)
	{
		console.log(err);
	}
}

function getallusers()
{
	var todayslogs = get_cdtlb().findFilesInDirTopLayer('\\\\chcd1\\chcd1_data\\ClientTemplates\\CDToolBox Log\\Electron-CDToolbox\\', '.log');
	var allusers = [];
	for (var t = 0; t< todayslogs.length; t++)
	{
		var username = get_path().basename(todayslogs[t]);
		username = username.substring(0, username.indexOf('_'));
		if (allusers.toString().indexOf(username) > -1)
		{
			
		}
		else
		{
			allusers.push(username);
		}
	}
	return allusers;
}

//##	updateui - Update css variables based on selected theme	##//
function updateui() {
	document.documentElement.style.setProperty('--main-bg-image', $("#bgimage").val());
	document.documentElement.style.setProperty('--main-bg-color', $("#bgcolor").val());
	document.documentElement.style.setProperty('--main-bg-accent-color', $("#accentcolor").val());
	document.documentElement.style.setProperty('--main-txt-color', $("#txtcolor").val());
}

function shownotifs() {
	try {cdtbtoast.dismiss()}catch(err){}
	cdtbtoast = get_cdtlb().proposeatoast("Notifications<label class='basiclabel' id='clearall' onclick='clearallnotifs()' style='cursor:pointer;'>Clear All</label>", get_settings().get('Main.Notifications'), '32000', 'top right');
	cdtbtoast.show();
}

//##	Title bar functions (min,max,close,etc.)	##//

function resetsettings() {
	if (get_cdtlb().prompt("Reset settings?") == true) {
		get_settings().deleteAll();
		get_settings().set('IWCO_Naehas_BundleExtractor', {
			DefaultSource: ['\\\\chftpland2\\ftproot\\ccnaehas\\']
			, DefaultDestination: ['\\\\chcd1\\CHCD1_Data\\Naehas\\Comcast\\Bundles\\Production\\2018']
			, LastRanBundles: [497555, 12345], //##	Just to have something there	##//
			ValidateAssets: true
			, DeleteEmptyFolders: false
		});
		get_settings().set('IWCO_Naehas_AssetValidation', {
			CreateAssetReport: false
			, CheckAssetSize: false
			, CheckFileName: false
			, LastRanFolders: ["None"]
			, DefaultBgColor: "#FFFFFF"
			, BookmarkByFile: true
			, ShowBorder: true
			, WFD: "\\\\chcd1\\CHCD1_Data\\Naehas\\Applications\\AssetProof2\\bin\\AssetProof2.wfd"
		});
		get_settings().set('IWCO_Naehas_EmailGenerator', {
			DefaultSource: ['\\\\chcd1\\CHCD1_Data\\Naehas\\Applications\\EmailTemplateGenerator\\Templates\\EML']
			, Owner: "" //##	Entered by user	##//
		});
		get_settings().set('IWCO_CD_JTA', {
			Role: "slr"
		});
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
		get_settings().set('IWCO_Naehas_WYSIWYG', {
			UseHtmlProofer: false
		});
		get_settings().set('GMC', {
			Version: 'Version 11.1'
			, Port: '11101'
			, Server: 'chcdspl1'
			, Serverfile: '\\\\chgmc1\\Inspire Designers\\GMC\\Inspire Designer 11.1 64bit\\InspirePSCLI.exe'
		});
		get_settings().set('Main.Email', "Reset");
		get_settings().set('Main.Email', "User");
		logger.log('info', "Settings Reset");
		get_cdtlb().notify("Settings Reset");
	}
}
function clearallnotifs() {
	$('.toast-content').html('<li id="defaultnotif">No New Notifications...</li>');
	get_settings().set('Main.Notifications', $('.toast-content').html());
}

function grabaveragmetrics()
{
	try
	{
		$("#selprocess").find('option').not(':first').remove();
		var finalmetrics = [];
		var currmonth = get_cdtlb().gettoday().substring(0,2);
		var metrics = get_fs().readFileSync('\\\\chcd1\\chcd1_data\\ClientTemplates\\CDToolBox Log\\Electron-CDToolbox\\Metrics\\Metrics.csv').toString();
		metrics = metrics.split('\n');
		for (var m = 1; m < metrics.length; m++)
		{
			try
			{
			var rowcontents = metrics[m].split(',');
			var tool = rowcontents[0];
			var timeinsec = rowcontents[1];
			var metric = rowcontents[2];
			var date = rowcontents[3];
			var mr = 0;
			if (date.substring(0,2) == currmonth)
			{
				mr = 1;
			}
			var index = ifexistsinarray2(finalmetrics, tool);
			if (index == -1)
			{
				var currmetric = {
					Tool: tool,
					AverageTime: [timeinsec],
					Metric: metric,
					TimesRan: 1,
					MonthRuns: mr
				}
				finalmetrics.push(currmetric);
				metrics[m] = rowcontents;
			}
			else
			{
				finalmetrics[index].AverageTime.push(timeinsec);
				finalmetrics[index].TimesRan = finalmetrics[index].TimesRan + 1;
				if (date.substring(0,2) == currmonth)
				{
					finalmetrics[index].MonthRuns = finalmetrics[index].MonthRuns + 1;
				}
			}
			}
			catch (err)
			{}
		}
		for (var f = 0; f < finalmetrics.length; f++)
		{
			var arraytoavg = finalmetrics[f].AverageTime;
			var avg =  findaverageofarray(arraytoavg);
			finalmetrics[f].AverageTime = avg;
		}
		filloutprocessdropdown(finalmetrics);
		makegraphs(finalmetrics);
		}
		catch (err)
		{
			console.log(err);
		}
}

function makegraphs(metrics)
{
	
}
function filloutprocessdropdown(metrics)
{
	for (var m = 0; m < metrics.length; m++)
	{
		$("#selprocess").append("<option value='" + JSON.stringify(metrics[m]) + "'>" + metrics[m].Tool + '</option>');
	}
	
}

function ifexistsinarray2(tool, tocompare)
{
	for (var t = 0; t < tool.length; t++)
	{
		if (tool[t].Tool == tocompare)
		{
			return t;
		}
	}
	return -1;
}

function findaverageofarray(array)
{
	var total = 0;
	for(var i = 0; i < array.length; i++) {
    	total += parseFloat(array[i], 10);
	}
	var avg = total / array.length;
	return Number((avg).toFixed(2));
}

function getcurrentignitejobs()
{
	$("#jobstatuses").html('<tr><th>Server</th><th><label>Job ID</label></th><th><label>Job Status</label></th><th><label>Description</label></th></tr>');
	var jobs = getallignitejobstatus();
	for (var j = 0; j < jobs.length; j++)
	{
		var jobid = jobs[j].Settings[0].Value;
		var jobstatus = jobs[j].Settings[1].Value;
		var Server = jobs[j].Settings[5].Value;
		var Description = jobs[j].Settings[11].Value;
		$("#jobstatuses").append('<tr><td><label class="basiclabel" name="server" title="Server Ignite was ran on">' + Server +'</label></td><td><label class="basiclabel" name="JobID" title="Job ID">' + jobid + '</label></td><td><label class="basiclabel" name="JobStatus" title="Job Status">' + jobstatus + '</label></td><td><label name="Description" title="Job Description">' + Description + '</label></td></tr>');
	}
}

// Source: http://stackoverflow.com/questions/497790
var dates = {
    convert:function(d) {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp) 
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return (
            d.constructor === Date ? d :
            d.constructor === Array ? new Date(d[0],d[1],d[2]) :
            d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
            typeof d === "object" ? new Date(d.year,d.month,d.date) :
            NaN
        );
    },
    compare:function(a,b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(a=this.convert(a).valueOf()) &&
            isFinite(b=this.convert(b).valueOf()) ?
            (a>b)-(a<b) :
            NaN
        );
    },
    inRange:function(d,start,end) {
        // Checks if date in d is between dates in start and end.
        // Returns a boolean or NaN:
        //    true  : if d is between start and end (inclusive)
        //    false : if d is before start or after end
        //    NaN   : if one or more of the dates is illegal.
        // NOTE: The code inside isFinite does an assignment (=).
       return (
            isFinite(d=this.convert(d).valueOf()) &&
            isFinite(start=this.convert(start).valueOf()) &&
            isFinite(end=this.convert(end).valueOf()) ?
            start <= d && d <= end :
            NaN
        );
    }
}