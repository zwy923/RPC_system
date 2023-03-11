import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText } from '@mui/material/';
import axios from 'axios';

function NotesList({ topic }) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:1234/notes/${topic}`)
      .then(response => {
        setNotes(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [topic]);

  return (
    <div>
      <List>
        {notes.map(note => (
          <ListItem key={note.$.name}>
            <ListItemText
              primary={note.$.name}
              secondary={note.text}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default NotesList;