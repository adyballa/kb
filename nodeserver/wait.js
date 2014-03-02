/**
 * 
 */
module.exports = function(router) {
    var router = router;
    return {
        loadIsFinished : function() {
//            console.log("loadIsFinished "+router.getParams.id);
            router.type = "application/javascript";
            global.clients.push({client : router.getParams.id, callback: function(){
                router.setResponse("console.log('node-js-wait sends load is finished');");
            }});
            setTimeout(function(){
                global.clients.resolve(router.getParams.id);
//                console.log("load is FINISHED");
            }, router.settings.timeout);
        },
        modulesAreLoaded : function(){
//            console.log("\n\n modulesAreLoaded "+router.getParams.id);
            global.clients.resolve(router.getParams.id);
//            console.log("modulesAreLoaded is FINISHED");
            router.setResponse("");
        }
    };
};