import React from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import ReduxThunk from "redux-thunk";
import P2PRoom from "./components/P2PRoom";
import reducers from "./reducers";
import Router from "./Router";

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(ReduxThunk))
);

const Root = () => (
  <Provider store={store}>
    <P2PRoom>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </P2PRoom>
  </Provider>
);

export default Root;
