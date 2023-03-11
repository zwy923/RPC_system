import React, { useState } from 'react';
import { TextField, Button } from '@mui/material/';
import axios from 'axios';

function NewNoteForm({ topic, onSubmit }) {
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    const timestamp = new Date().toLocaleString();
    axios.post('http://localhost:1234/notes', { topic, name, text, timestamp })
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
        <TextField
          label="Note name"
          value={name}
          onChange={event => setName(event.target.value)}
          fullWidth
        />
        <TextField
          label="Note text"
          value={text}
          onChange={event => setText(event.target.value)}
          fullWidth
          multiline
          rows={4}
        />
        <Button type="submit" color="primary">Save note</Button>
      </form>
    </div>
  );
}

export default NewNoteForm;