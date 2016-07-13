import _ from 'lodash';

import * as AT from '../constants/ActionTypes';

import dynamoReducer from './dynamo';

const initialState = {
  tableNames: [],
  activeTableName: null,
  tables: {}
};

export default function(state = initialState, action) {
  let newState = dynamoReducer(state, action) || state;  
  return newState;
}
