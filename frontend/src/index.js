import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {Provider} from "react-redux";
import store from "./store";
import { positions,transitions,Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";


const options = {
  timeout:10000,
  position:positions.BOTTOM_CENTER,
  offset:'30px',
  transitions:transitions.SCALE,
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>  
      <AlertProvider template={AlertTemplate}{...options}>
        <App />
      </AlertProvider>
    </Provider>,
  document.getElementById('root')
);
