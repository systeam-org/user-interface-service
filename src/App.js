import React from "react";
import { Router, Route } from "react-router-dom";
import Callback from "./routes/Callback";
import Home from "./routes/Home";
import Buyer from "./routes/buyer";
import Vendor from "./routes/vendor";

import { createBrowserHistory } from "history";

const history = createBrowserHistory();

const App = () => (
  <Router history={history}>
    <Route exact path="/" component={Home} />
    <Route exact path="/callback" component={Callback} />
    <Route path="/buyer" component={Buyer} />
    <Route path="/vendor" component={Vendor} />
  </Router>
);

export default App;
