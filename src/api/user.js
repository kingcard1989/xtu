// src/api/user.js
import axios from 'axios';

export function login(userInfo) {
  return axios.post('http://localhost:3000/api/login', {
    password: userInfo.password,
    stuId: userInfo.stuId,
  })
  .then(response => response.data)
  .catch(error => {
    throw error;
  });
}