module.exports = function() {
    var GDTASK = {};
    GDTASK.tasksLex = {};
    GDTASK.filesLex = {};
    GDTASK.modules = [];

    GDTASK.Grunt = {
        tasks : [ 'jshint', 'jsdoc','relative2Absolute','concat', 'removeDbgs', 'uglify', 'cssmin', 'clearDir' ],
        files : {},
        exclude : [],
        grunt : {
            verbose : {
                writeln : function(){}
            },
            log : {
                writeln : function(){}
            }
        },

        init : function(grunt, libs, exclude) {
            var ctx = this, fReset = !(libs);
            this.grunt = grunt;
            this.exclude = exclude;
            libs = libs || Object.keys(GDTASK.definition);
            
            for(var lib in GDTASK.definition){
                if(GDTASK.definition.hasOwnProperty(lib) && lib !== "all"){
                    GDTASK.definition['all'].tasks.push(lib);
                }
            }
            grunt.verbose.writeln('all tasks are '+GDTASK.definition['all'].tasks.join("\n - "));

            
            this.tasks.filter(function(task){
                return (exclude.indexOf(task) === -1) ? true : false;
            })
            .forEach(function(taskName) {
                ctx.grunt.verbose.writeln("GDTASK.Grunt.init " + taskName+"  libs:"+JSON.stringify(libs));
                ctx.files[taskName] = {};
                GDTASK.resetFiles();
                
                libs.forEach(function(libName){
                    ctx.grunt.verbose.writeln("GDTASK.Grunt.init 0 " + taskName + "  libName:" + libName);
                    if (('grunts' in GDTASK.definition[libName]) && (taskName in GDTASK.definition[libName].grunts) &&
                            GDTASK.definition[libName].grunts[taskName]) {
                        ctx.grunt.verbose.writeln("GDTASK.Grunt.init 1 " + taskName + "  libName:" + libName);
                        if(fReset) GDTASK.resetFiles();
                        ctx.files[taskName][libName] = GDTASK.getFiles(libName, taskName);
                        ctx.files[taskName][libName].subLibs = [];
                        for ( var subLib in GDTASK.tasksLex) {
                            if(subLib !== libName){
                                ctx.files[taskName][libName].subLibs.push(subLib);
                            }
                        }
                    }
                });
            });
            ctx.grunt.verbose.write("\nGDTASK.Grunt.init ENDE\n");
        },

        task : function(taskName, config, dynamicProps) {
            var files = [];
            this.grunt.verbose.write("\nGDTASK.Grunt.task Start " + taskName + "\n");
            for ( var libName in this.files[taskName]) {
                if (!(libName in config))
                    config[libName] = {};
                    for ( var propName in dynamicProps) {
                        config[libName][propName] = dynamicProps[propName](libName, this.files[taskName][libName]);
                    }
            }
            this.grunt.verbose.writeln("GDTASK.Grunt.task ENDE " + JSON.stringify(config));
            return config;
        },

        register : function() {
            var subTasks = {};
            for ( var taskName in this.files) {
                this.grunt.verbose.write("GDTASK.Grunt.register 0:" + taskName);
                for ( var libName in this.files[taskName]) {
                    this.grunt.verbose.writeln("GDTASK.Grunt.register 0:" + libName);
                    if (!(libName in subTasks))
                        subTasks[libName] = [];
                    subTasks[libName].push(taskName + ':' + libName);
                }
            }
            this.grunt.verbose.writeln("GDTASK.Grunt.register");
            for ( var i in subTasks) {
                this.grunt.verbose.writeln("GDTASK.Grunt.register " + i + "  subTasks:" + subTasks[i]);
                this.grunt.registerTask(i, subTasks[i]);
            }
        }
    };
    
    GDTASK.definition = require('../modules.core.json');
    var def = require('../config.project.json');
//        GDTASK.Grunt.grunt.log.debug("Gruntfile create tasks");
    for(var i in def['modules']){
        GDTASK.definition[i] = def['modules'][i];
    }
    GDTASK.development = def['development'];
    GDTASK.all_modi = def['all_modi'];
    GDTASK.production = def['production'];
    GDTASK.settings = def['settings'];
    
    GDTASK.resetFiles = function(){
        GDTASK.tasksLex = {};
        GDTASK.filesLex = {};
    };

    GDTASK.getFiles = function(lib, task) {
        var files = [], orig = [];

        function getFiles(lib, task) {

            if (GDTASK.tasksLex[lib]) {
                return false;
            }
            GDTASK.tasksLex[lib] = true;

            if(!(lib in GDTASK.definition)){
                throw new Error("Lib "+lib+" is not defined");
            }
            var ln = (typeof GDTASK.definition[lib].tasks === "undefined") ? 0 : GDTASK.definition[lib].tasks.length;
            for ( var i = 0; i < ln; i++) if(GDTASK.definition[lib].grunts[task]!==false){
                //if(GDTASK.definition[lib].grunts[task]!==false)
                getFiles(GDTASK.definition[lib].tasks[i], task);
            }
            
            if(GDTASK.definition[lib].grunts[task] === false){
                /* Wir steigen aus wenn subLib den Task nicht freigegeben hat */
                return;
            }
            
            orig = (task && Array.isArray(GDTASK.definition[lib].grunts[task])) ? GDTASK.definition[lib].grunts[task] : GDTASK.definition[lib].files;
            
            GDTASK.modules.push(lib);

            ln =  orig.length;
            for ( var i = 0; i < ln; i++) {
                if (typeof GDTASK.filesLex[orig[i]] === "undefined") {
                    var file = orig[i].replace(/\?[^?]+$/, "");
                    GDTASK.filesLex[file] = true;
                    files.push(file);
                }
            }
        }
        
        GDTASK.Grunt.grunt.verbose.writeln("getFiles TASK ist "+task);
        getFiles(lib, task);

        return files;
    };
    
    return GDTASK;
};
