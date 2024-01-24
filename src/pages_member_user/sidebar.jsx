import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faSignOutAlt, faChalkboardTeacher, faUserFriends, faUserGraduate, faSchool } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SideNav, { NavIcon, NavItem, NavText } from '@trendmicro/react-sidenav';
import React, { useEffect, useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Idx, apiUrl, getRequest, token } from '../links/links';
import { Nav } from 'react-bootstrap';
import ClickOutside from 'react-click-outside';

library.add(faHome,
    faSignOutAlt,
    faChalkboardTeacher,
    faUserFriends,
    faUserGraduate,
    faSchool
);

export default function SideBar({ location, history }) {

    const [loggedIn, setloggedIn] = useState(true);
    const [expanded, setexpanded] = useState(false);
    const [link, setlink] = useState('classes');

    const token = JSON.parse(sessionStorage.getItem('userData')).token.Api_token;

    const signOut = () => {
        fetch(`${apiUrl}signout`, getRequest(token))
        .then(r => r.json())
        .then(r => console.log(r))
        sessionStorage.setItem('userData', null);
        sessionStorage.clear();
        //console.log(loggedIn);
        setloggedIn(false)
    }

    useEffect(() => {
        //console.log(loggedIn)
    }, [loggedIn])
    /**/
    if (!loggedIn) {
        return <Redirect to='/login' />
    }

    return (
        <ClickOutside
            onClickOutside={() => {
                setexpanded(false)
            }}
        >
            <SideNav
                expanded={expanded}
                onToggle={(expnd) => {
                    setexpanded(expnd);
                }}
                onSelect={(selected) => {
                    // Add your code here
                    //window.location.replace(`/${selected}`);
                    //console.log(location.pathname.substr(1,location.pathname.length-1));
                    //return <Redirect to={`/${selected}`} />
                    var to = `/${selected}`;
                    if (location.pathname !== to) {
                        switch (selected) {
                            case 'signout': signOut();
                                break;
                            default: history.push(to)
                        }
                    }
                }}
            >
                <SideNav.Toggle />
                <SideNav.Nav selected={location.pathname.substr(1,location.pathname.length-1)}>
                    {
                        Item.map(i =>
                            <NavItem key={Idx(Item, i)} eventKey={i.eventKey}>
                                <NavIcon>
                                    <Link to={`/${i.eventKey}`}>
                                        <FontAwesomeIcon icon={['fas', i.icon]} style={{ fontSize: '1.75em' }} />
                                    </Link>
                                </NavIcon>
                                <NavText>
                                    <Link to={`/${i.eventKey}`}>
                                        {i.label}
                                    </Link>
                                </NavText>
                            </NavItem>
                        )
                    }
                </SideNav.Nav>
            </SideNav>
        </ClickOutside>
    )
}

const Item = [
    { eventKey: 'classes', icon: 'school', label: 'Classes' },
    { eventKey: 'parents', icon: 'chalkboard-teacher', label: 'Parents' },
    { eventKey: 'teachers', icon: 'user-friends', label: 'Professeurs' },
    { eventKey: 'students', icon: 'user-graduate', label: 'Eleves' },
    { eventKey: 'signout', icon: 'sign-out-alt', label: 'Déconnexion' }
]