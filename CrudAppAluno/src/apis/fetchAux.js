

async function fetcher(domain, endpoint, params, token, method) {
  try {
    var fullUrl = `${domain}/${endpoint}`;
    var body = undefined;
    if (method == 'GET' && params != null) {
      paramsStr = '?';
      let paramsKeys = Object.keys(params);
      paramsKeys.map((key, idx) => {
        if (params[key])
          paramsStr += `${key}=${params[key].toString()}${idx < paramsKeys.length - 1 ? '&' : ''}`
      });
      fullUrl += paramsStr;
    } else if (method != 'GET' && params != null) {
      body = JSON.stringify(params);
    }

    const resp = await fetch(fullUrl, {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: body
    });
    const respJson = await resp.json();
    return respJson;
  } catch (error) {
    console.debug(`FetchAux.${method}(${fullUrl}):`, error);
    return { error: 'Verifique sua conexão com a internet' };
  }
}


function get(domain, endpoint, params = null, token = null) {
  return fetcher(domain, endpoint, params, token, 'GET');
}

function post(domain, endpoint, params, token = null) {
  return fetcher(domain, endpoint, params, token, 'POST');
}

function patch(domain, endpoint, params, token = null) {
  return fetcher(domain, endpoint, params, token, 'PATCH');
}

function del(domain, endpoint, params, token = null) {
  return fetcher(domain, endpoint, params, token, 'DELETE');
}

export default {
  get,
  post,
  patch,
  del
}
