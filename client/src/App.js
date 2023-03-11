import React, { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './App.css';

function App() {
  const [xmlData, setXmlData] = useState('');
  const [topic, setTopic] = useState('');
  const [noteName, setNoteName] = useState('');
  const [noteText, setNoteText] = useState('');
  const [noteTimestamp, setNoteTimestamp] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleCreateNote = () => {
    axios.post('localjost:1234/notes', {
      xmlData: xmlData,
      topic: topic,
      noteName: noteName,
      noteText: noteText,
      noteTimestamp: noteTimestamp
    })
      .then(response => {
        setXmlData(response.data);
        alert('Note created successfully');
      })
      .catch(error => {
        console.error(error);
        alert('Error creating note');
      });
  };

  const handleSearchNotes = () => {
    axios.get('/notes', {
      params: {
        xmlData: xmlData,
        topic: topic
      }
    })
      .then(response => {
        setSearchResults(response.data);
      })
      .catch(error => {
        console.error(error);
        alert('Error searching notes');
      });
  };

  const handleSearchWikipedia = () => {
    axios.get('/wikipedia', {
      params: {
        searchTerm: searchTerm
      }
    })
      .then(response => {
        setSearchResults(response.data);
      })
      .catch(error => {
        console.error(error);
        alert('Error searching Wikipedia');
      });
  };

  return (
    <div>
      <TextField
        label="XML Data"
        multiline
        rows={4}
        value={xmlData}
        onChange={event => setXmlData(event.target.value)}
      />
      <TextField
        label="Topic"
        value={topic}
        onChange={event => setTopic(event.target.value)}
      />
      <TextField
        label="Note Name"
        value={noteName}
        onChange={event => setNoteName(event.target.value)}
      />
      <TextField
        label="Note Text"
        multiline
        rows={4}
        value={noteText}
        onChange={event => setNoteText(event.target.value)}
      />
      <TextField
        label="Note Timestamp"
        value={noteTimestamp}
        onChange={event => setNoteTimestamp(event.target.value)}
      />
      <Button variant="contained" onClick={handleCreateNote}>Create Note</Button>
      <br/><br/>
      <TextField
        label="Search Topic"
        value={topic}
        onChange={event => setTopic(event.target.value)}
      />
      <Button variant="contained" onClick={handleSearchNotes}>Search Notes</Button>
      <br/><br/>
      <TextField
        label="Search Wikipedia"
        value={searchTerm}
        onChange={event => setSearchTerm(event.target.value)}
      />
      <Button variant="contained" onClick={handleSearchWikipedia}>Search Wikipedia</Button>
      <br/><br/>
      {searchResults.length > 0 && (
        <div>
          <h3>Search Results:</h3>
          <ul>
            {searchResults.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
  
}

export default App;
