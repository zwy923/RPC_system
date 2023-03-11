import React, { useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText } from '@mui/material/';
import axios from 'axios';

function WikipediaSearch({ onSubmit }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = event => {
    event.preventDefault();
    axios.get(`http://localhost:1234/wikipedia/${query}`)
      .then(response => {
        setResults(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Search Wikipedia"
          value={query}
          onChange={event => setQuery(event.target.value)}
          fullWidth
        />
        <Button type="submit" color="primary">Search</Button>
      </form>
      <List>
        {results.map(result => (
          <ListItem key={result.pageid}>
            <a href={result.fullurl} target="_blank" rel="noreferrer">
              <ListItemText primary={result.title} secondary={result.snippet} />
            </a>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default WikipediaSearch;
