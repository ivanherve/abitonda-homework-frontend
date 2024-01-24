import { library } from '@fortawesome/fontawesome-svg-core';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, Nav, Navbar } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import { apiUrl, getRequest } from '../links/links';

library.add(
    faSignOutAlt
)

export default function Header() {
    const [loggedIn, setloggedIn] = useState(true);

    const signOut = () => {
        fetch(`${apiUrl}signout`, getRequest(JSON.parse(sessionStorage.getItem('userData')).token.Api_token))
            .then(r => r.json())
            .then(r => {
                //console.log(r)
            })
        sessionStorage.setItem('userData', null);
        sessionStorage.clear();
        //console.log(loggedIn);
        setloggedIn(false)
    }

    /**/
    if (!loggedIn) {
        return <Redirect to='/login' />
    }

    return (
        <Navbar collapseOnSelect expand="lg" bg="danger" variant="dark" fixed='top'>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Item>
                        <Link className="nav-link" to="/classes"></Link>
                    </Nav.Item>
                    {
                        (JSON.parse(sessionStorage.getItem('userData')).user.Professor_Id !== null || JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2)
                        &&
                        <Nav.Link href="/classes">Classes</Nav.Link>
                    }
                    {
                        (JSON.parse(sessionStorage.getItem('userData')).user.Parent_Id !== null || JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2)
                        &&
                        <Nav.Link href="/students">Eleves</Nav.Link>
                    }
                    {
                        JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2
                        ?
                        <Nav.Link href="/parents">Parents</Nav.Link>
                        :
                        (
                            JSON.parse(sessionStorage.getItem('userData')).user.Parent_Id !== null
                            &&
                            <Nav.Link href={`/parent/${JSON.parse(sessionStorage.getItem('userData')).user.User_Id}`}>
                                Profil-Parent
                            </Nav.Link>
                        )
                    }
                    {
                        JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2
                            ?
                            <Nav.Link href="/employees">Employées</Nav.Link>
                            :
                            (
                                JSON.parse(sessionStorage.getItem('userData')).user.Professor_Id !== null
                                &&
                                <Nav.Link href={`/teacher/${JSON.parse(sessionStorage.getItem('userData')).user.User_Id}`}>
                                    Profil-Enseignants
                                </Nav.Link>
                            )
                    }
                    {
                        /**/
                        JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2
                        &&
                        <Nav.Link href='/statistics'>Tableau de bord</Nav.Link>
                        
                    }
                </Nav>
                <Nav>
                    <Nav.Link eventKey={2}>
                        <Button variant="outline-warning" onClick={() => signOut()}><FontAwesomeIcon icon={["fas", "sign-out-alt"]} /> Déconnexion</Button>
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}