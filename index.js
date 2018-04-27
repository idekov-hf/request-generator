const fetch = require('node-fetch');
const fs = require('fs');
const prompt = require('prompt');
const startTime = new Date().toString();

function backoffBrowser(url, numRequests, projId, timeout) {
  makeRequest(url, 0);
  const delay = (timeout * 1000);
  const details = `URL: ${url}\n
        Start Time: ${startTime}\n
        Delay between requests in second(s): ${timeout}\n
        Request(s) Made: ${numRequests}\n
        End Time: ${new Date().toString()}\n`;

  function makeRequest(url, currentIteration) {
    if (currentIteration === numRequests) {
      logmyTest();   
      console.log('Check test-details.txt for the deets of this test :) \n\n');  
      } else {
      letsFetch(url, currentIteration);
      }
    }

  function letsFetch(url, currentIteration) {
    /** 
        var images = []; 
        this is here for streetview testing as you cannot JSON an image response
        instead we store it by using:
        
        .then ( response => response.json())  > .then( response => images.push(response)) 

       **/ 
    var images = [];
    fetch(url)
    .then( response => response.json()) 
    .then( data => {
      console.log(data);
      setTimeout(() => makeRequest(url, ++currentIteration), delay);})
    }

  function logmyTest() {
    const myTestDetails = `Test for project ${projId}  --\n  ${details} \n\n `;

    fs.appendFile('test-details.txt', myTestDetails, (err) => {       
            if (err) throw err;})
    }
 }

prompt.start();
prompt.get([{
  description: 'URL:',
  name: 'url',
  type: 'string',
  required: true,
}, {
  description: 'Number of requests',
  name: 'requests',
  type: 'integer',
  message: 'Please enter a valid integer for the total amount of attempts:',
  required: true,
}, {
  description: 'Spice-Project Details',
  name: 'projectId',
  type: 'string',
  message: 'Please enter a ProjectID:',
  required: true,
}, {
  description: 'Delay',
  name: 'delay',
  type: 'integer',
  message: 'Delay in second(s)',
  required: true

}], (err, result) => {
    backoffBrowser(result.url, Number(result.requests), result.projectId, Number(result.delay));
    });
