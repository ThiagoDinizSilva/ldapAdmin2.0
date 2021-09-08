import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { isAuthenticated } from "./services/auth";
import Login from "./pages/Login";
import Err404 from "./pages/Err404";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Usuarios from "./pages/Usuarios";
import Grupos from "./pages/Grupos";
import Configuracoes from "./pages/Configuracoes";



const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      )
    }
  />
);


function Routes() {
  if (!isAuthenticated()) {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Login} />
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    );
  }
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/404" component={Err404} />
        <Route>
          <Navbar />
          <Switch>
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/usuarios" component={Usuarios} />
            <Route exact path="/grupos" component={Grupos} />
            <Route exact path="/config" component={Configuracoes} />
            <Redirect exact path="/" to="/dashboard" />
            <Redirect to="/404" />
          </Switch>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;

/*
const Routes = () => (
  <BrowserRouter>
    {isAuthenticated() ? <Navbar /> : <Route exact path="/" component={Login} />}
    <Switch>
      <PrivateRoute path="/app" component={Dashboard} />
      <Route path="*" component={Err404} />
    </Switch>
  </BrowserRouter>
); */