import fetchAux from './fetchAux';
import { store } from '../redux';

const SERVER_URL = {
  local: "http://127.0.0.1:8000/api",
  casa: "http://192.168.1.6:8003/api",
  trampo: "http://192.168.0.11:8001/api",
  fernando: "http://192.168.0.11:800/api"
}['fernando'];

async function requester(endpoint, params = null, method = 'GET') {
  console.debug(`SERVER ${method} REQUEST: ${endpoint}`);

  const apiToken = store.getState().apiToken;

  const resp = await fetchAux[method.toLowerCase()](
    SERVER_URL,
    endpoint,
    params,
    apiToken
  );

  console.debug(`SERVER ${method} ${endpoint} RESPONSE: `, resp);

  return resp;
}

function get(endpoint, params = null) {
  return requester(endpoint, params, 'GET');
}

function post(endpoint, params = null) {
  return requester(endpoint, params, 'POST');
}

function patch(endpoint, params = null) {
  return requester(endpoint, params, 'PATCH');
}

function del(endpoint, params = null) {
  return requester(endpoint, params, 'DEL');
}


export default {
  get, post, patch, del
}

