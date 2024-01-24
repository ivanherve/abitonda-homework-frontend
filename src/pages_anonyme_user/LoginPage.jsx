import React, { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import swal from "sweetalert";
import { apiUrl } from "../links/links";

export default function LoginPage() {
  const [loggedin, setloggedin] = useState(false);
  const [username, setusername] = useState("a");
  const [password, setpassword] = useState("a");

  const signIn = (username, password) => {
    let data = new FormData();
    data.append("username", username);
    data.append("password", password);
    //console.log(username, password)
    fetch(`${apiUrl}signin`, {
      method: "post",
      body: data,
    })
      .then((r) => r.json())
      .then((r) => {
        console.log(r);
        if (r.status) {
          sessionStorage.setItem("userData", JSON.stringify(r.response));
          setloggedin(true);
        } else {
          swal(r.response[0]);
          //console.log(r.response)
        }
      })
      .catch((e) => {
        //alert(e);
        //console.log(e);
        //console.log(apiUrl)
      });

    //sessionStorage.setItem('userData', 'JSON.stringify(r.response)');
    //setloggedin(true);
    //console.log(username, password)
  };

  if (loggedin) {
    return <Redirect to="/" />;
  }

  if (sessionStorage.getItem("userData")) {
    return <Redirect to="/" />;
  }
  return (
    <Container>
      <div
        className="d-flex justify-content-center"
        style={{ marginTop: "100px" }}
      >
        <img
          src={require("../img/Abitonda-logo-sans-effet (1).png")}
          alt="Logo"
          width="199.5"
          height="225"
        />
      </div>
      <div className="d-flex justify-content-center" style={{ color: "#b50000" }}>
        <h3><strong>Homework</strong></h3>
      </div>
      <div className="d-flex justify-content-center h-50">
        <Card>
          <Card.Header>
            <Card.Title>Connexion</Card.Title>
          </Card.Header>
          <Card.Body>
            <Form>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Nom d'utilisateur</Form.Label>
                <Form.Control
                  type="username"
                  placeholder="user.name001"
                  onChange={(e) => setusername(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.keyCode === 13) signIn(username, password);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  onChange={(e) => setpassword(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.keyCode === 13) signIn(username, password);
                  }}
                />
              </Form.Group>
            </Form>
          </Card.Body>
          <Card.Footer>
            <Button
              variant="outline-warning"
              onClick={() => signIn(username, password)}
            >
              Connexion
            </Button>
          </Card.Footer>
        </Card>
      </div>
    </Container>
  );
}
