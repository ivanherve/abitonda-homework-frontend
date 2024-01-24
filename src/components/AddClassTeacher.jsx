import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import swal from "sweetalert";
import { apiUrl, getRequest, Idx, postAuthRequest } from "../links/links";

export function ModalAddClassTeacher(props) {
    const [isOld, setisOld] = useState(false);
    const [teachers, setteachers] = useState([]);
    const [profiles, setprofiles] = useState([]);
    const [firstname, setfirstname] = useState('');
    const [lastname, setlastname] = useState('');
    const [Email, setEmail] = useState('');
    const [password, setpassword] = useState('');
    const [confPassword, setconfPassword] = useState('');
    const [teacherId, setteacherId] = useState('');
    const [classe, setclasse] = useState('');

    const getProfiles = () => {
        fetch(`${apiUrl}getprofiles`, getRequest(JSON.parse(sessionStorage.getItem('userData')).token.Api_token))
            .then(r => r.json())
            .then(r => {
                if (r.status) {
                    setprofiles(r.response);
                }
            })
    }

    const getTeachers = () => {
        fetch(`${apiUrl}getteachers`, getRequest(JSON.parse(sessionStorage.getItem('userData')).token.Api_token))
            .then(r => r.json())
            .then(r => {
                if (r.status) {
                    setteachers(r.response);
                    setteacherId(r.response[0].Professor_Id)
                }
            })
    }

    const findTeacher = (e) => {
        let nameArray = e.target.value.split(' ');
        let lastnameArray = [];
        nameArray.map(n => {
            if (n !== nameArray[0]) {
                lastnameArray.push(n);
            }
            return lastnameArray;
        })
        let theLastname = lastnameArray.join(" ");
        //console.log(lastnameArray);
        let tId = -1;
        teachers.map(t => {
            if (t.Firstname === nameArray[0]) {
                if (t.Lastname === theLastname) tId = t.Professor_Id;
            }
            return tId;
        })
        return tId;
    }

    const addClass = () => {
        let data = new FormData();
        data.append('class', classe.toUpperCase());
        data.append('teacherId', teacherId);
        data.append('firstname', firstname);
        data.append('lastname', lastname);
        data.append('email', Email);
        data.append('password', password);
        data.append('confPassword', confPassword === password);
        data.append('isOld', isOld);
        fetch(`${apiUrl}addclass`, postAuthRequest(JSON.parse(sessionStorage.getItem('userData')).token.Api_token, data))
            .then(r => r.json())
            .then(r => {
                if (r.status) swal('Parfait!', r.response, 'success').then(() => window.location.reload())
                else {
                    swal('Erreur!', r.response, 'warning');
                    console.log(teacherId)
                }
            })
    }

    useEffect(() => {
        if (teachers.length < 1) getTeachers();
        if (profiles.length < 1) getProfiles();
    }, [teachers, profiles])

    return (
        <Modal
            show={props.show}
            onHide={props.hide}
            centered
            size='xl'
        >
            <Modal.Header>
                <Modal.Title>Ajouter une classe</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group as={Row} controlId="formPlaintextClassName">
                        <Form.Label column sm="2">
                            Classe
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control placeholder="CE1" onChange={e => setclasse(e.target.value)} />
                        </Col>
                    </Form.Group>
                    <hr />
                    <fieldset>
                        <Form.Group as={Row}>
                            <Form.Label as="legend" column sm={2}>

                            </Form.Label>
                            <Col>
                                <Form.Check
                                    type="radio"
                                    label="Nouveau professeur"
                                    name="formHorizontalRadios"
                                    id="NewTeacher"
                                    onChange={() => setisOld(false)}
                                    checked={!isOld}
                                />
                            </Col>
                            <Col>
                                <Form.Check
                                    type="radio"
                                    label="Ancien professeur"
                                    name="formHorizontalRadios"
                                    id="OldTeacher"
                                    onChange={() => setisOld(true)}
                                />
                            </Col>
                        </Form.Group>
                    </fieldset>
                    {
                        isOld
                            ?
                            <Form.Group as={Row} controlId="formTeacher">
                                <Form.Label column sm="2">
                                    Professeur
                                </Form.Label>
                                <Col sm="10">
                                    <Form.Control as="select" onChange={e => setteacherId(findTeacher(e))}>
                                        {
                                            teachers.map(t =>
                                                <option key={Idx(teachers, t)}>
                                                    {t.Firstname} {t.Lastname}
                                                </option>
                                            )
                                        }
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                            :
                            <div>
                                <Form.Group as={Row} controlId="formPlaintextTeacherFirstname">
                                    <Form.Label column sm="2">
                                        Prénom du professeur
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control placeholder="Prénom" onChange={e => setfirstname(e.target.value)} />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="formPlaintextTeacherLastname">
                                    <Form.Label column sm="2">
                                        Nom du professeur
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control placeholder="Nom" onChange={e => setlastname(e.target.value)} />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="formPlaintextTeacherEmail">
                                    <Form.Label column sm="2">
                                        Adresse e-mail
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control type="email" placeholder="adresse@email.com" onChange={e => setEmail(e.target.value)} />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="formPlaintextTeacherProfil">
                                    <Form.Label column sm="2">
                                        Profile
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control
                                            as="select"
                                            disabled
                                        >
                                            {
                                                profiles.map(p =>
                                                    <option key={Idx(profiles, p)}>
                                                        {p.Profil}
                                                    </option>
                                                )
                                            }
                                        </Form.Control>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="formPlaintextTeacherPassword">
                                    <Form.Label column sm="2">
                                        Mot de passe
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control type="password" placeholder="password" onChange={e => setpassword(e.target.value)} />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="formPlaintextTeacherConfirmPassword">
                                    <Form.Label column sm="2">
                                        Confirmer le mot de passe
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control type="password" placeholder="password" onChange={e => setconfPassword(e.target.value)} />
                                    </Col>
                                </Form.Group>
                            </div>
                    }
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="outline-warning"
                    onClick={() => addClass()}
                >
                    Ajouter
                </Button>
            </Modal.Footer>
        </Modal>
    )
}