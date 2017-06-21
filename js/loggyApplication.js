angular.module('loggyApp', ['ngResource'])
    .controller('loggyController', function($resource,$timeout,$q) {

        var loggy = this;
		var simulator;        
        
		var googlePrice = $resource('http://finance.google.com/finance/info?client=ig&q=NYSE%3A:tick');
		var googlePriceArray = [ { "id": "657729" ,"t" : "NOK" ,"e" : "NYSE" ,"l" : "6.38" ,"l_fix" : "6.38" ,"l_cur" : "6.38" ,"s": "2" ,"ltt":"4:01PM EDT" ,"lt" : "Jun 14, 4:01PM EDT" ,"lt_dts" : "2017-06-14T16:01:10Z" ,"c" : "-0.04" ,"c_fix" : "-0.04" ,"cp" : "-0.62" ,"cp_fix" : "-0.62" ,"ccol" : "chr" ,"pcls_fix" : "6.42" ,"el": "6.38" ,"el_fix": "6.38" ,"el_cur": "6.38" ,"elt" : "Jun 14, 4:01PM EDT" ,"ec" : "0.00" ,"ec_fix" : "0.00" ,"ecp" : "0.00" ,"ecp_fix" : "0.00" ,"eccol" : "chb" ,"div" : "0.19" ,"yld" : "2.98" } ,{ "id": "22144" ,"t" : "AAPL" ,"e" : "NASDAQ" ,"l" : "145.16" ,"l_fix" : "145.16" ,"l_cur" : "145.16" ,"s": "2" ,"ltt":"4:00PM EDT" ,"lt" : "Jun 14, 4:00PM EDT" ,"lt_dts" : "2017-06-14T16:00:07Z" ,"c" : "-1.43" ,"c_fix" : "-1.43" ,"cp" : "-0.98" ,"cp_fix" : "-0.98" ,"ccol" : "chr" ,"pcls_fix" : "146.59" ,"el": "145.15" ,"el_fix": "145.15" ,"el_cur": "145.15" ,"elt" : "Jun 14, 4:15PM EDT" ,"ec" : "-0.01" ,"ec_fix" : "-0.01" ,"ecp" : "-0.01" ,"ecp_fix" : "-0.01" ,"eccol" : "chr" ,"div" : "0.63" ,"yld" : "1.74" } ];
		var defaultTrade = {
            "id": "1234",
            "productId": "312312313",
            "instrument": {
                "id": "NOK",
                "price": "6.40"
            },
            "currency": "GBP"
        };
		
		loggy.JQ =[];
		loggy.testedTrades = [];

		loggy.allowedInstruments = [{"id":"abc"},
									{"id":"aaa"},
									{"id":"bbb"},
									{"id":"NOK"}];

		
		
		loggy.asyncTest = function(trade){
			 // perform some asynchronous operation, resolve or reject the promise when appropriate.
			 return $q(function(){
				
				angular.forEach(loggy.testSuite,function(test){    				
                    var outcome = test.testFunction.call(test, trade);                 
				});
			 });
			 
		}

loggy.testSuite = [
{name:"Is instrument price the same as NYSE",
 description:"Validate that the internal price captured matches that of external source",
    dataAsset:"Trade",
    steward:"Ida Yde",
    active:true,
    triggerEvent:"onChange",
testFunction: function(trade){
    var googleInstrument = getGoogleInstrument(trade.instrument.id);
    if(googleInstrument!= null && assertEquals(googleInstrument.el,trade.instrument.price)){
		loggy.logFinding(this,trade ,{"message":"We found the right price ",type:"success"});		        
    } else {
		loggy.logFinding(this,trade,{"message":"Our price and google did not match",type:"warning"});		
    }
}},
{name:"Is instrument allowed",
    description:"Validate that the instrument is contained within the allowed lists",
    dataAsset:"Trade",
    steward:"Ida Yde",
    active:true,
    triggerEvent:"onChange",
testFunction:function(trade) {
	var found = false;
	getAllowedInstruments().forEach(function (instrument) {
		if (assertEquals(trade.instrument.id, instrument.id)) {	
			found = true;
			return;
		}
	});
	if(found){
		loggy.logFinding(this, trade,{"message":"Instrument is allowed ",type:"success"});	
	} else {
		loggy.logFinding(this,trade, {"message":"object is NOT in the allowed instrument list ",type:"warning"});	
		
	}
}}];

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

        loggy.logFinding=function(test,trade, message){
			if(trade.log == undefined){
				trade.log = [];
			};
			
			var logMessage = {
				test: test,
				text:message.message,
				type:message.type
			};
			
			trade.log.push(logMessage);
        }

		loggy.initTestLog=function(test){
			if(test.log == undefined){
                test.log = [];
            }
		}
		
		loggy.stopSimulation=function(){			
			$timeout.cancel(simulator);
		}
		
		loggy.startSimulation=function(){
			loggy.injectTrade()
			simulator = $timeout(loggy.startSimulation,3000);
		}
		
        loggy.injectTrade= function(){
			
			var tradeId = Math.floor((Math.random() * 1000) + 1)
			var instrumentPrice =Math.round ((6.32+(Math.random()/10)) * 100) / 100;
			var instrumentId = googlePriceArray[Math.round(Math.random())].t
			
			var mockTrade = loggy.getTestedObject(tradeId);
			
			mockTrade.id = tradeId;		
			mockTrade.instrument.price = instrumentPrice;
			mockTrade.instrument.id = instrumentId;
			
            console.log("injecting trade: "+angular.toJson(mockTrade));
			loggy.asyncTest(mockTrade);
			
        };
		
		loggy.getTestedObject = function(id){
			 for (var i = 0; i < loggy.testedTrades.length;i++) {
				 if(loggy.testedTrades[i].id == id){
					 return loggy.testedTrades[i];
				 }
			 }
			 var clonedTrade = loggy.cloneJSON(defaultTrade);
			 loggy.testedTrades.push(clonedTrade);
			 return clonedTrade;
		}

		loggy.cloneJSON = function(obj) {
			return JSON.parse(JSON.stringify(obj));
		};
		loggy.calculateLogMessages = function(trade){
			var i;
			angular.forEach(trade.log,function(message){    			
				if(message.type == "warning"){
					if(i == undefined){
						i=0;
					}
					i=i+1;
				}
			});
			return i;
		}
    });