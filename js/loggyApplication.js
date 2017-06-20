angular.module('loggyApp', ['ngResource'])
    .controller('loggyController', function($resource) {

        var loggy = this;

        var googlePrice = $resource('http://finance.google.com/finance/info?client=ig&q=NYSE%3A:tick');


        loggy.editor = "return function test(){};";
        loggy.JQ =[];

        loggy.executeTests = function(){
            console.log("Start validation");
            angular.forEach(loggy.JQ, function(trade){
                angular.forEach(loggy.testSuite,function(test){
                    test.log = [];
                    console.log("starting test "+test.name)
                    var outcome = test.testFunction.call(test, trade);
                    loggy.logFinding(test,outcome)
                });
                console.log("Validation done for trade: "+trade.id);
                loggy.removeFromQueue(trade);
            })
            console.log("validation done");
        };


loggy.testSuite = [
{name:"Test price match NYSE",
 description:"Validate that the internal price captured matches that of external source",
    dataAsset:"Trade",
    steward:"Ida Yde",
    active:true,
    triggerEvent:"onChange",
        testFunction: function(object){
    var googleInstrument = getGoogleInstrument(object.instrument.id);

    if(googleInstrument!= null && assertEquals(googleInstrument.el,object.instrument.price)){
        return SUCCESS();
    } else {
        return FAILURE("the price from google was "+ googleInstrument.el+" and our price was "+object.instrument.price);
    }
}},
{name:"Is instrument valid",
    description:"Validate that the instrument is contained within the allowed lists",
    dataAsset:"Trade",
    steward:"Ida Yde",
    active:true,
    triggerEvent:"onChange",
    testFunction:function(object) {
            var found = false;
            getAllowedInstruments().forEach(function (instrument) {
                if (assertEquals(object.instrument.id, instrument.id)) {
                    found = true
                    return;
                }
            });
            if(found){
                return SUCCESS();
            } else {
                return FAILURE("object is NOT in the allowed instrument list")
            }
        }
    }
];


        FAILURE =function(_message, _type){
            return {
                message : _message || "Test failed",
                type : _type || "danger"
            }
        }

        SUCCESS =function(_message, _type){
            return {
                message : _message || "Test was successful",
                type : _type || "success"
            }
        }

        assertEquals=function(a, b){
            if(a == undefined || b == undefined)
                return false;
            return a==b;
        }

        getAllowedInstruments=function(){
          return loggy.allowedInstruments;
        };

        getGoogleInstrument=function(TICK){
            var instrument = null
            googlePriceArray.forEach(function(object){
                if(object.t == TICK){
                    instrument = object;
                    return;
                }
            })
            return instrument;
        }


        loggy.logWarning =function(test,message){
            loggy.logFinding(test,{"message":message,type:"warning"});
        }
        loggy.logInfo=function(test,message){
            loggy.logFinding(test,{"message":message,type:"info"});
        };

        loggy.logFinding=function(test,message){
            if(test.log == undefined){
                test.log = [];
            }
            console.log(test.name +":"+message);
            [].push.call(test.log, message);
        }


        var googlePriceArray = [ { "id": "657729" ,"t" : "NOK" ,"e" : "NYSE" ,"l" : "6.38" ,"l_fix" : "6.38" ,"l_cur" : "6.38" ,"s": "2" ,"ltt":"4:01PM EDT" ,"lt" : "Jun 14, 4:01PM EDT" ,"lt_dts" : "2017-06-14T16:01:10Z" ,"c" : "-0.04" ,"c_fix" : "-0.04" ,"cp" : "-0.62" ,"cp_fix" : "-0.62" ,"ccol" : "chr" ,"pcls_fix" : "6.42" ,"el": "6.38" ,"el_fix": "6.38" ,"el_cur": "6.38" ,"elt" : "Jun 14, 4:01PM EDT" ,"ec" : "0.00" ,"ec_fix" : "0.00" ,"ecp" : "0.00" ,"ecp_fix" : "0.00" ,"eccol" : "chb" ,"div" : "0.19" ,"yld" : "2.98" } ,{ "id": "22144" ,"t" : "AAPL" ,"e" : "NASDAQ" ,"l" : "145.16" ,"l_fix" : "145.16" ,"l_cur" : "145.16" ,"s": "2" ,"ltt":"4:00PM EDT" ,"lt" : "Jun 14, 4:00PM EDT" ,"lt_dts" : "2017-06-14T16:00:07Z" ,"c" : "-1.43" ,"c_fix" : "-1.43" ,"cp" : "-0.98" ,"cp_fix" : "-0.98" ,"ccol" : "chr" ,"pcls_fix" : "146.59" ,"el": "145.15" ,"el_fix": "145.15" ,"el_cur": "145.15" ,"elt" : "Jun 14, 4:15PM EDT" ,"ec" : "-0.01" ,"ec_fix" : "-0.01" ,"ecp" : "-0.01" ,"ecp_fix" : "-0.01" ,"eccol" : "chr" ,"div" : "0.63" ,"yld" : "1.74" } ];

        loggy.trade = {
            "id": "1234",
            "productId": "312312313",
            "instrument": {
                "id": "NOK",
                "price": "99.1"
            },
            "currency": "GBP"
        };

        loggy.allowedInstruments = [
            {"id":"abc"},
            {"id":"aaa"},
            {"id":"bbb"},
            {"id":"NOK"}];

        loggy.alerts =[];

        loggy.injectTrade= function(){
            console.log("injecting trade: "+angular.toJson(loggy.trade));
            loggy.addToQueue(loggy.trade);
        };


        loggy.removeFromQueue=function(trade){
            loggy.JQ.forEach(function(object,index){
                if(object==trade){
                    loggy.JQ.splice(index,1);
                    return;
                }
            });
        }

        loggy.addToQueue=function(trade){
            loggy.JQ.push(loggy.trade);
        }

    });