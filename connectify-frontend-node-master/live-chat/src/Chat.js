import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:8000');

function Chat() {
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMatchedUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/matched-users/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMatchedUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch matched users:', error);
      }
    };

    fetchMatchedUsers();
  }, [token]);

  // ... (rest of the component)
}
