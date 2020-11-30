import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import thunk from 'redux-thunk';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import burgerBuilderReducer from './store/reducers/burgerBuilder';
import orderReducer from './store/reducers/order';
import authReducer from './store/reducers/auth';
// //middleware
// const logger = (store) => {
//   return next => {
//     return action => {
//         console.log('middleware dispatching', action);
//         //action continue to reducer
//         const result = next(action);
//         console.log('[middleware] next state', store.getState());
//         return result;
//     }
//   }
// }
const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;
const rootReducer = combineReducers({
  burgerBuilder: burgerBuilderReducer,
  order: orderReducer,
  auth: authReducer
})
const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunk)
));

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>
)

ReactDOM.render(
  <React.StrictMode>
    {app}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
