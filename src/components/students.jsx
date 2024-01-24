import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Button, Card, CardColumns, Col, Form, ListGroup, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import StickyBox from "react-sticky-box";
import swal from 'sweetalert';
import { apiUrl, EmptyList, getRequest, Idx, loadingTime, postAuthRequest } from '../links/links';
import { CardItem, defaultImg, delItem, ListItem, ModalFile } from './classes';
import { LoadingComponent } from './LoadingComponent';
import { banStudent, resetStudent } from './parents';

library.add(
    faTimes,
    faEdit
)

export function Students() {
    const [students, setstudents] = useState([]);
    const [oneStudent, setoneStudent] = useState({});
    const [items, setitems] = useState([]);
    const [loading, setloading] = useState(1);
    const [parents, setparents] = useState([]);
    const [classes, setclasses] = useState([]);

    const [img, setimg] = useState('');
    const [oneItem, setoneItem] = useState('');
    const [showModal, setshowModal] = useState(false);
    const [toEdit, settoEdit] = useState(false);
    const [status, setStatus] = useState(false);
    const [statusParent, setStatusParent] = useState(false);
    const [statusClasse, setStatusClasse] = useState(false)

    const [showEditStudent, setshowEditStudent] = useState(false);
    const [editStudentFirstname, seteditStudentFirstname] = useState('');
    const [editStudentLastname, seteditStudentLastname] = useState('');
    const [editStudentBirthDate, seteditStudentBirthDate] = useState('');
    const [editStudentParent, seteditStudentParent] = useState('');
    const [editStudentClass, setEditStudentClass] = useState('');
    const [isList] = useState(true);


    const getItems = (classe) => {
        fetch(`${apiUrl}getitem/${classe}`, getRequest(JSON.parse(sessionStorage.getItem('userData')).token.Api_token))
            .then(r => r.json())
            .then(r => {
                if (r.status) setitems(Object.values(r.response));
                //console.log(Object.values(r.response))
            })
    }

    const editStudent = () => {
        let data = new FormData();
        data.append('student_Id', oneStudent.Student_Id);
        data.append('firstname', editStudentFirstname);
        data.append('lastname', editStudentLastname);
        data.append('birthdate', editStudentBirthDate);
        data.append('class_Id', editStudentClass);
        data.append('parent_Id', editStudentParent);
        let token = JSON.parse(sessionStorage.getItem('userData')).token.Api_token;
        let header = postAuthRequest(token, data);
        fetch(`${apiUrl}editstudent`, header)
            .then(r => r.json())
            .then(r => {
                if (r.status) swal('Parfait!', r.response, 'success').then(() => window.location.reload())
                else swal('Erreur!', r.response, 'warning')
            })
    }

    const findParent = e => {
        let pId = -1;
        if (parents.length < 1) console.log();
        else {
            parents.map(p => {
                let name = p.Firstname + ' ' + p.Lastname;
                if (name === e.target.value) pId = (p.Parent_Id)
                return pId;
            })
        }
        return pId;
    }

    const findClass = e => {
        let cId = -1;
        if (classes.length < 1) console.log();
        else {
            classes.map(c => {
                if (c.Class === e.target.value) cId = c.Class_Id
                return cId;
            })
        }
        return cId;
    }

    useEffect(() => {

        const getParents = () => {
            fetch(`${apiUrl}getparents`, getRequest(JSON.parse(sessionStorage.getItem('userData')).token.Api_token))
                .then(r => r.json())
                .then(r => {
                    if (r.status) {
                        setparents(r.response);
                        setStatusParent(true)
                    }
                    //else console.log(r.response)
                })
        }
        const getStudents = () => {
            fetch(`${apiUrl}getstudents`, getRequest(JSON.parse(sessionStorage.getItem('userData')).token.Api_token))
                .then(r => r.json())
                .then(r => {
                    if (r.status) {
                        setstudents(r.response);
                        setoneStudent(r.response[0]);
                        //console.log(r.response);
                        getItems(r.response[0].class);
                        setStatus(true);
                    }
                    /*
                    else
                        //swal('Erreur!', r.response, 'warning')
                        //console.log(r.response)
                        */
                })
        }

        const getClasses = () => {
            fetch(`${apiUrl}getclasses`, getRequest(JSON.parse(sessionStorage.getItem('userData')).token.Api_token))
                .then(r => r.json())
                .then(r => {
                    if (r.status) {
                        setclasses(r.response);
                        setStatusClasse(true);
                    }
                    else swal('Erreur!', r.response, 'warning');
                })
        }

        if (students.length < 1) getStudents();
        if (parents.length < 1) getParents();
        if (classes.length < 1) getClasses();
    }, [students, parents, classes, items, statusClasse, statusParent])

    const user = JSON.parse(sessionStorage.getItem('userData')).user;

    setTimeout(() => {
        setloading(0);
    }, loadingTime);

    if (loading) return <LoadingComponent img={require('../img/Cube-1s-104px.svg')} />
    if (!status) {
        return (
            <div>
                {
                    user.Profil_Id > 2
                    &&
                    <Button
                        variant="outline-success"
                        style={{ width: '100%', marginBottom: '10px' }}
                        onClick={() => swal('Allez sur l\'onglet "Parents" \n Créez un parent \n Et ajoutez-y un élève')}
                    >
                        Ajouter un élève
                    </Button>
                }
                <EmptyList msg="Vous n'avez aucun élève" />
            </div>
        )
    }
    else
        return (
            <div>
                {
                    user.Profil_Id > 2
                    &&
                    <Button
                        variant="outline-success"
                        style={{ width: '100%', marginBottom: '10px' }}
                        onClick={() => swal('Allez sur l\'onglet "Parents" \n Créez un parent \n Et ajoutez-y un élève')}
                    >
                        Ajouter un élève
                    </Button>
                }
                <Row>
                    <Col xs='2'>
                        <ListGroup style={{ marginBottom: '100px' }}>
                            {
                                students.map(s =>
                                    <ListGroup.Item
                                        key={Idx(students, s)}
                                        action
                                        onClick={() => {
                                            setoneStudent(s);
                                            getItems(s.class);
                                            //console.log(s) 
                                        }}
                                        variant={JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2 && (s.disabled ? 'danger' : 'success')}
                                    >
                                        {s.Student}
                                    </ListGroup.Item>
                                )
                            }
                        </ListGroup>
                    </Col>
                    <Col xs='10'>
                        <StickyBox offsetTop={80} offsetBottom={10}>
                            <Card style={{ width: '100%', height: '75vh' }}>
                                <Card.Header>
                                    <Row>
                                        <Col xs='11'>
                                            <Card.Title>{oneStudent.Student}</Card.Title>
                                            <Card.Text>
                                                {oneStudent.class}
                                            </Card.Text>
                                        </Col>
                                        <Col xs='1'>
                                            <Row>
                                                {
                                                    JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2
                                                    &&
                                                    <OverlayTrigger
                                                        placement="auto"
                                                        delay={{ show: 250, hide: 400 }}
                                                        overlay={<Tooltip>Modifier</Tooltip>}
                                                    >
                                                        <Button style={{ width: '90%' }} variant="outline-info" onClick={() => setshowEditStudent(true)}>
                                                            <FontAwesomeIcon icon={["fas", "edit"]} />
                                                        </Button>
                                                    </OverlayTrigger>
                                                }
                                            </Row>
                                            <Row>
                                                {
                                                    JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2
                                                    &&
                                                    (
                                                        oneStudent.disabled
                                                            ?
                                                            <OverlayTrigger
                                                                placement="auto"
                                                                delay={{ show: 250, hide: 400 }}
                                                                overlay={<Tooltip>Réintégrer</Tooltip>}
                                                            >
                                                                <Button
                                                                    style={{ width: '90%', marginTop: '10px' }}
                                                                    variant="outline-primary"
                                                                    onClick={() => resetStudent(oneStudent)}
                                                                >
                                                                    <FontAwesomeIcon icon={["fas", "arrow-up"]} />
                                                                </Button>
                                                            </OverlayTrigger>
                                                            :
                                                            <OverlayTrigger
                                                                placement="auto"
                                                                delay={{ show: 250, hide: 400 }}
                                                                overlay={<Tooltip>Bannir</Tooltip>}
                                                            >
                                                                <Button
                                                                    style={{ width: '90%', marginTop: '10px' }}
                                                                    variant="outline-danger"
                                                                    onClick={() => banStudent(oneStudent)}
                                                                >
                                                                    <FontAwesomeIcon icon={["fas", "times"]} />
                                                                </Button>
                                                            </OverlayTrigger>
                                                    )

                                                }
                                            </Row>
                                        </Col>
                                        {
                                            /*
                                    <Col xs="1">
                                            <Button variant="light" onClick={() => setisList(true)}>
                                            <FontAwesomeIcon icon={["fas", "list"]} />
                                        </Button>
                                        <br />
                                        <Button variant="light" onClick={() => setisList(false)}>
                                            <FontAwesomeIcon icon={["fas", "th"]} />
                                        </Button>
                                    </Col>
                                            */
                                        }
                                    </Row>
                                </Card.Header>
                                <ListGroup className="list-group-flush" style={{ overflowY: 'auto' }}>
                                    {
                                        items.length < 1
                                            ?
                                            <ListGroup.Item disabled>
                                                Il n'y a pas de support existant pour le moment dans sa classe
                                        </ListGroup.Item>
                                            :
                                            (
                                                isList
                                                    ?
                                                    items.map(i =>
                                                        <ListItem
                                                            key={Idx(items, i)}
                                                            title={i.Title}
                                                            details={i.details}
                                                            click={() => {
                                                                setshowModal(true);
                                                                setimg(i.File);
                                                                //setItemId(i.Item_Id);
                                                                setoneItem(i);
                                                            }}
                                                            date={i.updated_at}
                                                            nbDownloads={i.Downloads}
                                                        />
                                                    )
                                                    :
                                                    <CardColumns style={{ marginTop: '10px', height: '100%' }}>
                                                        {
                                                            items.map(i =>
                                                                <CardItem
                                                                    key={Idx(items, i)}
                                                                    title={i.Title}
                                                                    details={i.Details}
                                                                    imgSrc={i.File ? i.File : defaultImg(i.Type, Idx(i.Type, "image") !== -1 && i.Link)}
                                                                    click={() => {
                                                                        setshowModal(true);
                                                                        setimg(i.File);
                                                                        //setItemId(i.Item_Id);
                                                                        setoneItem(i);
                                                                    }}
                                                                    date={i.updated_at}
                                                                />
                                                            )
                                                        }
                                                    </CardColumns>
                                            )
                                    }

                                </ListGroup>
                            </Card>
                        </StickyBox>
                    </Col>
                    <ModalFile
                        show={showModal}
                        hide={() => setshowModal(false)}
                        imgSrc={img}
                        del={() => delItem(oneItem.Item_Id)}
                        item={oneItem}
                        toEdit={toEdit}
                        setEdit={() => settoEdit(!toEdit)}
                        isParent={JSON.parse(sessionStorage.getItem('userData')).user.Parent_Id}
                        isAdmin={JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2}
                    />
                    <EditStudent
                        show={showEditStudent}
                        hide={() => setshowEditStudent(false)}
                        student={oneStudent}
                        parents={parents}
                        classes={classes}
                        editStudent={() => editStudent()}
                        setFirstname={e => seteditStudentFirstname(e.target.value)}
                        setLastname={e => seteditStudentLastname(e.target.value)}
                        setBirthDate={e => seteditStudentBirthDate(e.target.value)}
                        setParent={e => seteditStudentParent(findParent(e))}
                        setClass={e => setEditStudentClass(findClass(e))}
                    />
                </Row>
            </div>
        )
}

function EditStudent(props) {
    let student = props.student;
    let name = props.student.Student.split(' ');
    return (
        <Modal show={props.show} onHide={props.hide} centered size='xl'>
            <Modal.Header>
                <Modal.Title>Modifier les informations de {name[0]} {name[1]}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group as={Row} controlId="formFirstname">
                        <Form.Label column sm="2">
                            Prénom
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control placeholder={name[0]} onChange={props.setFirstname} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formLastname">
                        <Form.Label column sm="2">
                            Nom
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control placeholder={name[1]} onChange={props.setLastname} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formBirthDate">
                        <Form.Label column sm="2">
                            Date de naissance
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control type='date' placeholder={student.BirthDate} onChange={props.setBirthDate} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formParent">
                        <Form.Label column sm="2">
                            Parent
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control as="select" defaultValue={student.Parent} onChange={props.setParent}>
                                {
                                    props.parents.map(p =>
                                        <option key={Idx(props.parents, p)}>
                                            {p.Firstname} {p.Lastname}
                                        </option>
                                    )
                                }
                            </Form.Control>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formClass">
                        <Form.Label column sm="2">
                            Classe
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control as="select" defaultValue={student.class} onChange={props.setClass}>
                                {
                                    props.classes.map(c =>
                                        <option key={Idx(props.classes, c)}>
                                            {c.Class}
                                        </option>
                                    )
                                }
                            </Form.Control>
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-warning" onClick={props.editStudent}>
                    Modifier
                </Button>
            </Modal.Footer>
        </Modal>
    )
}