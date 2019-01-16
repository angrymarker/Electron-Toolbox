//# sourceURL=IgniteAPICall.js
function queueignitejob(passdata, toaster = null, desc = null) {
	var apikey = "adce7cad-7ff8-4aa6-b787-745034380ec9";
	var url = getigniteurl();
	$.ajax({
		type: 'POST',
		url: url,
		headers: {APIKey: apikey},
		data: passdata,
		success: function (data, status) {
			get_cdtlb().updateProgress('Sending data to ignite: ' + status, -1, toaster);
            data = JSON.parse(data);
            var jobid = data[0].Value;
            if (data[4].Name == "ErrorDescription")
        	{
        		get_cdtlb().updateProgress('Error - ' + data[4].Value, 100, toaster);
        		get_cdtlb().notify('Error - ' + data[4].Value, true);
        	}
        	else
        	{
        		if (desc == null)
        		{
            		get_cdtlb().updateProgress('Checking job status...', -1, toaster);
            	}
            	else 
            	{
            		get_cdtlb().updateProgress('Checking job status for ' + desc + '...', -1, toaster);
            	}
            	getignitejobstatus(jobid, toaster, desc);
        	}
		}
	});
}

function getignitejobstatus(jobid, toaster = null, desc = null) {
	var env = parseInt(get_settings().get('Main.Environment'), 10);
	var server;
	if (env == 1 || env == 2) {
        server = 'http://chcdssp1.iwco.com/api/stats/GetJobs/?query=week,limit%3D1000';
    } else if (env == 3) {
        server = 'http://chcdss1.iwco.com/api/stats/GetJobs/?query=week,limit%3D1000';
    }
    var jobstatus = 'none';
    $.ajax({
        url: server,
        success: function(data) {
            var dd = JSON.parse(data);
            for (var d = 0; d < dd.length; d++) {
                var currid = dd[d].Settings[0].Value;
                var status = dd[d].Settings[1].Value;
                console.log(dd[d]);
                if (jobid == currid) {
                    jobstatus = "Job ID: " + currid + ", Status: " + status;
                    if (status == 'Failed' || status == 'Complete')
                	{
                		//var recordcount = dd[d].Settings[11].Value;
                		var recordcount = getsettingvalueignite(dd[d].Settings, "RecordCount");
                		//var timecompleted = new Date(dd[d].Settings[12].Value);
                		var timecompleted = new Date(getsettingvalueignite(dd[d].Settings, "Completed"));
                		//var timestarted = new Date(dd[d].Settings[4].Value);
                		var timestarted = new Date(getsettingvalueignite(dd[d].Settings, "Started"));
                		var td = (timecompleted - timestarted);
                		td = td/1000;
                		console.log(td);
                		var throughput = Math.round((recordcount * 3600000) / (timecompleted - timestarted)).toLocaleString() + ' records/hour';
                		console.log(throughput);
                		if (desc == null)
                		{
                			get_cdtlb().updateProgress('Job ' + status, 100, toaster);
                			get_cdtlb().notify('Job ' + status);
                		}
                		else
                		{
                			get_cdtlb().updateProgress(desc + ' Job ' + status + '.', 100, toaster);
                			get_cdtlb().notify(desc + ' Job ' + status + '.');
                		}
                		var result = {
                			"time" : td
                		}
                		get_cdtlb().logmetrics('Ignite', result, throughput);
						break;
    	            }
    	            else
    	        	{
    	        		if (desc == null)
    	        		{
    	        			get_cdtlb().updateProgress('Job status - ' + status, -1, toaster);
    	        		}
    	        		else
    	        		{
    	        			get_cdtlb().updateProgress(desc + ' Job status - ' + status, -1, toaster);
    	        		}
    	        		//wait
    	        		setTimeout(function(){ 
    	        			if (desc == null)
    	        			{
    	        				get_cdtlb().updateProgress('Checking job status...', -1, toaster);
    	        			}
    	        			else
    	        			{
    	        				get_cdtlb().updateProgress('Checking job status for ' + desc + '...', -1, toaster);
    	        			}
    	        			getignitejobstatus(jobid, toaster, desc);
    	        		}, 7500);
    	        		break;
    	        	}

                } else {
                    jobstatus = 'Unable to find job ID';
                }
            }
        },
        async: true
    })
    return jobstatus;
}

function getallignitejobstatus() {
    var env = parseInt(get_settings().get('Main.Environment'), 10);
	var server;
	if (env == 1 || env == 2) {
        server = 'http://chcdssp1.iwco.com/api/stats/GetJobs/?query=week,limit%3D1000';
    } else if (env == 3) {
        server = 'http://chcdss1.iwco.com/api/stats/GetJobs/?query=week,limit%3D1000';
    }
    var jobstatus = null;
    $.ajax({
        url: server,
        success: function(data) {
            jobstatus = JSON.parse(data);
        },
        async: false
    })
    return jobstatus;
}

function getallignitejobstatusfilltable() {
	
    $("#jobstatuses").html('<tr><th>Server</th><th><label>Job ID</label></th><th><label>Job Status</label></th><th><label>Description</label></th></tr>');
    var prod = 'http://chcdss1.iwco.com/api/stats/GetJobs/?query=week,limit%3D1000';
    var dev = 'http://chcdssp1.iwco.com/api/stats/GetJobs/?query=week,limit%3D1000';
    var env = parseInt(get_settings().get('Main.Environment'), 10);
    if (env == 1 || env == 2) {
        server = dev;
    } else if (env == 3) {
        server = prod;
    }
    $.ajax({
        url: server,
        success: function(data) {
            var jobs = JSON.parse(data);
            for (var j = 0; j < jobs.length; j++) {
            	if (jobs[j].get_settings().length == 4)
            	{
            		var jobid = jobs[j].Settings[0].Value;
                var jobstatus = jobs[j].Settings[1].Value;
                var Server = jobs[j].Settings[2].Value;
                var Description = jobs[j].Settings[3].Value;
                $("#jobstatuses").append('<tr><td><label class="basiclabel" name="server" title="Server Ignite was ran on">' + Server + '</label></td><td><label class="basiclabel" name="JobID" title="Job ID">' + jobid + '</label></td><td><label class="basiclabel" name="JobStatus" title="Job Status">' + jobstatus + '</label></td><td><label name="Description" title="Job Description">' + Description + '</label></td></tr>');
            	}
            	else
            	{
                var jobid = jobs[j].Settings[0].Value;
                var jobstatus = jobs[j].Settings[1].Value;
                var Server = jobs[j].Settings[5].Value;
                var Description = jobs[j].Settings[11].Value;
                $("#jobstatuses").append('<tr><td><label class="basiclabel" name="server" title="Server Ignite was ran on">' + Server + '</label></td><td><label class="basiclabel" name="JobID" title="Job ID">' + jobid + '</label></td><td><label class="basiclabel" name="JobStatus" title="Job Status">' + jobstatus + '</label></td><td><label name="Description" title="Job Description">' + Description + '</label></td></tr>');
                }
            }
        }
    })
}

function shouldweusexml()
{
	//pkgs
	
	return false;
}

function CreateAPICallData(jobnum, subjob, clientname, pkg, repo = 'test', usexml = false) {
	
	var env = parseInt(get_settings().get('Main.Environment'), 10);
	pkg = pkg.join(',');
	var fileserver = get_cdtlb().getfileserver(jobnum);
	var repository = getrepository(repo, env);
	if (usexml == false)
	{
    var passdata4 = {
        'ServiceProvider': 'Redpoint',
        'Services': [{
            "Name": "RedPointProject",
            "Settings": [{
                    "Name": "ProjectPath",
                    "Value": repository
                },
                {
                    "Name": "Job_Num",
                    "Value": jobnum
                },
                {
                    "Name": "Sub_Num",
                    "Value": subjob
                },
                {
                    "Name": "Server",
                    "Value": fileserver
                },
                {
                    "Name": "Pkg_Num",
                    "Value": pkg
                },
                {
                    "Name": "Client",
                    "Value": clientname
                }
            ]
        }]
    }
	}
	else
	{
		var strxml = generatexml(jobnum, subjob, clientname, pkg);
		var xmlfile = createxmlfile(strxml);
		var passdata4 = {
        'ServiceProvider': 'Redpoint',
        'Services': [{
            "Name": "RedPointProject",
            "Settings": [{
                    "Name": "ProjectPath",
                    "Value": repository
                },
                {
                    "Name": "XMLFile",
                    "Value": xmlfile
                }
            ]
        }]
    }
	}
    return passdata4;
}

function CreateAPICallDataSeedGalley(jobnum, subjob, pkg, clientname, email, fileserver, repo = 'test') {
        var env = parseInt(get_settings().get('Main.Environment'), 10);
        //pkg = pkg.join(',');
        //var fileserver = get_cdtlb().getfileserver(jobnum);
        var repository = getrepository(repo, env);
        var passdata4 = {
            'ServiceProvider': 'Redpoint',
            'Services': [{
                "Name": "RedPointProject",
                "Settings": [{
                    "Name": "ProjectPath",
                    "Value": repository
                },
                    {
                        "Name": "Job_Num",
                        "Value": jobnum
                    },
                    {
                        "Name": "Sub_Num",
                        "Value": subjob
                    },
                    {
                        "Name": "Server",
                        "Value": fileserver
                    },
                    {
                        "Name": "Pkg_Num",
                        "Value": pkg
                    },
                    {
                        "Name": "Client",
                        "Value": clientname
                    },
                    {
                        "Name": "Email",
                        "Value": email
                    }
                ]
            }]
        }
        return passdata4;
    }
    
function getrepository(repo, env)
{
	if (repo == 'seedgalley')
	{
		if (env == 1 || env == 2)
		{
			return "repository:///PreProd/SeedGalley/SeedGalley_Auto";
		}
		else
		{
			return "repository:///Production/SeedGalley/SeedGalley_Auto";
		}
	}
	else if (repo == 'test')
	{
		return "repository:///SandBox/Jake/Jake_Test_automation";
	}
	
}

function getigniteurl(sync = false)
{
	var env = parseInt(get_settings().get('Main.Environment'), 10);
	if (env == 1 || env == 2)
	{
		if (sync == false)
		{
			return 'http://chcdssp1.iwco.com/api/jobs/queue';
		}
		else
		{
			return 'http://chcdssp1.iwco.com/api/tasks/run';
		}
	}
	else if (env == 3) 
	{
		if (sync == false)
		{
			return 'http://chcdss1.iwco.com/api/jobs/queue';
		}
		else
		{
			return 'http://chcdss1.iwco.com/api/tasks/run';
		}
	}
}

function logignitecall(jobnum, subjob, pkg, data, tool = 'Ignite')
{
	data = get_cdtlb().replaceAll(data, '"', "'")
	get_fs().appendFile('\\\\chcd1\\chcd1_data\\ClientTemplates\\CDToolBox Log\\Electron-CDToolbox\\Ignite\\Runs.csv', "\n" + jobnum + ',' + subjob + ',' + pkg + ',' + get_cdtlb().gettoday() + ',' + tool + ',' + '"' + data + '"', function (err) {
		if (err) throw err;
	});
}

function getsettingvalueignite(array, name)
{
	for (var a = 0; array.length; a++)
	{
		if (array[a].Name == name)
		{
			return array[a].Value;
		}
	}
}

function generatexml(jobnum, subjob, clientname, pkgs)
{
	var xmlDoc = document.implementation.createDocument(null, "Report");
	var parentnode = xmlDoc.getElementsByTagName("Report");
	parentnode[0].setAttribute("Job_Num", jobnum);
	parentnode[0].setAttribute("Sub_Num", subjob);
	parentnode[0].setAttribute("Report_Name", "EOJ_Report");
	parentnode[0].setAttribute("Server", "CHCD1");
	parentnode[0].setAttribute("Email", get_settings().get('Main.Email'));
	var pkgnode = makepkgnodes(xmlDoc, pkgs);
	parentnode[0].appendChild(pkgnode);
	return xmltostring(xmlDoc);
}

function makepkgnodes(xmlDoc, pkgvals)
{
	var pkgnode = xmlDoc.createElement("Package");
	for (var p = 0; p < pkgvals.length; p++)
	{
		var pkgvalnode = xmlDoc.createElement("Pkg_Num");
		pkgvalnode.innerHTML = pkgvals[p];
		pkgnode.appendChild(pkgvalnode);
	}
	return pkgnode;
}

function xmltostring(xmldoc)
{
	var s = new XMLSerializer();
	return s.serializeToString(xmldoc);
}

function createxmlfile(xmlstring)
{
	//var uuidv1 = window.('uuid/v1');	
	var xmlfile = get_uuid()() + "test.xml";
	get_fs().writeFileSync(xmlfile, xmlstring);
	return xmlfile;
}