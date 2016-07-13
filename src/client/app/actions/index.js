import * as AT from '../constants/ActionTypes';
import _ from 'lodash';

import request from 'superagent';

export function fetchTables() {
  return (dispatch, getState) => {
    request.get('/api/tables').end((err, resp) => {
      if (err != null || !resp.ok) {
        console.error(err);
      } else {
        dispatch({type: AT.FETCH_TABLES, tableNames: resp.body});
      }
    });
  };
}

export function openTable(tableName) {
  return (dispatch, getState) => {
    request.get(`/api/describe/${tableName}`).end((err, resp) => {
      if (err != null || !resp.ok) {
        console.error(err);
      } else {
        dispatch({type: AT.OPEN_TABLE, table: resp.body.Table});
      }
    });
  };
}
