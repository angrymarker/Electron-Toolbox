//***	Sadly, logging is needed pretty much anywhere, so these are global variable	***//
var winston = window.require('winston');
try
{
	var username = window.require('username');
	var uname = username.sync();
	//get_settings().get('Main.Email')
	if (get_settings().has('Main.Email') == true)
	{
		uname = get_settings().get('Main.Email');
		uname = uname.substring(0, uname.indexOf('@'));
		uname = uname.replace('.','-');
	}
}
catch(err)
{
	uname = username.sync();
	alert("Failed to set logfilename " + err);
}
if (uname == null || uname == '')
{
	uname = username.sync();
}
if (uname == null || uname == '')
{
	uname = "Blank_Name";
}
//##	Update if we don't want to rely on date in log	##//
var logfilename = 'logs\\' + uname + '_' + get_cdtlb().gettoday() + '.log';
var options = {
    file: {
        level: 'info',
        filename: logfilename,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, 		//##	No bigger than 5MB	##//
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
    }
};
var logger = winston.createLogger({
    transports: [
      new winston.transports.File(options.file),
    ],
    exceptionHandlers: [
    	new winston.transports.File({ filename: 'Exceptions\\allexceptions.log' })
  	],
    exitOnError: false
});
logger.info('Loaded toolbox at ' + Date().toLocaleString());
logger.on('error', function (err) { logger.log('error', err); });

	
