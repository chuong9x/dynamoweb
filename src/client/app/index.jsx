import React from 'react';
import {render} from 'react-dom';

import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import reducer from './reducers';
import Main from './components/Main';


let storeFunctions = [applyMiddleware(thunk)];
const store = compose(...storeFunctions)(createStore)(reducer);

class App extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}

render(<App/>, document.getElementById('root'));
