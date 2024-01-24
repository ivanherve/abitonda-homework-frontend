import React, { useState } from 'react';
import { Container, Navbar } from 'react-bootstrap';
import Switch from 'react-bootstrap/esm/Switch';
import { Redirect, Route } from 'react-router-dom';
import { Classe } from '../components/classes';
import { Parents } from '../components/parents';
import { Students } from '../components/students';
import { Teachers } from '../components/teachers';
import { Statistic } from '../components/statistic';
import Header from './header';

let i = 0;
export default function Layout() {
    const [variantColor, setvariantColor] = useState('');
    const changeColor = () => {
        let colors = [
            'info', 'warning', 'danger', 'primary', 'secondary', 'light'
        ]
        if (i === colors.length) i = 0;
        setvariantColor(colors[i + 1]);
        //console.log(colors[i++])
    }

    if (!sessionStorage.getItem('userData')) {
        return <Redirect to='/login' />
    }

    if (JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id < 2) {
        return <Redirect to='/login' />
    }

    return (
        <div>
            {/*<SideBar location={location} history={history} />*/}
            <Header />
            <div style={{ padding: '80px 0px 20px 0px', height: '100vh' }}>
                <Container>
                    <Switch style={{ height: '100%', paddingBottom: '200px', marginBottom: '200px' }}>
                        {
                            (JSON.parse(sessionStorage.getItem('userData')).user.Professor_Id !== null || JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2)
                            &&
                            <Route path='/classes' component={Classe} />
                        }
                        {
                            JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2
                                ?
                                <Route path='/parents' component={Parents} />
                                :
                                (
                                    JSON.parse(sessionStorage.getItem('userData')).user.Parent_Id !== null
                                    &&
                                    <Route path={`/parent/${JSON.parse(sessionStorage.getItem('userData')).user.User_Id}`} component={Parents} />
                                )
                        }
                        {
                            JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2
                                ?
                                <Route path='/employees' component={Teachers} />
                                :
                                (
                                    JSON.parse(sessionStorage.getItem('userData')).user.Professor_Id !== null
                                    &&
                                    <Route path={`/teacher/${JSON.parse(sessionStorage.getItem('userData')).user.User_Id}`} component={Teachers} />
                                )
                        }
                        {
                            (JSON.parse(sessionStorage.getItem('userData')).user.Parent_Id !== null || JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2)
                            &&
                            <Route path='/students' component={Students} />
                        }
                        {
                            /**/
                            JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2
                            &&
                            <Route path='/statistics' component={Statistic} />
                            
                        }
                        {
                            window.location.pathname === "/"
                            &&
                            (
                                JSON.parse(sessionStorage.getItem('userData')).user.Parent_Id !== null
                                    ?
                                    <Redirect to="/students" />
                                    :
                                    <Redirect to="/classes" />
                            )
                        }
                    </Switch>
                </Container>
                <Navbar fixed="bottom" variant="primary" bg={variantColor} style={{ marginTop: '20px' }} onClick={() => changeColor()}>
                    <Navbar.Text>
                        {JSON.parse(sessionStorage.getItem('userData')).user.Firstname} {JSON.parse(sessionStorage.getItem('userData')).user.Lastname}
                    </Navbar.Text>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            <div style={{ color: JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2 ? 'red' : 'blue' }}>
                                {JSON.parse(sessionStorage.getItem('userData')).user.Profil}
                            </div>
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        </div>
    )
}