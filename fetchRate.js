var fs = require('fs');

function getExchangrate(msg){
  const request = require('request');
   request({
     method: 'GET',
     uri: 'http://api.fixer.io/latest?base=USD'
     }, (err,httpResponse,body) => {
         //body = JSON.parse(body);
         fs.writeFile('Exchangrate.txt', body, 'utf-8', function(err){
		if (err) throw err;
 	 	//console.log('The file has been saved!');
	})
         //console.log(body);

     });
}

setTimeout(getExchangrate, 6*60*60000);
