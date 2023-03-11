import React, { useEffect, useState } from 'react';
import { Grid, Paper, TextField } from '@mui/material/';
import TopicSelector from './components/TopicSelector';
import NotesList from './components/NoteList';
import NewNoteForm from './components/NewNote';
import WikipediaSearch from './components/WikiResult';
import axios from 'axios';

function App() {
  const [selectedTopic, setSelectedTopic] = useState('');

  const handleTopicChange = topic => {
    setSelectedTopic(topic);
  };

  const handleNoteSubmit = () => {
    // Refresh the notes list when a new note is added
    window.location.reload()
    setSelectedTopic(selectedTopic);
  };


  useEffect(()=>{
    axios.get('http://localhost:1234/topics')
      .then(response => {
        setSelectedTopic(response.data[0]);
      })
      .catch(error => {
        console.log(error);
      });
  },[])



  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{margin:2}}>
            <p style={{ margin: '2px' }}>Topic:</p>
            <TopicSelector onChange={handleTopicChange} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{margin:2}}> 
            {selectedTopic ? (
              <div>Notes:<NotesList topic={selectedTopic} /></div>
            ) : (
              <div>Please select a topic</div>
            )}
          </Paper>
        </Grid>
        <Grid  item xs={12} md={6}>
          <Paper sx={{margin:2}}>
            {selectedTopic ? (
              <NewNoteForm topic={selectedTopic} onSubmit={handleNoteSubmit} />
            ) : (
              <div>Please select a topic</div>
            )}
          </Paper>
        </Grid>
        <Grid sx={{margin:2}} item xs={12}>
          <Paper>
            <WikipediaSearch />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
