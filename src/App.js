import React, { Component } from "react";
import LoginPage from "./pages_anonyme_user/LoginPage";
import Layout from "./pages_member_user/layout";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import moment from 'moment';
import { KigaliTimeZone } from "./links/links";

library.add(fab);
moment().utcOffset(KigaliTimeZone);

export default class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/login" name="Login Page" component={LoginPage} />
                    <Route path="/" name="Accueil" render={({ location, history }) => <Layout location={location} history={history} />} />
                </Switch>
            </Router>
        )
    }
}