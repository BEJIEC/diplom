import axios from 'axios';

export let http = axios.create();

http.interceptors.response.use((response) => response.data);