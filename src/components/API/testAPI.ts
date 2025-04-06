import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 1000,
    headers: {'Content-Type': 'application/json'}
  });

export async function testCreateUser(data) {
    return instance.post('/user', data)
    .then(function (response) {
        // handle success
        return response.data
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });
}