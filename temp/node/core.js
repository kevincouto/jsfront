var http = require('http'),
    Path = require("path"),
    FileSystem = require("fs"),
    Mime = require('./types.js'),
    Session = require('./session.js'),
	core = {};

//__dirname no express significa a pasta da aplicação, do arquivo principal .js

(function(){
    var htmlTemplate = [
            '<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>',
            '</title><script>',
            'Config = {',
            '};</script><script id="loader" src="',
            '" type="text/javascript" charset="utf-8"></script></head><body onload="Loader.run(\'',
            '\')"</head><body></body></html>'
        ],
    wwwroot='';
    
    core.application=function(config){
        this._config = config;
        
        wwwroot = config.wwwroot;
        
        this.run = function(){
            http.createServer(function (request, response) {
                var url = request.url,
                    img = "/(png|gif|jpg|jpeg)$/i",
                    aux = "/(css)$/i";
                
                if (request.url.indexOf('favicon.ico')==-1){
                    if (request.url=='/'+config.folder){
                        responseIndex(response, request, config);
                    }else{
                        responseFile(response, request, config);
                    }
                }else{
                    //response.session = 10;
                }
                
            }).listen(config.port);
            console.log('Application running at http://127.0.0.1:'+config.port+'/');
        };
        	
        return this;
    };

    core.favicon = function(path, options){
        var maxAge;
        
        options = options || {};
        path = path || __dirname + '/../public/favicon.ico';
        
        maxAge = options.maxAge || 86400000;
    
        return function favicon(req, res, next){
            if ('/favicon.ico' == req.url) {
                if (icon) {
                    res.writeHead(200, icon.headers);
                    res.end(icon.body);
                } else {
                    fs.readFile(path, function(err, buf){
                        if (err){
                            next(err);
                        }else{
                            icon = {
                                headers: {
                                    'Content-Type': 'image/x-icon'
                                  , 'Content-Length': buf.length
                                  , 'ETag': '"' + utils.md5(buf) + '"'
                                  , 'Cache-Control': 'public, max-age=' + (maxAge / 1000)
                                },
                                body: buf
                            };
                            
                            res.writeHead(200, icon.headers);
                            res.end(icon.body);
                        }
                    });
                }
            } else {
                next();
            }
        };
    };
    
    function responseIndex(response, request, config){
        response.setHeader("Content-Type", "text/html");
        response.write(htmlTemplate[0]);
        response.write(config.title);
        response.write(htmlTemplate[1]+'\n');
        response.write(htmlTemplate[2]);
        response.write('THEME:"' + (config.theme||'default') + '", PATH_APP:"' + config.folder + '/' + config.path + '",PATH_IMAGES:"' + config.images + '"');
        response.write(htmlTemplate[3]+config.loader);
        response.write(htmlTemplate[4]+config.app);
        response.write(htmlTemplate[5]);
        response.end();
    }
    
    function responseFile(response, request, config){
        var main = wwwroot + '/' + securePath(request.url), ext, img;
        
        main = main.split('?')[0];
        ext = main.split('.');
        ext = ext[ext.length-1];
        
        if (ext=='gif'){
            img = FileSystem.readFileSync(main);
            response.writeHead(200, {'Content-Type': 'image/gif' });
            response.end(img, 'binary');
        }else{
            response.setHeader("Content-Type", Mime.get(ext));
            FileSystem.readFile(main, 'utf8', function (err, data) {
                if(err){
                    response.write('console.log("' + err.message + '");');
                }else{
                     response.write(data);
                }
                
                response.end();
            });
        }
    }
    
    function securePath(path){
        path = path.split("/").filter(function(element, index, array){
            return (element != '..');
        }).join('/');
    
        return Path.normalize(path);
    }

    //retorna o path da url
    function decode(url){
        try {
            return decodeURIComponent(url);
        } catch (err) {
            return null;
        }
    }

    core.require = function(file){
        //var app = core.application();
        
        /*if (app){
            
        }*/
    };

}());

module.exports = core;

/*
function include(Response, url, next){
	//Secure the path from LFI
	var path = securePath(url);
	var self = this;

	//Get the stats object
	FileSystem.stat(path, function(err, stats){
		//If an error is generated then the file will not exists
		if(err){
			next();
			return;
		}

		//Something exists but we only want to send files
		if(stats.isFile() === false){
			next();
			return;
		}

		//Check to see if the browser has a cached version
		if(self.isCached(Request, stats)){
			//Handled Cached Headers
			Response.writeHead(304);
			Response.end();
			return;
		}

		//Send the file to the client
		Response.setHeader("Last-Modified",stats.mtime);
		Response.setHeader("Content-Length",stats.size);
		Response.setHeader("Content-Type",Mime.get(Path.extname(path)));

		//let the kernal handle the piping of data, specify a small chunk as mosty be dealing with small content
		FileSystem.createReadStream(path,{'bufferSize': 32 * 1024}).pipe(Response);
	});
}*/