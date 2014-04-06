/**
 * 
 */
module.exports = function(router) {
    var router = router,
    files = [],
    task = require("./task.js")();
    return {
        getModules : function() {
/*
            var i = 0, j = 0;
*/

            router.getParams.tasks.split(",").forEach(function(module) {
//                console.log("Task " + module);
                if(module){
                    files = files.concat(task.getFiles(module));
                }
            });
/*            
            j = files.length;
            /* Fixe Zusaetze --- Module werden nur im Dev-mode angefordert */
            /*            
            while(files[i] != "core/event.js" && i < j){
                i++;
            }
            if(i === j){
                console.warn("No Core-file found");
            }else{
                files = files.slice(0, i+1).concat(task.getFiles('dev')).concat(files.slice(i+1));
            }
*/            
            router.getParams.files.split(",").forEach(function(file) {
//                console.log("File " + file);
                if(file){
                    files = files.concat(file);
                }
            });
            
            /*
            

             */
//            console.dir(files);
            router.setResponse(JSON.stringify(files));
        }
    };
};