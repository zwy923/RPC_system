import React, { useState, useEffect } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';


function TopicSelector({ onChange }) {

  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');

  useEffect(() => {
    axios.get('http://localhost:1234/topics')
      .then(response => {
        setTopics(response.data);
        setSelectedTopic(response.data[0]);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleTopicChange = event => {
    setSelectedTopic(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div >
      <Select sx={{margin:2}}
        value={selectedTopic}
        onChange={handleTopicChange}
      >
        {topics.map(topic => (
          <MenuItem sx={{margin:2}} value={topic} key={topic}>{topic}
          </MenuItem>
          
        ))}
      </Select>
      
    </div>
  );
}

export default TopicSelector;
