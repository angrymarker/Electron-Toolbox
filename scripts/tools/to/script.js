////# sourceURL=JobTicketApp.js
var jtatoast;
//global
//***	When the window loads, this script looks at the "Content Development" dropdown, and looks to see if "Job Ticket Creator" was chosen	***//

exports.html = function() {
	var html = "";
	var tablecol1 = '<table style="width:100%"><colgroup><col span="1" style="width:50%"><col span="1" style="width:50%"></colgroup><tr><td>';
	var jobtemplate = '<p id="jtpt" style="display:none;"><label for="jobtemplate" class="basiclabel" title="Job Template"> Job Template*:</label><input type="text" placeholder="Enter Job Template..." name="jobtemplate" id="jobtemplate" class="jobinputfield" size="14" title="Enter a Job Template"><label id="jobtemplateerror" class="inputerror"><br>Please enter a valid Job Template</label></p>';
	var jobnum = '<p id="jobarea"><label for="jtajobnumber" class="basiclabel" title="Job Number" id="lbljobnum">Job Number*:</label><input type="text" placeholder="Enter Job Number" name="jtajobnumber" id="jtajobnumber" class="jobinputfield" maxlength="5" size="14" title="Enter a Job Number"><label id="jobnumerror" class="inputerror"><br>Please enter a valid Job Number</label></p>';
	var subjob = '<p id="subjobarea"><label id="lblsubjob" for="subjobnum" class="basiclabel" title="Sub Job Number">Sub Job*:</label><select id="subjobnum" class="dropdown" title="Enter a Sub Job Number"><option value="sl" selected disabled>Select Sub Job...</option><option value="001">001</option></select><label id="subjobnumerror" class="inputerror"><br>Please select a valid sub job number</label></p>';
	var cdrole = '<p><label for="cdrole" class="basiclabel" title="Content Development Role">CD Role*:</label><select id="cdrole" class="dropdown" title="Enter a CD Role"><option value="slr" selected disabled>Select Role...</option><option value="DP" title="Data Processing">Data Processing</option><option value="CL" title="Content Layout">Content Layout</option><option value="QC" title="Quality Control">Quality Control</option><option value="TEST" title="To use for testing">Testing</option></select><label id="cdroleerror" class="inputerror"><br>Please select a Role</label></p>';
	var ampjob = '<p><label for="usejobnum" class="basiclabel">Select by Job Number:</label><input name="amp" value="usejobnum" type="radio" id="usejobnum" checked><label for="usetemplate" class="basiclabel">Select by Template Name:</label><input name="amp" value="usetemplate" type="radio" id="usetemplate" ></p>';
	var tablecol2 = '</td><td style="vertical-align:top">';
	var clientname = '<p><label for="clientname" class="basiclabel" title="Client Name">Client Name:</label><label id="clientname" class="basiclabel" title="Client Name">...</label></p>';
	var lob = '<p><label for="clientlob" class="basiclabel" title="Client LOB">LOB:</label><label id="clientlob" class="basiclabel" title="Client LOB">...</label></p>';
	var RunButton = '<p><button type="reset" id="clearbutton" class="basicbutton" title="Revert entered items to default state">Clear</button><button type="submit" class="basicbutton" id="RunButton" name="RunButton" title="Generate Job Ticket">Generate</button><label id="allpkgs" hidden></label></p>';
	var endtable = '</td></tr></table>';
	html = ampjob + tablecol1 +  jobtemplate + jobnum + subjob + cdrole  + RunButton + tablecol2 + clientname + lob + endtable;
	return html;
}

//***	JobTicketui is the "onload" event for the tool	***//
//##	This sets up all the change/click/settings events	##//
//function JobTicketui() {
exports.Events = function() {
	//##	Generate Job Ticket	##//
	$("#RunButton").click(function () {
		event.preventDefault();
		var jobfolder = null;
		try {jtatoast.dismiss()}catch(err){}
		jtatoast = get_cdtlb().proposeatoast("Generating job ticket...", "Grabbing form data...", '-1');
		if (get_settings().get('Main.OutlineProgress') == true){
			jtatoast.show();
		}
		var test = $("[name=amp]:checked").val();
		if (test == "usetemplate")
		{
			var jobnum = $("#jobtemplate").val();
			jobfolder = $("#jtajobnumber").val();
		}
		else
		{
			var jobnum = $("#jtajobnumber").val();
		}
		var subjob = $("#subjobnum").val();
		var cdrole = $("#cdrole").val();
		var pkgstosend = $("#allpkgs").text();
		if (jobnum.length > 4 && subjob != null && cdrole != null) {
			get_cdtlb().updateProgress('Grabbed Form Data!', -1, jtatoast);
			console.log('run something');
		} else if (jobnum.length > 4 && subjob != null) {
			$("#cdroleerror").show();
			get_cdtlb().notify("Please select a CD Role", true);
		} else if (jobnum.length > 4 && cdrole != null) {
			$("#subjobnumerror").show();
			get_cdtlb().notify("Please select a subjob", true);
		} else if (jobnum.length > 4 && subjob == null && cdrole == null) {
			$("#subjobnumerror").show();
			$("#cdroleerror").show();
			get_cdtlb().notify("Please select a subjob and a CD Role", true);
		} else if (jobnum < 5) {
			$("#jobnumerror").show();
			$("#subjobnumerror").show();
			$("#cdroleerror").show();
			get_cdtlb().notify("Please enter a valid job number");
		}
	});
	//##	Resets form to onload	##//
	$("#clearbutton").click(function () {
		$("#clientname").text("...");
		$("#clientlob").text("...");
		$("#subjobnum").find('option').not(':first').remove();
		$("#subjobnum").val("sl");
		$("#allpkgs").text('');
		var selected = $("[name=amp]:checked").val();
		get_cdtlb().updateProgress("Ready...", 0);
		setTimeout(function(){
			$("[value=" + selected + "]").prop("checked", true);
		}, 1);
	});
	//##	If a valid job number is entered, grab the client name	##//
	
}
