angular.module('loggyApp', ['ngResource'])
    .controller('loggyController', function($resource) {

        var loggy = this;

        var googlePrice = $resource('http://finance.google.com/finance/info?client=ig&q=NYSE%3A:tick');


        loggy.editor = "return function test(){};";
        loggy.JQ =[];

        loggy.executeTests = function(){
           // console.log("Start validation");
		   for (var i = loggy.JQ.length - 1; i >= 0; i--) {
			   var trade =  loggy.JQ[i];
			   
			   angular.forEach(loggy.testSuite,function(test){    
					
                    var outcome = test.testFunction.call(test, trade);
                  //  loggy.logFinding(test,outcome);
			   });

			   loggy.JQ.splice(i,1);
			  
				console.log("Validation done for trade: "+trade.id);
			}
		   console.log("validation done");
        };


loggy.testSuite = [
{name:"Is instrument price the same as NYSE",
 description:"Validate that the internal price captured matches that of external source",
    dataAsset:"Trade",
    steward:"Ida Yde",
    active:true,
    triggerEvent:"onChange",
testFunction: function(object){
    var googleInstrument = getGoogleInstrument(object.instrument.id);
    if(googleInstrument!= null && assertEquals(googleInstrument.el,object.instrument.price)){
		loggy.logFinding(this,{"message":"We found the right price ",type:"success"});		        
    } else {
		loggy.logFinding(this,{"message":"Our price and google did not match",type:"warning"});		
    }
}},
{name:"Is instrument allowed",
    description:"Validate that the instrument is contained within the allowed lists",
    dataAsset:"Trade",
    steward:"Ida Yde",
    active:true,
    triggerEvent:"onChange",
testFunction:function(object) {
	var found = false;
	getAllowedInstruments().forEach(function (instrument) {
		if (assertEquals(object.instrument.id, instrument.id)) {	
			found = true;
			return;
		}
	});
	if(found){
		loggy.logFinding(this,{"message":"Instrument is allowed ",type:"success"});	
	} else {
		loggy.logFinding(this,{"message":"object is NOT in the allowed instrument list ",type:"warning"});	
		
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

            loggy.initTestLog(test);
			test.log.push(message);
        }

		loggy.initTestLog=function(test){
			if(test.log == undefined){
                test.log = [];
            }
		}
		

        var googlePriceArray = [ { "id": "657729" ,"t" : "NOK" ,"e" : "NYSE" ,"l" : "6.38" ,"l_fix" : "6.38" ,"l_cur" : "6.38" ,"s": "2" ,"ltt":"4:01PM EDT" ,"lt" : "Jun 14, 4:01PM EDT" ,"lt_dts" : "2017-06-14T16:01:10Z" ,"c" : "-0.04" ,"c_fix" : "-0.04" ,"cp" : "-0.62" ,"cp_fix" : "-0.62" ,"ccol" : "chr" ,"pcls_fix" : "6.42" ,"el": "6.38" ,"el_fix": "6.38" ,"el_cur": "6.38" ,"elt" : "Jun 14, 4:01PM EDT" ,"ec" : "0.00" ,"ec_fix" : "0.00" ,"ecp" : "0.00" ,"ecp_fix" : "0.00" ,"eccol" : "chb" ,"div" : "0.19" ,"yld" : "2.98" } ,{ "id": "22144" ,"t" : "AAPL" ,"e" : "NASDAQ" ,"l" : "145.16" ,"l_fix" : "145.16" ,"l_cur" : "145.16" ,"s": "2" ,"ltt":"4:00PM EDT" ,"lt" : "Jun 14, 4:00PM EDT" ,"lt_dts" : "2017-06-14T16:00:07Z" ,"c" : "-1.43" ,"c_fix" : "-1.43" ,"cp" : "-0.98" ,"cp_fix" : "-0.98" ,"ccol" : "chr" ,"pcls_fix" : "146.59" ,"el": "145.15" ,"el_fix": "145.15" ,"el_cur": "145.15" ,"elt" : "Jun 14, 4:15PM EDT" ,"ec" : "-0.01" ,"ec_fix" : "-0.01" ,"ecp" : "-0.01" ,"ecp_fix" : "-0.01" ,"eccol" : "chr" ,"div" : "0.63" ,"yld" : "1.74" } ];

        loggy.mockTrade = {
            "id": "1234",
            "productId": "312312313",
            "instrument": {
                "id": "NOK",
                "price": "6.40"
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
			var mockTrade = loggy.cloneJSON(loggy.mockTrade);
			
			mockTrade.id = Math.floor((Math.random() * 10) + 1);		
			mockTrade.instrument.price = Math.round ((6.32+(Math.random()/10)) * 100) / 100
			
            console.log("injecting trade: "+angular.toJson(mockTrade));
			loggy.JQ.push(mockTrade);
			
        };

		loggy.cloneJSON = function(obj) {
			return JSON.parse(JSON.stringify(obj));
		};
		
    });