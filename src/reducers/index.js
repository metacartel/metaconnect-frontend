import { combineReducers } from "redux";
import account from "./_account";
import metaConnection from "./_metaConnection";
import notification from "./_notification";

export default combineReducers({
  account,
  metaConnection,
  notification
});
