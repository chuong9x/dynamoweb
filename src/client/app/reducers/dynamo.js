import _ from 'lodash';

import * as AT from '../constants/ActionTypes';

export default function(state, action) {
  switch(action.type) {
    case AT.FETCH_TABLES: {
      let { tableNames } = action;
      return {...state, tableNames: tableNames};
    }
    
    case AT.OPEN_TABLE: {
      let { table } = action;
      return {
        ...state,
        activeTableName: table.TableName,
        tables: {...state.tables, [table.TableName]: table}
      }
    }
  }
}
