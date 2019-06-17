import fetch, { RequestInit, Response } from 'node-fetch'

import request from 'request'

export default function(endpoints: string[], options?: RequestInit) {
	return Promise.all(endpoints.map(ep => fetch(ep, options)))
}

export function oldGetAll(endpoints: string[], opts?: any) {
  let promises: Promise<any>[] = []
  endpoints.map((endpoint, i) => {
    promises.unshift(
      new Promise((resolve, reject) => {
        request.get(endpoint, opts, (err, res, body) => {
          resolve(body);
        });
      })
    );
  });
  return Promise.all(promises);
}