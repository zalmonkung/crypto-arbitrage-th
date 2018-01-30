"use strict";

const ccxt = require ('ccxt');
const checkArb = require('./check-arb');
var token = 'B3s44sxg9DAHBtvktVIxtkCGbwFuNsMiT1f8zdRan09';

// Taker
// const costs = {
//  foxbit : 0.005,
//  mercado : 0.007,
//  flowbtc : 0.0035
// }

// Maker
// const costs = {
// 	foxbit : 0.0025,
// 	mercado : 0.003,
// 	flowbtc : 0.0035
// }

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

function getExchangrate(msg){
  const request = require('request');
   request({
     method: 'GET',
     uri: 'http://api.fixer.io/latest?base=USD'
     }, (err,httpResponse,body) => {
         body = JSON.parse(body);
         console.log(body);
     });
}


async function fetchDataFoxBit() {

  const foxbit = new ccxt.foxbit ();

  const market = await foxbit.fetchTicker('BTC/BRL');

  return {
      name: 'foxbit',
      cost: 0.005,
      bid: market.bid*9.94,
      ask: market.ask*9.94
  };
};

async function fetchDataMercadoBitcoin() {

  const mercado = new ccxt.mercado();

  const market = await mercado.fetchTicker('BTC/BRL');

  return {
      name: 'mercado',
      cost: 0.007,
      bid: market.bid*9.94,
      ask: market.ask*9.94
  };
};

async function fetchDataFlowBTC() {

  const flowbtc = new ccxt.flowbtc();

  const market = await flowbtc.fetchTicker('BTC/BRL');

  return {
      name: 'flowbtc',
      cost: 0.0035,
      bid: market.bid,
      ask: market.ask
  };
};

async function fetchDataBX() {

  const bxbtc = new ccxt.bxinth();

  //const market = await bxbtc.fetchOrderBook('BTC/THB');
  const market = await bxbtc.fetchTicker('BTC/THB');
  //console.log(market.asks[0][0]);
  //console.log(market);
  /*
  console.log({
      name: 'bxbtc',
      cost: 0.0005,
      bid: market.bid,
      ask: market.ask
  });*/
  /*
  return {
      name: 'bxbtc',
      cost: 0.0005,
      bid: market.bids[0][0],
      ask: market.asks[0][0]
  };*/
  return {
      name: 'bxbtc',
      cost: 0.0005,
      bid: market.bid,
      ask: market.ask
  };

};

async function fetchDataCEX() {

  const cexbtc = new ccxt.cex();

  const market = await cexbtc.fetchTicker('BTC/USD');
  //console.log(market.bid);
  return {
      name: 'cexbtc',
      cost: 0.001,
      bid: market.bid*31.46,
      ask: market.ask*31.46
  };
};

async function fetchDataCOINCHECK() {

  const coincheckbtc = new ccxt.coincheck();

  const market = await coincheckbtc.fetchTicker('BTC/JPY');
  //console.log(market);
  
  return {
      name: 'coincheckbtc',
      cost: 0.001,
      bid: market.bid*0.29,
      ask: market.ask*0.29
  };
};

async function fetchDataBithumb() {

  const bithumb = new ccxt.bithumb();

  const market = await bithumb.fetchTicker('BTC/KRW');
  /*console.log({
      name: 'bithumb',
      cost: 0.005,
      bid: market.bid*0.029,
      ask: market.ask*0.029
  });*/
  return {
      name: 'bithumb',
      cost: 0.005,
      bid: market.bid*0.029,
      ask: market.ask*0.029
  };
};

async function fetchDataBitflyer() {

  const bitflyerbtc = new ccxt.bitflyer();

  const market = await bitflyerbtc.fetchTicker('BTC/JPY');
  //console.log(market);
  
  return {
      name: 'bitflyerbtc',
      cost: 0.001,
      bid: market.bid*0.29,
      ask: market.ask*0.29
  };
};

async function fetchDatabitfinex() {

  const bitfinexbtc = new ccxt.bitfinex();

  const market = await bitfinexbtc.fetchTicker('BTC/USD');
  //console.log(market);
  
  return {
      name: 'bitfinexbtc',
      cost: 0.001,
      bid: market.bid*31.46,
      ask: market.ask*31.46
  };
};

async function fetchData() {

    console.log('Looking for opportunities ....');

    try {

        const dataFoxBit = await fetchDataFoxBit();
        const dataMercadoBitcoin = await fetchDataMercadoBitcoin();
        const databx = await fetchDataBX();
        const datacex = await fetchDataCEX();
        const datacoincheck = await fetchDataCOINCHECK();
        const databithumb = await fetchDataBithumb();
        const databitflyer = await fetchDataBitflyer();
        const databitfinex = await fetchDatabitfinex();
        //const dataFlowBTC = await fetchDataFlowBTC();

        Promise.all([
          await fetchDataFoxBit(), 
          await fetchDataMercadoBitcoin(), 
          await fetchDataBX(),
          await fetchDataCEX(),
          await fetchDataCOINCHECK(),
          await fetchDataBithumb(),
          await fetchDataBitflyer(),
          await fetchDatabitfinex(),
          // await fetchDataFlowBTC()
          ])
          .then((response) => {
              checkArb(response);
              console.log('Waiting 1 minute to search for opportunity again.')
              setTimeout(fetchData, 60000);
          })
          .catch((err)=> {
              console.error(`Erro: ${err.message}`);
              console.log('Waiting 1 minute to search for opportunity again.')
              setTimeout(fetchData, 60000);
          });
    }

    catch (err) {
        console.error(err.message);
        setTimeout(fetchData, 60000);
    }
    
}
//fetchDataBX();
//fetchDataCEX();
//fetchDataCOINCHECK();
//fetchDataBithumb();
//sendLine("Hello");
//getExchangrate();
//fetchDataBitflyer();
//fetchBitfinex();
fetchData();