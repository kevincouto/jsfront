/*
	* Static file server
	* Version 1.0.0
*/
function StaticServer(static_path, next)
{
	this.staticPath = Path.resolve(static_path);
}

//Load core modules
var Path = require("path"),
	FileSystem = require("fs"),
	Types = require("./types");

/*
	* handle
	* This is the primary controller for the Static File Server
	* Request and Response both come from the handle for the http.Server
	* The next param get's fired when there is no static file to send
*/
StaticServer.prototype.handle = function(Request, Response, next)
{
	//Secure the path from LFI
	var path = this.securePath(Request.url);
	var self = this;

	//Get the stats object
	FileSystem.stat(this.staticPath + path,function(err, stats){
		//If an error is generated then the file will not exists
		if(err)
		{
			next();
			return;
		}

		//Something exists but we only want to send files
		if(stats.isFile() === false)
		{
			next();
			return;
		}

		//Check to see if the browser has a cached version
		if(self.isCached(Request, stats))
		{
			//Handled Cached Headers
			Response.writeHead(304);
			Response.end();
			return;
		}

		//Send the file to the client
		Response.setHeader("Last-Modified",stats.mtime);
		Response.setHeader("Content-Length",stats.size);
		Response.setHeader("Content-Type",Types.get(Path.extname(path)));

		//let the kernal handle the piping of data, specify a small chunk as mosty be dealing with small content
		FileSystem.createReadStream(self.staticPath + path,{'bufferSize': 32 * 1024}).pipe(Response);
	});
}

/*
	* isCached
	* Used to check if the current file on the server is older/newer then the clients copy
*/
StaticServer.prototype.isCached = function(Request, Stats)
{
	//Check cached headers
	var ifModifiedSince = Request.headers['if-modified-since'];
	if(ifModifiedSince)
	{
		return !(ifModifiedSince < Stats.mtime);
	}
	return false;
}

/*
	* securePath
	* Used to remove LFI Attacks from the URI
*/
StaticServer.prototype.securePath = function(path)
{
	var path = path.split("/").filter(function(element, index, array){
		return (element != '..');
	}).join('/');

	return Path.normalize(path);
}

//Export 'create', a function used to create a static server 
exports.create = function(static_path)
{
	return new StaticServer(static_path);
}
