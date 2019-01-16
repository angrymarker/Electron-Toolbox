get_ipc().on('info', function (event, data) {
	try
	{
		logger.info('Closed toolbox at ' + Date().toLocaleString());
		const transport = new winston.transports.Console();
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
	try
	{
	createtabs();
	populateDropDowns();
	updatecss();
	get_cdtlb().init();
	setupnotifs();
	uitweaks();
	}
	catch (err)
	{
		console.log(err);
	}
	//ipc.send("createcontext", settings.get('Main.Debugmode'));
	
});

function addchangelistenertodropdowns()
{
	var dropdowns = ['cd', 'platform', 'other'];
	for (var d = 0; d < dropdowns.length; d++)
	{
		var dd = getdropdown(dropdowns[d]);
		dd.change(function() {
			try
			{
				$("form").find("*").each(function () {
					$(this).off("click");
				});
				var tool = window.require($(this).val());
				var txt = $(this).find('option:selected').text()
				var toolarea = gethtmlarea(txt);
				toolarea.html(tool.html());
				tool.Events();
				tool = null;
				tool = gettoolinfo(txt);
				$("#title").text(tool.title);
				get_cdtlb().updateProgress("Ready...", 0);
				logger.info('Opened ' + txt + ' at ' + Date().toLocaleString());
			}
			catch (err)
			{
				console.log(err);
				get_cdtlb().notify("Failed to open " + txt + " " + err, true);
				logger.error("Failed to open " + txt + " " + err);
			}
		})
	}
}
function gettoolinfo(name)
{
	var tools = get_tools();
	for (var t = 0; t < tools.length; t++)
	{
		if (tools[t].name == name)
		{
			return tools[t];
		}
	}
}
async function populateDropDowns()
{
	var tools = get_tools();
	for (var t = 0; t < tools.length; t++)
	{
		var dd = getdropdown(tools[t].category);
		if (tools[t].hidden == true)
		{
			dd.append('<option title="' + tools[t].description +'" value="./' + tools[t].location + '" name="DebugOnly">' + tools[t].name + '</option>');
		}
		else
		{
			dd.append('<option title="' + tools[t].description +'" value="./' + tools[t].location + '">' + tools[t].name + '</option>');
		}
	}
	addchangelistenertodropdowns();
}

function getdropdown(category)
{
	var dd;
	if (category == 'cd')
	{
		dd = $("#applicationdropdown-CD");
	}
	else if (category == 'platform')
	{
		dd = $("#applicationdropdown-Naehas");
	}
	else if (category == 'other')
	{
		dd = $("#applicationdropdown-Other");
	}
	return dd;
}

function gethtmlarea(name)
{
	var tool = gettoolinfo(name);
	var category = tool.category;
	var dd;
	if (category == 'cd')
	{
		dd = $("#CD-Tool-Area");
	}
	else if (category == 'platform')
	{
		dd = $("#Naehas-Tool-Area");
	}
	else if (category == 'other')
	{
		dd = $("#Other-Tool-Area");
	}
	return dd;
}

async function createtabs()
{
	//##	When a tab is selected, switch to it	##//
	$('ul.tabs li').click(function () {
		var tab_id = $(this).attr('data-tab');
		$('ul.tabs li').removeClass('current');
		$('.tab-content').removeClass('current');
		$(this).addClass('current');
		$("#" + tab_id).addClass('current');
		var idattr = "#" + $(this).attr('id');
		var log = 'Updated Default Tab to  ' + idattr + ' at ' + Date().toLocaleString();
		logger.info(log);
		//##	Save last selected tab	##//
		get_settings().set('Main.DefaultTab', idattr);
		$("#Other-Tool-Area").html("");
		$("#Naehas-Tool-Area").html("");
		$("#CD-Tool-Area").html("");
		$("#applicationdropdown-CD").val('');
		$("#applicationdropdown-Naehas").val('');
		$("#applicationdropdown-Other").val('');
		get_cdtlb().updateProgress("Ready...", 0);
	});
}

async function updatecss()
{
	document.documentElement.style.setProperty('--main-bg-image', get_settings().get('Main.DefaultBackgroundImage'));
	document.documentElement.style.setProperty('--main-bg-color', get_settings().get('Main.DefaultBackgroundColor'));
	document.documentElement.style.setProperty('--main-bg-accent-color', get_settings().get('Main.DefaultAccentColor'));
	document.documentElement.style.setProperty('--main-txt-color', get_settings().get('Main.DefaultTextColor'));
}


async function setupnotifs()
{
	$(document).on('click', "[name='deletenotif']", function () {
		try {
			$(this).parent().slideUp("slow", function () {
				$(this).remove();
				var toastcontent = cdtbtoast.getcontent();

				if (toastcontent.indexOf('span') > -1) {
					console.log(toastcontent);
				} else {
					$('.toast-content').html('<li id="defaultnotif">No New Notifications...</li>');
				}
				//##	Set the notifications in settings to be called back later	##//
				console.log($('.toast-content').html());
				get_settings().set('Main.Notifications', $('.toast-content').html());
			});

		} catch (err) {
			console.log(err);
		}

	});
	$("#clearall").click(function () {
		$("#allnotifications").empty();
		var notif = '<li id="defaultnotif">No New Notifications...</li>';
		$("#allnotifications").prepend(notif);
		//##	add the default notification	##//
		get_settings().set('Main.Notifications', $("#allnotifications").html());
	});
	var prevnotif = get_settings().get('Main.Notifications')
	$("#allnotifications").html(prevnotif);
}

function uitweaks()
{
	$("#tab-cd").click(function () {
		$('#applicationdropdown-CD').focus();
		$("#title").text("CD Toolbox");
	});
	$("#tab-naehas").click(function () {
		$('#applicationdropdown-Naehas').focus();
		$("#title").text("CD Toolbox");
	});
	$("#tab-other").click(function () {
		$('#applicationdropdown-Other').focus();
		$("#title").text("CD Toolbox");
	});
	if (get_cdtlb().isMyScriptLoaded("scripts/tools/libraries/Logger.js") == true) {} else {
		$("head").append('<script src="scripts/tools/libraries/Logger.js"></script>');
	}
	if (get_cdtlb().isMyScriptLoaded("scripts/tools/libraries/toast.js") == true) {} else {
		$("head").append('<link href="css/toast.css" rel="stylesheet">');
		$("head").append('<script src="scripts/tools/libraries/toast.js"></script>');
	}
	if (get_cdtlb().isMyScriptLoaded("scripts/tools/libraries/jquery.modal.min.js") == true) {} else {
        $("head").append('<script src="scripts/tools/libraries/jquery.modal.min.js"></script>');
        $("head").append('<link href="css/jquery.modal.min.css" rel="stylesheet">');
    }
	if (get_settings().get('Main.Debugmode') == true) {
		//##	This shows admin only items	##//
		
	} else {
		//##	this hides admin only items	##//
		$('option[name=DebugOnly]').hide();
	}
	var defaulttab = get_settings().get('Main.DefaultTab');
	$(defaulttab).trigger('click'); //.click();
	$("head").append('<link rel="prerender" href="Settings.html">');
	ipc.send("createcontext", settings.get('Main.Debugmode'));
}
//***	RunJobFinderEXE - Opens the Job Finder	***//
async function RunJobFinderEXE() {
	logger.info("Opened Job Finder at " + Date().toLocaleString());
	
	get_cdtlb().openfile(fileNameAndParams);
}
function clearallnotifs() {
	$('.toast-content').html('<li id="defaultnotif">No New Notifications...</li>');
	get_settings().set('Main.Notifications', $('.toast-content').html());
}
function shownotifs() {
	try {cdtbtoast.dismiss()}catch(err){}
	cdtbtoast = get_cdtlb().proposeatoast("Notifications<label class='basiclabel' id='clearall' onclick='clearallnotifs()' style='cursor:pointer;'>Clear All</label>", get_settings().get('Main.Notifications'), '32000', 'top right');
	cdtbtoast.show();
}