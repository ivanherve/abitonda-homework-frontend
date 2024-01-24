import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import { apiUrl, getRequest, Idx, postAuthRequest } from '../links/links';

export function EditClass(props) {
    const [teachers, setteachers] = useState([]);
    const [classname, setclassname] = useState('');
    const [theTeacher, settheTeacher] = useState('');
    const [disabled, setdisabled] = useState(false);
    const classe = props.classe;
    //console.log(classe);


    const findTeacher = (e) => {
        let nameArray = e.split(' ');
        let lastnameArray = [];
        let tId = -1;
        nameArray.map(n => {
            if (n !== nameArray[0]) {
                lastnameArray.push(n);
            }
            return lastnameArray;
        })
        let theLastname = lastnameArray.join(" ");
        //console.log(lastnameArray);
        /**/
        teachers.map(t => {
            if (t.Firstname === nameArray[0]) {
                if (t.Lastname === theLastname) tId = t.Professor_Id;
            }
            return tId;
        })
        return tId;
    }

    const editClass = () => {
        let data = new FormData();
        data.append('class', classe.Class);
        data.append('teacherId', theTeacher ? theTeacher : findTeacher(classe.Teacher));
        data.append('active', disabled);
        fetch(`${apiUrl}editclass`, postAuthRequest(JSON.parse(sessionStorage.getItem('userData')).token.Api_token, data))
            .then(r => r.json())
            .then(r => {
                if (r.status) swal('Parfait!', r.response, 'success').then(() => window.location.reload());
                else swal('Erreur!', r.response, 'warning')
            })
    }

    useEffect(() => {
        const findTeacher = (e) => {
            let nameArray = e.split(' ');
            let lastnameArray = [];
            let tId = -1;
            nameArray.map(n => {
                if (n !== nameArray[0]) {
                    lastnameArray.push(n);
                }
                return lastnameArray;
            })
            let theLastname = lastnameArray.join(" ");
            //console.log(lastnameArray);
            /**/
            teachers.map(t => {
                if (t.Firstname === nameArray[0]) {
                    if (t.Lastname === theLastname) tId = t.Professor_Id;
                }
                return tId;
            })
            return tId;
        }
        
        const getTeachers = () => {
            fetch(`${apiUrl}getteachers`, getRequest(JSON.parse(sessionStorage.getItem('userData')).token.Api_token))
                .then(r => r.json())
                .then(r => {
                    if (r.status) {
                        setteachers(r.response);
                        //settheTeacher(findTeacher(r.response[0].Firstname+' '+r.response[0].Lastname))
                    }
                    //console.log(r)
                })
        }

        if (teachers.length < 1) getTeachers();
        if (classname !== classe.Class) {
            setclassname(classe.Class);
            setdisabled(classe.Disabled);
        }
        if (theTeacher) {
            if (theTeacher.length < 1) settheTeacher(findTeacher(classe.Teacher));
        }
        
        //console.log(classe.Class, classname)
    }, [teachers, classname, classe, theTeacher]);

    return (
        <Modal
            show={props.show}
            onHide={props.hide}
            centered
            size="xl"
        >
            <Modal.Header>
                <Modal.Title>Modifier la classe de {classe.Class}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group as={Row} controlId="formClass">
                        <Form.Label column sm="2">
                            Classe
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control disabled placeholder={classe.Class} onChange={() => setclassname(classe.Class)} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formTeacher">
                        <Form.Label column sm="2">
                            Professeur
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control as="select" defaultValue={classe.Teacher} onChange={e => settheTeacher(findTeacher(e.target.value))}>
                                {
                                    teachers.map(t =>
                                        <option
                                            key={Idx(teachers, t)}
                                        >
                                            {t.Firstname} {t.Lastname}
                                        </option>
                                    )
                                }
                            </Form.Control>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="2">
                            Désactivé ?
                        </Form.Label>
                        <Col sm="10">
                            <Form.Check type="checkbox" checked={disabled} onChange={() => setdisabled(!disabled)} />
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-warning" onClick={() => editClass()}>
                    Modifier
                </Button>
            </Modal.Footer>
        </Modal>
    )
}