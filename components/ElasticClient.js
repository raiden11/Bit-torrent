const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log : [{
    type: 'console',
    levels: [] // change these options
  }]
});

export default client;