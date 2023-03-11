var express = require('express');
var router = express.Router();
const fs = require('fs');
const axios = require('axios')
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const builder = new xml2js.Builder();


// Set up route for creating new notes
router.post('/notes', (req, res) => {
  const { topic, text, name, timestamp } = req.body;
  // Parse the XML data from the file
  const xmlData = fs.readFileSync('notes.xml', 'utf8');
  parser.parseString(xmlData, (err, result) => {
    if (err) throw err;
    // Find the topic in the XML data or create a new topic if it doesn't exist
    const topicNode = result.data.topic.find(t => t.$.name === topic);
    if (!topicNode) {
      result.data.topic.push({
        $: { name: topic },
        note: []
      });
    }
    // Add the new note to the topic
    const note = {
      $: { name: `${name}` },
      text: text,
      timestamp: timestamp
    };
    result.data.topic.forEach(t => {
      if (t.$.name === topic) {
        t.note.push(note);
      }
    });
    // Convert the XML data back to a string and write it to the file
    const xmlString = builder.buildObject(result);
    fs.writeFileSync('notes.xml', xmlString);
    // Send a response to the client
    res.send('Note created successfully');
  });
});


router.get('/topics', (req, res) => {
  // Parse the XML data from the file
  const xmlData = fs.readFileSync('notes.xml', 'utf8');
  parser.parseString(xmlData, (err, result) => {
    if (err) throw err;
    // Extract the topic names from the XML data
    const topics = result.data.topic.map(t => t.$.name);
    // Send the topic names as a response to the client
    res.send(topics);
  });
});

router.get('/notes/:topic', (req, res) => {
  const { topic } = req.params;
  // Parse the XML data from the file
  const xmlData = fs.readFileSync('notes.xml', 'utf8');
  parser.parseString(xmlData, (err, result) => {
    if (err) throw err;
    // Find the topic node in the XML data
    const topicNode = result.data.topic.find(t => t.$.name === topic);
    if (!topicNode) {
      // If the topic node is not found, send a 404 error to the client
      res.status(404).send('Topic not found');
    } else {
      // Extract the notes under the topic node
      const notes = topicNode.note;
      // Send the notes as a response to the client
      res.send(notes);
    }
  });
});


router.get('/wikipedia/:query', (req, res) => {
  const { query } = req.params;
  // Make a request to the Wikipedia API using axios
  axios.get(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}&format=json`)
    .then(response => {
      // Extract the relevant information from the API response
      const [searchQuery, searchResults, searchSnippet, searchUrls] = response.data;
      // Combine the search results into an array of objects
      const results = searchResults.map((result, i) => {
        return {
          title: result,
          snippet: searchSnippet[i],
          url: searchUrls[i]
        };
      });
      // Send the results as a response to the client
      res.send(results);
    })
    .catch(error => {
      console.log(error);
      // If there's an error, send a 500 error to the client
      res.status(500).send('Error retrieving Wikipedia information');
    });
});


module.exports = router;
