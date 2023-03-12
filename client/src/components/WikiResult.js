import React, { useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Link } from '@mui/material/';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

function WikipediaSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = event => {
    event.preventDefault();
    axios.get(`http://localhost:1234/wikipedia/${query}`)
      .then(response => {
        setResults(response.data.map(result => ({...result, id: uuidv4()})));
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField sx={{margin:2}}
          label="Search Wikipedia"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <Button type="submit" color="primary" sx={{margin:2}}>Search</Button>
      </form>
      <List sx={{margin:2}}>
        {results.map(result => (
          <ListItem key={result.id}>
            <div href={result.fullurl} target="_blank" rel="noreferrer">
              <Link href={result.url}>{result.title}</Link>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default WikipediaSearch;
