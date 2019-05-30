import fetchAux from './fetchAux';
import { store } from '../redux/store';

const SERVER_URL = {
  local: "http://127.0.0.1:8000",
  testApp: "http://192.168.15.10:8003",
  fernando: "http://192.168.15.10:8002",
  casa: "http://192.168.1.6:8000"
}['testApp'];

const SERVER_API = `${SERVER_URL}/api`;

async function requester(endpoint, params = null, method = 'GET') {
  console.debug(`SERVER ${method} REQUEST: ${endpoint}`);

  const apiToken = store.getState().apiToken;

  const resp = await fetchAux[method.toLowerCase()](
    SERVER_API,
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
  get, post, patch, del,
  SERVER_URL, SERVER_API
}

