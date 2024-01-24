import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowUp, faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  ListGroup,
  Modal,
  Nav,
  OverlayTrigger,
  Row,
  Tab,
  Tooltip,
} from "react-bootstrap";
import StickyBox from "react-sticky-box";
import swal from "sweetalert";
import {
  apiUrl,
  EmptyList,
  getRequest,
  Idx,
  loadingTime,
  postAuthRequest,
} from "../links/links";
import { LoadingComponent } from "./LoadingComponent";

library.add(faEdit, faTimes, faArrowUp);

export function Teachers() {
  const [teachers, setteachers] = useState([]);
  const [oneTeacher, setoneTeacher] = useState("");
  const [toEdit, settoEdit] = useState(false);
  const [classes, setclasses] = useState([]);
  const [showAddTeacher, setshowAddTeacher] = useState(false);
  const [oneProfile, setoneProfile] = useState("");
  const [profiles, setprofiles] = useState([]);

  const [teacherId, setteacherId] = useState("");
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [profilEdit, setprofilEdit] = useState("");
  const [email, setemail] = useState("");
  const [oldpwd, setoldpwd] = useState("");
  const [newpwd, setnewpwd] = useState("");
  const [confpassword, setconfpassword] = useState(false);
  const [pwdNotCorrect, setpwdNotCorrect] = useState(true);

  const [loading, setloading] = useState(1);
  const [status, setStatus] = useState(false);

  const editTeacher = () => {
    let data = new FormData();
    data.append("userId", teacherId);
    data.append("firstname", firstname);
    data.append("lastname", lastname);
    data.append("profil", profilEdit);
    data.append("email", email);
    let request = postAuthRequest(
      JSON.parse(sessionStorage.getItem("userData")).token.Api_token,
      data
    );

    fetch(`${apiUrl}editteacher`, request)
      .then((r) => r.json())
      .then((r) => {
        if (r.status)
          swal("Parfait!", r.response, "success").then(() =>
            window.location.reload()
          );
      }); /*
        console.log({
            'userId': teacherId,
            'prénom': firstname,
            'nom': lastname,
            'profil': profilEdit,
            'email': email,
            'pwd': password,
            'conf pwd': confpassword
        })
*/
  };

  const checkPassword = (teacher) => {
    let data = new FormData();
    /**/
    data.append("userId", teacher.User_Id);
    data.append("oldpassword", oldpwd);
    fetch(
      `${apiUrl}checkpwd`,
      postAuthRequest(
        JSON.parse(sessionStorage.getItem("userData")).token.Api_token,
        data
      )
    )
      .then((r) => r.json())
      .then((r) => {
        if (r.status) {
          setpwdNotCorrect(false);
          //console.log(r.response)
        } else {
          swal("Erreur!", r.response, "warning");
        }
      });
    //console.log(teacher)
  };

  const editPassword = (teacher) => {
    let data = new FormData();
    /**/
    data.append(
      "userId",
      JSON.parse(sessionStorage.getItem("userData")).user.Profil_Id < 3
        ? JSON.parse(sessionStorage.getItem("userData")).user.User_Id
        : teacher.User_Id
    );
    data.append("oldpassword", oldpwd);
    data.append("newpassword", newpwd);
    data.append("confpassword", newpwd === confpassword);
    /**/
    fetch(
      `${apiUrl}editpwd`,
      postAuthRequest(
        JSON.parse(sessionStorage.getItem("userData")).token.Api_token,
        data
      )
    )
      .then((r) => r.json())
      .then((r) => {
        if (r.status)
          swal("Parfait!", r.response, "success").then(() =>
            window.location.reload()
          );
        else swal("Erreur!", r.response, "warning");
        /*
                    .then(() => console.log(r, {
                        'pwdNotCorrect': pwdNotCorrect,
                        'profil': JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id < 3,
                        'result': (pwdNotCorrect || JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id < 3)
                    }))
                    */
      });

    //console.log([oldpwd, newpwd, confpassword, newpwd === confpassword])
  };

  const banTeacher = (teacher) => {
    let data = new FormData();
    data.append("userId", teacher.User_Id);
    swal("Etes-vous sûr de vouloir bannir cette utilisateur ?").then(
      (confirmed) => {
        if (confirmed)
          fetch(
            `${apiUrl}banteacher`,
            postAuthRequest(
              JSON.parse(sessionStorage.getItem("userData")).token.Api_token,
              data
            )
          )
            .then((r) => r.json())
            .then((r) => {
              if (r.status)
                swal("Parfait!", r.response, "success").then(() =>
                  window.location.reload()
                );
              else swal("Erreur!", r.response, "warning");
            });
      }
    );
  };

  const getClasses = (userId) => {
    let token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;
    fetch(`${apiUrl}getclasses/${userId}`, getRequest(token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status) {
          setclasses(r.response);
        }
        //console.log(r.response)
      });
  };

  const reHireTeacher = (teacher) => {
    let data = new FormData();
    data.append("userId", teacher.User_Id);
    swal("Etes-vous sûr de vouloir réintégrer cette utilisateur ?").then(
      (confirmed) => {
        if (confirmed)
          fetch(
            `${apiUrl}rehireteacher`,
            postAuthRequest(
              JSON.parse(sessionStorage.getItem("userData")).token.Api_token,
              data
            )
          )
            .then((r) => r.json())
            .then((r) => {
              if (r.status)
                swal("Parfait!", r.response, "success").then(() =>
                  window.location.reload()
                );
              else swal("Erreur!", r.response, "warning");
            });
      }
    );
  };

  useEffect(() => {
    const getProfiles = () => {
      fetch(
        `${apiUrl}getprofiles`,
        getRequest(
          JSON.parse(sessionStorage.getItem("userData")).token.Api_token
        )
      )
        .then((r) => r.json())
        .then((r) => {
          if (r.status) {
            setprofiles(r.response);
            setoneProfile(r.response[0].Profil);
            setprofilEdit(r.response[0].Profil);
          }
        });
    };
    if (profiles.length < 1) getProfiles();
  }, [profiles]);

  useEffect(() => {
    const getTeachers = () => {
      fetch(
        `${apiUrl}getteachers`,
        getRequest(
          JSON.parse(sessionStorage.getItem("userData")).token.Api_token
        )
      )
        .then((r) => r.json())
        .then((r) => {
          if (r.status) {
            setteachers(r.response);
            setoneTeacher(r.response[0]);
            setteacherId(r.response[0].User_Id);
            setStatus(true);
            getClasses(r.response[0].User_Id);
          }
          //console.log(r);
        });
    };
    if (teachers.length < 1) getTeachers();
  }, [teachers]);

  setTimeout(() => {
    setloading(0);
  }, loadingTime);

  if (loading)
    return (
      <LoadingComponent img={require("../img/WalkingMan.svg")} height="100px" />
    );
  if (!status)
    return (
      <div>
        {JSON.parse(sessionStorage.getItem("userData")).user.Profil_Id > 2 && (
          <Button
            variant="outline-success"
            style={{ width: "100%", marginBottom: "10px" }}
            onClick={() => setshowAddTeacher(true)}
          >
            Ajouter un employé / enseignant
          </Button>
        )}
        <EmptyList msg="Vous n'avez aucun employé" />
      </div>
    );
  else
    return (
      <div>
        {JSON.parse(sessionStorage.getItem("userData")).user.Profil_Id > 2 && (
          <Button
            variant="outline-success"
            style={{ width: "100%", marginBottom: "10px" }}
            onClick={() => setshowAddTeacher(true)}
          >
            Ajouter un employé / enseignant
          </Button>
        )}
        <Row>
          <Col xs="2">
            <ListGroup style={{ marginBottom: "100px" }}>
              {teachers.map((t) => (
                <ListGroup.Item
                  key={Idx(teachers, t)}
                  action
                  onClick={() => {
                    setoneTeacher(t);
                    setteacherId(t.User_Id);
                    getClasses(t.User_Id);
                  }}
                  variant={
                    JSON.parse(sessionStorage.getItem("userData")).user
                      .Profil_Id > 2 && (t.Profil_Id > 1 ? "success" : "danger")
                  }
                >
                  {t.Firstname} {t.Lastname}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col xs="10">
            <StickyBox offsetTop={80} offsetBottom={10}>
              <Card
                style={{ width: "100%", minHeight: toEdit ? "60vh" : "30vh" }}
              >
                <Card.Header>
                  <Row>
                    <Col xs="11">
                      <Card.Title>
                        {oneTeacher.Firstname} {oneTeacher.Lastname}
                      </Card.Title>
                      <p>
                        {classes.join(", ") || (
                          <div
                            style={{ fontStyle: "italic", fontSize: "0.75rem" }}
                          >
                            Pas de classe
                          </div>
                        )}
                      </p>
                    </Col>
                    <Col xs="1">
                      {oneTeacher.Profil_Id < 1 || (
                        <Row>
                          {!toEdit ? (
                            (JSON.parse(sessionStorage.getItem("userData")).user
                              .Profil_Id === 3 &&
                              oneTeacher.Profil_Id >
                                JSON.parse(sessionStorage.getItem("userData"))
                                  .user.Profil_Id) || (
                              <OverlayTrigger
                                placement="auto"
                                delay={{ show: 250, hide: 400 }}
                                overlay={<Tooltip>Modifier</Tooltip>}
                              >
                                <Button
                                  variant="outline-info"
                                  style={{ width: "90%" }}
                                  onClick={() => {
                                    settoEdit(true);
                                    //console.log(teachers)
                                  }}
                                >
                                  <FontAwesomeIcon icon={["fas", "edit"]} />
                                </Button>
                              </OverlayTrigger>
                            )
                          ) : (
                            <OverlayTrigger
                              placement="auto"
                              delay={{ show: 250, hide: 400 }}
                              overlay={<Tooltip>Annuler</Tooltip>}
                            >
                              <Button
                                variant="outline-secondary"
                                style={{ width: "90%" }}
                                onClick={() => settoEdit(false)}
                              >
                                <FontAwesomeIcon icon={["fas", "times"]} />
                              </Button>
                            </OverlayTrigger>
                          )}
                          {oneTeacher.Profil_Id >=
                            JSON.parse(sessionStorage.getItem("userData")).user
                              .Profil_Id ||
                            (!toEdit &&
                              (oneTeacher.Profil_Id < 2 ? (
                                <OverlayTrigger
                                  placement="auto"
                                  delay={{ show: 250, hide: 400 }}
                                  overlay={<Tooltip>Réintégrer</Tooltip>}
                                >
                                  <Button
                                    variant="outline-primary"
                                    style={{ width: "90%", marginTop: "5px" }}
                                    onClick={() => reHireTeacher(oneTeacher)}
                                  >
                                    <FontAwesomeIcon
                                      icon={["fas", "arrow-up"]}
                                    />
                                  </Button>
                                </OverlayTrigger>
                              ) : (
                                <OverlayTrigger
                                  placement="auto"
                                  delay={{ show: 250, hide: 400 }}
                                  overlay={<Tooltip>Bannir</Tooltip>}
                                >
                                  <Button
                                    variant="outline-danger"
                                    style={{ width: "90%", marginTop: "5px" }}
                                    onClick={() => banTeacher(oneTeacher)}
                                  >
                                    <FontAwesomeIcon icon={["fas", "times"]} />
                                  </Button>
                                </OverlayTrigger>
                              )))}
                        </Row>
                      )}
                    </Col>
                  </Row>
                </Card.Header>
                {toEdit ? (
                  <Card.Body style={{ overflow: "auto" }}>
                    <Tab.Container
                      id="left-tabs-example"
                      defaultActiveKey="first"
                    >
                      <Row>
                        <Col sm={3}>
                          <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                              <Nav.Link eventKey="first">
                                Informations générales
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link eventKey="second">
                                Mot de passe
                              </Nav.Link>
                            </Nav.Item>
                          </Nav>
                        </Col>
                        <Col sm={9}>
                          <Tab.Content>
                            <Tab.Pane eventKey="first">
                              <EditTeacher
                                oneTeacher={oneTeacher}
                                toEdit={toEdit}
                                setfirstname={(e) =>
                                  setfirstname(e.target.value)
                                }
                                setlastname={(e) => setlastname(e.target.value)}
                                setprofilEdit={(e) =>
                                  setprofilEdit(e.target.value)
                                }
                                profiles={profiles}
                                setemail={(e) => setemail(e.target.value)}
                                editTeacher={() => editTeacher()}
                              />
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                              <EditPassword
                                teacher={oneTeacher}
                                setoldpwd={(e) => setoldpwd(e.target.value)}
                                setnewpwd={(e) => setnewpwd(e.target.value)}
                                setconfpassword={(e) =>
                                  setconfpassword(e.target.value)
                                }
                                isPwdNotCorrect={pwdNotCorrect}
                                checkPassword={() => checkPassword(oneTeacher)}
                                editPassword={() => editPassword(oneTeacher)}
                              />
                            </Tab.Pane>
                          </Tab.Content>
                        </Col>
                      </Row>
                    </Tab.Container>
                  </Card.Body>
                ) : (
                  <Card.Body style={{ overflowX: "auto" }}>
                    <Form>
                      <Form.Group as={Row} controlId="formFirstname">
                        <Form.Label column sm="2">
                          Prénom
                        </Form.Label>
                        <Col sm="10">
                          <Form.Control
                            plaintext
                            readOnly
                            placeholder={oneTeacher.Firstname}
                          />
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} controlId="formLastname">
                        <Form.Label column sm="2">
                          Nom de famille
                        </Form.Label>
                        <Col sm="10">
                          <Form.Control
                            plaintext
                            readOnly
                            placeholder={oneTeacher.Lastname}
                          />
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} controlId="formClass">
                        <Form.Label column sm="2">
                          Classe
                        </Form.Label>
                        <Col sm="10">
                          <Form.Control
                            plaintext
                            readOnly
                            placeholder={classes.join(", ") || "Pas de classe"}
                          />
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} controlId="formPlaintextEmail">
                        <Form.Label column sm="2">
                          Email
                        </Form.Label>
                        <Col sm="10">
                          <Form.Control
                            plaintext
                            readOnly
                            placeholder={
                              toEdit ? null : oneTeacher.EmailAddress
                            }
                          />
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} controlId="formPlaintextProfil">
                        <Form.Label column sm="2">
                          Profile
                        </Form.Label>
                        <Col sm="10">
                          <Form.Control
                            plaintext
                            readOnly
                            placeholder={toEdit ? null : oneTeacher.Profil}
                          />
                        </Col>
                      </Form.Group>
                    </Form>
                  </Card.Body>
                )}
              </Card>
            </StickyBox>
          </Col>
        </Row>
        <AddTeacher
          profiles={profiles}
          oneProfil={oneProfile}
          show={showAddTeacher}
          hide={() => setshowAddTeacher(false)}
        />
      </div>
    );
}

function AddTeacher(props) {
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [theProfile, setTheProfil] = useState("");
  //const [profiles, setprofiles] = useState([]);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confPassword, setconfPassword] = useState(false);

  let profiles = props.profiles;

  const addTeacher = () => {
    if (theProfile.length < 1) setTheProfil(props.oneProfil);
    let data = new FormData();
    data.append("firstname", firstname);
    data.append("lastname", lastname);
    data.append("email", email);
    data.append("password", password);
    data.append("confpassword", confPassword);
    data.append("profil", theProfile.length < 1 ? props.oneProfil : theProfile);
    fetch(
      `${apiUrl}addteacher`,
      postAuthRequest(
        JSON.parse(sessionStorage.getItem("userData")).token.Api_token,
        data
      )
    )
      .then((r) => r.json())
      .then((r) => {
        if (r.status)
          swal("Parfait!", r.response, "success").then(() =>
            window.location.reload()
          );
        else swal("Erreur", r.response, "warning");
      }); /*
        console.log({
            'Prénom': firstname,
            'nom de fam': lastname,
            'Profile': theProfile,
            'Email': email,
            'Password': password,
            'Conf Pwd': confPassword
        })*/
  };

  return (
    <Modal show={props.show} onHide={props.hide} centered size="xl">
      <Modal.Header>
        <Modal.Title>Ajouter un employé / professeur</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group as={Row} controlId="formFirstnameAdd">
            <Form.Label column sm="2">
              Prénom
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                onChange={(e) => setfirstname(e.target.value)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formLastnameAdd">
            <Form.Label column sm="2">
              Nom de famille
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                onChange={(e) => setlastname(e.target.value)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formProfilAdd">
            <Form.Label column sm="2">
              Profile
            </Form.Label>
            <Col sm="10">
              <Form.Control
                as="select"
                onChange={(e) => setTheProfil(e.target.value)}
              >
                {profiles.map((p) =>
                  p.Profil_Id > 2 && p.Profil_Id < 5 ? (
                    <option key={Idx(profiles, p)}>{p.Name}</option>
                  ) : null
                )}
              </Form.Control>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPlaintextEmailAdd">
            <Form.Label column sm="2">
              Email
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="email"
                onChange={(e) => setemail(e.target.value)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPlaintextPasswordAdd">
            <Form.Label column sm="2">
              Mot de passe
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="password"
                onChange={(e) => setpassword(e.target.value)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPlaintextConfPasswordAdd">
            <Form.Label column sm="2">
              Confirmer le mot de passe
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="password"
                onChange={(e) => setconfPassword(e.target.value === password)}
              />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-warning" onClick={() => addTeacher()}>
          Ajouter
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function EditTeacher(props) {
  let oneTeacher = props.oneTeacher;
  let profiles = props.profiles;
  let toEdit = props.toEdit;
  return (
    <div>
      {toEdit && (
        <Alert variant="warning" style={{ fontSize: "0.75rem" }}>
          Laissez vide les champs d'informations que vous ne voulez pas changer
        </Alert>
      )}
      <div>
        <Form>
          <Form.Group as={Row} controlId="formFirstname">
            <Form.Label column sm="2">
              Prénom
            </Form.Label>
            <Col sm="10">
              <Form.Control
                placeholder={oneTeacher.Firstname}
                onChange={props.setfirstname}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formLastname">
            <Form.Label column sm="2">
              Nom de famille
            </Form.Label>
            <Col sm="10">
              <Form.Control
                placeholder={oneTeacher.Lastname}
                onChange={props.setlastname}
              />
            </Col>
          </Form.Group>
          {JSON.parse(sessionStorage.getItem("userData")).user.Profil_Id >
            2 && (
            <Form.Group as={Row} controlId="formProfilEdit">
              <Form.Label column sm="2">
                Profile
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  as="select"
                  onChange={props.setprofilEdit}
                  disabled={oneTeacher.Profil_Id > 3}
                >
                  {profiles.map(
                    (p) =>
                      p.Profil_Id !== 1 && (
                        <option key={Idx(profiles, p)}>{p.Profil}</option>
                      )
                  )}
                </Form.Control>
              </Col>
            </Form.Group>
          )}

          <Form.Group as={Row} controlId="formClassEdit">
            <Form.Label column sm="2">
              Classe
            </Form.Label>
            <Col sm="10">
              <OverlayTrigger
                placement="auto"
                delay={{ show: 100, hide: 100 }}
                overlay={
                  <Tooltip>
                    Veuillez modifier la classe dans l'onglet "Classes"
                  </Tooltip>
                }
              >
                <Form.Control
                  type="text"
                  disabled
                  defaultValue={oneTeacher.Class}
                />
              </OverlayTrigger>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPlaintextEditEmail">
            <Form.Label column sm="2">
              Email
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="email"
                disabled={
                  JSON.parse(sessionStorage.getItem("userData")).user
                    .Profil_Id < 3
                }
                placeholder={oneTeacher.EmailAddress}
                onChange={props.setemail}
              />
            </Col>
          </Form.Group>
        </Form>
        <hr />
        <Button variant="outline-warning" onClick={props.editTeacher}>
          Modifier
        </Button>
      </div>
    </div>
  );
}

function EditPassword(props) {
  return (
    <div>
      <Form>
        {props.teacher.User_Id ===
          JSON.parse(sessionStorage.getItem("userData")).user.User_Id && (
          <Form.Group as={Row} controlId="formPlaintextOldPassword">
            <Form.Label column sm="3">
              Ancien Mot de passe
            </Form.Label>
            <Col sm="9">
              <Form.Control
                type="password"
                placeholder="password"
                onChange={props.setoldpwd}
              ></Form.Control>
            </Col>
          </Form.Group>
        )}
        <hr />
        <Form.Group as={Row} controlId="formPlaintextNewPassword">
          <Form.Label column sm="3">
            Nouveau Mot de passe
          </Form.Label>
          <Col sm="9">
            <Form.Control
              type="password"
              placeholder="password"
              onChange={props.setnewpwd}
              disabled={
                !(
                  props.teacher.User_Id !==
                    JSON.parse(sessionStorage.getItem("userData")).user
                      .User_Id || !props.isPwdNotCorrect
                )
              }
            ></Form.Control>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formPlaintextConfPassword">
          <Form.Label column sm="3">
            Confirmer le mot de passe
          </Form.Label>
          <Col sm="9">
            <Form.Control
              type="password"
              placeholder="password"
              onChange={props.setconfpassword}
              disabled={
                !(
                  props.teacher.User_Id !==
                    JSON.parse(sessionStorage.getItem("userData")).user
                      .User_Id || !props.isPwdNotCorrect
                )
              }
            ></Form.Control>
          </Col>
        </Form.Group>
      </Form>
      <hr />
      {props.teacher.User_Id !==
        JSON.parse(sessionStorage.getItem("userData")).user.User_Id ||
      !props.isPwdNotCorrect ? (
        <Button variant="outline-info" onClick={props.editPassword}>
          Changer de mot de passe
        </Button>
      ) : (
        <Button variant="outline-warning" onClick={props.checkPassword}>
          Vérifier mon mot de passe actuel
        </Button>
      )}
    </div>
  );
}
