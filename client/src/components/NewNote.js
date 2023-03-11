import React, { useState } from 'react';
import { TextField, Button } from '@mui/material/';
import axios from 'axios';

function NewNoteForm({ topic, onSubmit }) {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    const timestamp = new Date().toLocaleString();
    axios.post('http://localhost:1234/notes', { topic, name, text, timestamp, query })
      .then(response => {
        console.log(response.data);
        onSubmit();
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField sx={{margin:2,width:750}}
          label="Note name"
          value={name}
          onChange={event => setName(event.target.value)}
          fullWidth
        />
        <TextField sx={{margin:2,width:750}}
          label="Note text"
          value={text}
          onChange={event => setText(event.target.value)}
          fullWidth
          multiline
          rows={4}
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