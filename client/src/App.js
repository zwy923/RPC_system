import React, { useState } from 'react';
import { Grid, Paper } from '@mui/material/';
import TopicSelector from './components/TopicSelector';
import NotesList from './components/NoteList';
import NewNoteForm from './components/NewNote';
import WikipediaSearch from './components/WikiResult';

function App() {
  const [selectedTopic, setSelectedTopic] = useState('');

  const handleTopicChange = topic => {
    setSelectedTopic(topic);
  };

  const handleNoteSubmit = () => {
    // Refresh the notes list when a new note is added
    setSelectedTopic(selectedTopic);
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper>
            <TopicSelector onChange={handleTopicChange} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper>
            {selectedTopic ? (
              <NotesList topic={selectedTopic} />
            ) : (
              <div>Please select a topic</div>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper>
            {selectedTopic ? (
              <NewNoteForm topic={selectedTopic} onSubmit={handleNoteSubmit} />
            ) : (
              <div>Please select a topic</div>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <WikipediaSearch />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
