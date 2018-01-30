"use strict";

var _ = require('lodash');
var fs = require('fs');
var beep = require('beepbeep');
var token = 'B3s44sxg9DAHBtvktVIxtkCGbwFuNsMiT1f8zdRan09';


function sendLine(msg){
  const request = require('request');
   request({
     method: 'POST',
     uri: 'https://notify-api.line.me/api/notify',
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
  },
     'auth': {
       'bearer': token
  },form: {
       message: msg,
    }
  }, (err,httpResponse,body) => {
  });
   console.log("sendLine : "+msg);
}

function checkOpportunity (prices) {	

	let amount = 0.25


	console.log("Bx Bid (sell price) = "+prices[2].bid);
	var txtPrices = JSON.stringify(prices);
	fs.writeFile('lastFetchedData.txt', txtPrices, 'utf-8', function(err){
		if (err) throw err;
 	 	// console.log('The file has been saved!');
	})


	var bestBid = _.maxBy(prices, function(item){ return item.bid })
	var bestAsk = _.minBy(prices, function(item){ return item.ask })

	console.log(`Best bid (sell price): ${bestBid.bid}`);
	console.log(`Best ask (buy  price): ${bestAsk.ask}`);

	
	if ( bestBid.bid > bestAsk.ask ) {
		
		console.log('Possible Opportunities. Checking cost to buy '+amount+' bitcoins....');
		
		var priceDifference = (bestBid.bid * amount) - (bestAsk.ask * amount);
		console.log('Earnings in arbitration: Bath', priceDifference.toFixed(2), 'buying in',bestAsk.name, 'per: Bath', bestAsk.ask ,'and selling on',bestBid.name, 'per: Bath', bestBid.bid);
		sendLine('Earnings in arbitration: Bath'+ priceDifference.toFixed(2)+ 'buying in'+bestAsk.name+ 'per: Bath'+ bestAsk.ask +'and selling on'+bestBid.name+ 'per: Bath'+ bestBid.bid);


		var buyCost = bestAsk.ask * amount * bestAsk.cost;
		// console.log('Custo Compra: ', buyCost);
		var sellCost = bestBid.bid * amount * bestBid.cost;
		// console.log('Custo Venda: ', sellCost);
		var totalCost = buyCost + sellCost;
		console.log('Total Cost of Charges: ', totalCost.toFixed(2));

		console.log('What makes a difference', (priceDifference.toFixed(2) - totalCost.toFixed(2)).toFixed(2) );

		if (totalCost < priceDifference)  {
			console.log('Shop at', bestAsk.name, 'and sale on', bestBid.name );
			//beep(2)
		} else {
			console.log('The cost does not justify', '\n\n');
		}

	} else {
		console.log('There are no opportunities', '\n\n')
	}


}

module.exports = checkOpportunity;



//Teste
// checkOpportunity(
// 	[
// 	   {
// 	      "name":"foxbit",
// 	      "cost":0.005,
// 	      "bid":9000,
// 	      "ask":8000.01
// 	   },
// 	   {
// 	      "name":"mercado",
// 	      "cost":0.007,
// 	      "bid":12196,
// 	      "ask":13229.8
// 	   },
// 	   {
// 	      "name":"flowbtc",
// 	      "cost":0.0035,
// 	      "bid":11800,
// 	      "ask":11945
// 	   }
// 	]
// )