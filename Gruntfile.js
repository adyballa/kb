module.exports = function(grunt) {
    var libs = grunt.option('libs'), customLibName = grunt.option('libName') || '', ext = grunt.option('ext') || "js",
    exclude = grunt.option('exclude'),
    doc = grunt.option('doc');

    libs = (libs) ? libs.split(',') : '';
    exclude = (exclude) ? exclude.split(",") : [];

    GDTASK.Grunt.init(grunt, libs, exclude);
    // Project configuration.
    grunt.initConfig({
        connect:{
            server: GDTASK.settings.server
        },
        pkg : grunt.file.readJSON('package.json'),
        jshint : GDTASK.Grunt.task('jshint', {
            options : {
                curly : true,
                eqeqeq : true,
                strict : true,
                immed : true,
                latedef : true,
                newcap : true,
                noarg : true,
                sub : true,
                undef : true,
                eqnull : true,
                browser : true,
                devel : (grunt.option('devel')) || false,
                globals : {
                    jQuery : true,
                    $ : true,
                    console : true
                }
            }
        }, {
            src : function(libName, files) {
                return files;
            }
        }),

        concat : GDTASK.Grunt.task('concat', {}, {
            src : function(libName, files) {
                return files;
            },
            dest : function(libName, files) {
                libName = customLibName || libName;
                return 'builder/src/' + libName + '.' + ext;
            }
        }),

        removeDbgs : GDTASK.Grunt.task('removeDbgs', {}, {
            src : function(libName, files) {
                libName = customLibName || libName;
                return 'builder/src/' + libName + '.' + ext;
            }
        }),

        clearDir : GDTASK.Grunt.task('clearDir', {}, {
            src : function(libName, files) {
                libName = customLibName || libName;
                return 'builder/src/' + libName + '.' + ext;
            } 
        }),

        uglify : GDTASK.Grunt.task('uglify', {
            options : {
                banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build : {
                src : 'builder/src/<%= pkg.name %>.' + ext,
                dest : 'builder/build/<%= pkg.name %>.min.' + ext
            }
        }, {
            src : function(libName, files) {
                libName = customLibName || libName;
                return 'builder/src/*.'+ext;
            },
            dest : function(libName, files) {
                libName = customLibName || libName;
                return 'builder/build/' + libName + '.min.' + ext;
            }
        }),

        relative2Absolute : GDTASK.Grunt.task('relative2Absolute', {}, {
            src : function(libName, files) {
                return files;
            },
            dest : function(libName, files){
                return files;
            }
        }),

        cssmin : GDTASK.Grunt.task('cssmin', {
            options : {
                banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            }
        }, {
            src : function(libName, files) {
                return 'builder/src/*.'+ext;
            },
            dest : function(libName, files){
                libName = customLibName || libName;
                return 'builder/build/' + libName + '.min.' + ext;
            }
        }),

        jasmine : GDTASK.Grunt.task('jasmine', {},
            {
            src : function(libName, files) {
                return files;
            },
            options : function(libName, files) {
                var specs = [];
                if ('jasmine' in GDTASK.definition[libName].grunts){
                    specs.push(GDTASK.definition[libName].grunts['jasmine']);
                }
                files.subLibs.forEach(function(subLib) {
                    if ('jasmine' in GDTASK.definition[subLib].grunts)
                        specs.push(GDTASK.definition[subLib].grunts['jasmine']);
                });
                
                
                return {
                    specs : specs,
                    host : GDTASK.settings.server+GDTASK.settings.root,
                    timeout : 10000,
                    vendor: './external_libs/jquery-1.8.2.js',
                    template : require('grunt-template-jasmine-requirejs')
                };
            }
        }),

        jsdoc : GDTASK.Grunt.task('jsdoc',{},
            {
                options : function(libName, files) {
                    if(libName === "all" || doc){
                        return {
                            destination : doc || '_doc',
                            template : 'templates/jsdoc/docstrap-master/template',
                            configure : 'templates/jsdoc/docstrap-master/template/jsdoc.conf.json'
                        };
                    }
                },
                src: function(libName, files) {
                    files = files.concat((doc || 'doc')+"/README.md");
                    return files;
            }
        })
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-qunit');
//    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-markdown');
//    grunt.loadNpmTasks('grunt-jasmine-runner');
    GDTASK.Grunt.register();
    
    // Default task(s).
    grunt.registerTask('default', 'default task for all modules', function(){
        doc = "doc2";
        for(var taskName in GDTASK.definition.all.grunts){
            if(GDTASK.definition.all.grunts.hasOwnProperty(taskName) && GDTASK.definition.all.grunts[taskName]){
                grunt.verbose.writeln('all task is '+taskName);
                grunt.task.run(taskName+':all');
            }
        }
    });

    if(libs){
        grunt.registerTask('multi', 'runs multiple libs', function(){
            /**
             * Fuehrt einen Task fuer eine Lib aus
             *
             * @param {String} libName
             * @param {String} taskName
             * @private
             */
            var _run = function(libName, taskName){
                grunt.verbose.writeln("Multitask (_run) wird mit lib " +libName+" und Task "+taskName+" ausgefuehrt.");
                if(GDTASK.definition[libName].grunts[taskName]){
                    grunt.log.writeln("REGISTER libName|"+libName+"| TASK|"+taskName+"|");
                    grunt.task.run(taskName+':'+libName);
                }
            },

            firstLib, concatTask;

            /* Es gibt geringe Abhaengigkeiten zwischen den Tasks.
            * Manche koennen, duerfen erst ausgefuehrt werden,
            * wenn die fertige "grosse" Datei gebaut worden ist.
            * Ansonsten koennten z.B. Originaldateien ueberschrieben werden.
            *
            * TODO: Eventuell Abhaengigkeitsmanagement einfuehren.
            * */
            /* Vor dem Build/Mit Originaldateien: jsHint, jasmine  */
            grunt.log.writeln("Multi: Vor dem Build");
            GDTASK.Grunt.tasks.filter(function(task){
                return (exclude.concat(['concat', 'uglify', 'clearDir', 'relative2Absolute', 'removeDbgs', 'cssmin']).indexOf(task) === -1) ? true : false;
            }).forEach(function(taskName){
                libs.forEach(function(libName){
                    _run(libName, taskName);
                });
            });

            grunt.log.writeln("Multi: Verschiebt in den Build-ordner");
            concatTask = GDTASK.Grunt.grunt.config('concat');
            for(var libName in GDTASK.Grunt.files.concat){
                if(firstLib){
                    concatTask[libs[0]].src = concatTask[libs[0]].src.concat(GDTASK.Grunt.files.concat[libName]);
                }else{
                    firstLib = libName;
                }
            }
            GDTASK.Grunt.grunt.config('concat', concatTask);

            /* Verschiebt in den Build-ordner */
            _run(libs[0], 'concat');

            /* Nach dem Build: relative2Absolute, removeDbgs  */
            grunt.log.writeln("Multi: Nach dem Build");
            ['relative2Absolute', 'removeDbgs'].filter(function(task){
                return (exclude.indexOf(task) === -1) ? true : false;
            }).forEach(function(task){
                _run(libs[0], task);
            });

            /* Minifizieren?: [JS] uglify, [CSS] cssmin  */
            grunt.log.writeln("Multi: Minifizieren");
            ['uglify', 'cssmin'].filter(function(task){
                return (exclude.indexOf(task) === -1) ? true : false;
            }).forEach(function(task){
                _run(libs[0], task);
            });

            /* Aufraeumen?: clearDir  */
            grunt.log.writeln("Multi: Aufraeumen");
            ['clearDir'].filter(function(task){
                return (exclude.indexOf(task) === -1) ? true : false;
            }).forEach(function(task){
                _run(libs[0], task);
            });
        });
    }

    grunt.registerMultiTask('removeDbgs', 'Removes all DBG-calls.', function() {
        grunt.log.writeln('removeDbgs: filesrc ist '+this.files[0].src);
        var content = grunt.file.read(__dirname+"/"+this.files[0].src);
        content = content.replace(/[^{};]*\.Dbg[^;]*\.[^;]*[;}{]/g, '');
        grunt.file.write(__dirname+"/"+this.files[0].src, content);
    });

    grunt.registerMultiTask('relative2Absolute', 'Wandelt alle relativen Pfade in Absolute um.', function() {
        grunt.log.writeln('task relative2Absolute files are '+JSON.stringify(this.files));
        var concatContent = "";
        this.files[0].src.forEach(function(file){
            var content = grunt.file.read(__dirname+"/"+file),
            strFile = "",
            arrFile = file.split("/");
            arrRoot = GDTASK.settings.root.split("/");
            arrAbsolute = arrRoot;
            file.split("/").forEach(function(dir, index){
                if(dir === ".."){
                    arrAbsolute.pop();
                    arrFile.shift();
                }else{
                    return false;
                }
            });
            strFile = arrFile.join("/");
            content = content.replace(/url\(\s*([^)]+)\s*\)|@import\s+(url)?([^;)]+);/g, function(match, p1, p2, p3, p4, offset, string){
                var sub = p1 || p3, fReplace = true, del = "\"";
                sub = sub.replace(/^(["'])?(.*).$/, function(match, p1, p2){
                    if(p2.trim().indexOf('http://')===0 && p2.trim().indexOf('/')===0){
                        fReplace = false;
                    }
                    del = p1 || del;
                    return p2;
                });
                if(fReplace){
                    return "url("+del+"/"+arrFile.slice(0,-1).join("/")+"/"+sub+del+")";
                }
                return match;
            });
            concatContent += "\n"+content;
        });
        grunt.file.write(__dirname+"/builder/src/gd_css.css", concatContent);

//        content = content.replace(/[^{};]*\.Dbg[^;]*\.[^;]*[;}{]/g, '');
//        grunt.file.write(__dirname+"/"+this.files[0].src, content);
    });

    grunt.registerMultiTask('clearDir', 'Removes all files in directory.', function() {
        grunt.log.writeln('task clearDir files are '+JSON.stringify(this.files));
        this.files[0].src.forEach(function(file){
            grunt.file.delete(file);
        });
        
    });
};