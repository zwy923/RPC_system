var express = require('express');
var router = express.Router();

const xml2js = require('xml2js');
const axios = require('axios');


// Set up route for creating new notes
router.post('/notes', (req, res) => {
  // Parse the XML data from the mock database file
  xml2js.parseString(req.body.xmlData, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error parsing XML data');
    } else {
      // Check if the topic already exists in the XML file
      const topic = req.body.topic;
      const note = {
        name: req.body.noteName,
        text: req.body.noteText,
        timestamp: req.body.noteTimestamp
      };
      let topicExists = false;
      for (let i = 0; i < result.data.topic.length; i++) {
        if (result.data.topic[i].$.name === topic) {
          topicExists = true;
          result.data.topic[i].note.push(note);
          break;
        }
      }
      // If the topic doesn't exist, create a new XML entry for it
      if (!topicExists) {
        const newTopic = {
          $: {
            name: topic
          },
          note: [note]
        };
        result.data.topic.push(newTopic);
      }
      // Convert the XML data back to a string and send it in the response
      const builder = new xml2js.Builder();
      const newXmlData = builder.buildObject(result);
      res.send(newXmlData);
    }
  });
});

// Set up route for retrieving notes based on topic
router.get('/notes', (req, res) => {
  // Parse the XML data from the mock database file
  xml2js.parseString(req.body.xmlData, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error parsing XML data');
    } else {
      // Search the XML data for the given topic and return the results
      const topic = req.query.topic;
      let notes = [];
      for (let i = 0; i < result.data.topic.length; i++) {
        if (result.data.topic[i].$.name === topic) {
          notes = result.data.topic[i].note;
          break;
        }
      }
      res.send(notes);
    }
  });
});

// Set up route for querying Wikipedia API for more information on a given topic
router.get('/wikipedia', (req, res) => {
  const searchTerm = req.query.searchTerm;
  const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${searchTerm}&format=json&origin=*`;
  axios.get(url)
    .then(response => {
      const data = response.data;
      const searchResults = {
        searchTerm: data[0],
        articles: data[1],
        descriptions: data[2],
        links: data[3]
      };
      res.send(searchResults);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error querying Wikipedia API');
    });
});
module.exports = router;
