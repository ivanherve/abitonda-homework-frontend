import { Button } from "react-bootstrap";
import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { getRequest, apiUrl } from "../links/links";

export function Statistic() {
    const [users, setUsers] = useState([]);
    const [nbToken, setNbToken] = useState([0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]);
    const [nbActualTokens, setNbActualTokens] = useState([]);
    let tabUsers = [];
    let tabTokens = [];
    let tabActualTokens = [];
    const getLogins = () => {
        fetch(`${apiUrl}getlogins`, getRequest(JSON.parse(sessionStorage.getItem('userData')).token.Api_token))
            .then(r => r.json())
            .then(r => {
                if(!r.status) console.log('oups');
                else {
                    if(r.response.length > 0) {
                        r.response.map(u => {
                            //if(users.length < 1) setUsers([u.Name])
                            //else setUsers([...users, u.Name]);
                            tabUsers.push(u.Name);
                            tabTokens.push(u.NbToken);
                            tabActualTokens.push(u.Connecte);
                        })
                    }
                }
                setUsers(tabUsers);
                setNbToken(tabTokens);
                setNbActualTokens(tabActualTokens);
            });
    }
    const data = {
        labels: users,
        datasets: [
            {
                label: "Nombre de connexion depuis création",
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: nbToken,
            },
            {
                label: "Connecté",
                backgroundColor: "rgba(77, 255, 77, 0.2)",
                borderColor: "rgba(0, 179, 0, 1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(255,99,200,0.4)",
                hoverBorderColor: "rgba(255,99,200,1)",
                data: nbActualTokens,
            },
        ],
    };
    return (
        <div>
            <h1>Tableau de bord</h1>
            <Graph
                title="Nombre de connexion"
                data={data}
                click={() => getLogins()}
            />
            <hr />
            <Graph
                title="Nombre de téléchargement"
                data={data}
                click={() => getLogins()}
            />
        </div>
    )
}

function Graph(props) {
    let data = props.data;
    return (
        <Card style={{ width: '100%', height: '75vh' }}>
            <Card.Header>
                <h4>{props.title}</h4>
            </Card.Header>
            <Card.Body>
                <Line
                    data={data}
                    width={100}
                    height={250}
                    options={{ maintainAspectRatio: false }}
                />
            </Card.Body>
            <Card.Footer>
                <Button onClick={props.click}>
                    Click
                </Button>
            </Card.Footer>
        </Card>
    )
}