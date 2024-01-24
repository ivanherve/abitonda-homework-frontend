import React from 'react';

export function LoadingComponent(props) {
    return (
        <div style={props.styles || styles}>
            <img src={props.img} alt="Chargement" style={{ height: '90px' }} />
            Chargement...
        </div>
    )
}

const styles = {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    fontSize: '2rem',
    color: 'green',
    textAlign: 'center',
    marginTop: '250px'
}