var sys = require("sys"), 
url = require('url'), 
project = require("../config.project.json"), 
http = require('http'),

Router = function() {
    return {
        parts : [ 'module', 'method', 'parameter' ],
        req : null,
        res : null,
        getParams : null,
        response : "",
        settings : project.settings,
        type : "text/plain",

        setResponse : function(response) {
            this.req.callbacks._done(response, this.res);
        },

        execute : function(data) {
            var mdl;
            if (data.module) {
//                console.log("loading Module " + data.module);
                mdl = require("./" + data.module)(this);
                if (data.method) {
                    console.info("executing Method " + data.method + " in module: "+data.module+" params:" + data.parameter.join(","));
                    mdl[data.method].apply(mdl, data.parameter);
                }
            }
        },

        read : function(req, res) {
            var i = 0, data = {
                'method' : null,
                'parameter' : [],
                'module' : null
            }, url_parts = url.parse(req.url, true);
            this.req = req;
            this.res = res;

            this.req.callbacks = {
                _done : null,
                done : function(callback) {
                    this._done = callback;
                }
            };

            this.getParams = url_parts.query;
            String(url_parts.pathname).split("/").forEach(function(element, index) {
                if (element) {
//                    console.log(this.parts[i]);
                    if (i < 2) {
                        data[this.parts[i]] = element;
                        i++;
                    } else {
                        data[this.parts[i]].push(element);
                    }
                }
            }.bind(this));
            setTimeout(function() {
                this.execute(data);
            }.bind(this), 0);
            return req.callbacks;
        }
    };
};

global.clients = [];
global.clients.resolve = function(cookie) {
    this.forEach(function(element, index, array) {
        if (element.client == cookie) {
            console.log("resolve lock for client " + element.client + " and " + cookie);
            element.callback();
            delete array[index];
        }
    });
};

http.createServer(function(req, res) {
    var router = Router();
    router.read(req, res).done(function(response, res) {
        console.log("SENDING RESPONSE TYPE:" + router.type);
//        console.dir(response);
        res.writeHead(200, {
            'Content-Type' : router.type,
            'Access-Control-Allow-Origin' : project.settings.server
        });
        res.end(response);
    });
}).listen(project.settings.nodejsserver.port);
sys.puts("Server Running");
