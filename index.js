const fetch = require('node-fetch');
const fs = require('fs');
const prompt = require('prompt');

function repeatRequest(url, numRequests) {

  function makeRequest(url, currentIteration) {
    if (currentIteration === numRequests) {
      logTestDetails(url, numRequests);
      return;
    }

    fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      makeRequest(url, ++currentIteration);
    });
  }

  makeRequest(url, 0);
}

function logTestDetails(url, numRequests) {
  const details = `url: ${url}
end time: ${new Date().toString()}
requests made: ${numRequests}\n\n`;
  fs.appendFile('test-details.txt', details, (err) => {
    if (err) throw err;
    console.log('Check test-details.txt for details of this test case.');
  });
}

prompt.start();
prompt.get([{
    description: 'URL',
    name: 'url',
    type: 'string',
    required: true,
  }, {
    description: 'Number of requests',
    name: 'requests',
    type: 'integer',
    message: 'Please enter a valid integer.',
    required: true,
  }], (err, result) => {
    repeatRequest(result.url, Number(result.requests));
});
