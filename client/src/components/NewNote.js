import React, { useState } from 'react';
import { TextField, Button } from '@mui/material/';
import axios from 'axios';

function NewNoteForm({ topic, onSubmit }) {
  const [topicName,setTopicName] = useState(topic)
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    const timestamp = new Date().toLocaleString();
    const routes = ['http://localhost:1234/notes', 'http://localhost:4321/notes'];
  
    const tryRoute = index => {
      axios.post(routes[index], { topicName, name, text, timestamp, query })
        .then(response => {
          console.log(response.data);
          onSubmit();
        })
        .catch(error => {
          if (index + 1 < routes.length) {
            tryRoute(index + 1);
          } else {
            console.log('All routes failed');
          }
        });
    };
  
    tryRoute(0);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
      <TextField sx={{margin:2,width:750}}
          label="Topic name"
          value={topicName}
          onChange={event => setTopicName(event.target.value)}
          fullWidth
          required
        />
        <TextField sx={{margin:2,width:750}}
          label="Note name"
          value={name}
          onChange={event => setName(event.target.value)}
          fullWidth
          required
        />
        <TextField sx={{margin:2,width:750}}
          label="Note text"
          value={text}
          onChange={event => setText(event.target.value)}
          fullWidth
          multiline
          rows={4}
          required
        />
        <TextField
          label="Wikipedia search" sx={{margin:2,width:750}}
          value={query}
          onChange={event => setQuery(event.target.value)}
          fullWidth
        />
        <Button sx={{margin:2}} type="submit" color="primary">Save note</Button>
      </form>
    </div>
  );
}

export default NewNoteForm;