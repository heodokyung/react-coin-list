import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Coin from './routes/Coin';
import Coins from './routes/Coins';
interface I_ToggleRouterProps {}
function Router({}: I_ToggleRouterProps) {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route path={process.env.PUBLIC_URL + '/:coinId'}>
            <Coin />
          </Route>
          <Route path={process.env.PUBLIC_URL}>
            <Coins />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default Router;
