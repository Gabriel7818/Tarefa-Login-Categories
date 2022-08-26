import React, { useContext } from 'react';
import { Link } from 'react-router-dom'
import { Context } from '../../Context/AuthContext';
import { Nav, Navbar, Container, Button, Form } from 'react-bootstrap';

export const Dashboard = () => {
    const token = localStorage.getItem('token');
    const { authenticated, handleLogout } = useContext(Context);
    console.log(`Situação do usuário na página Dashboard: ${authenticated}`);

    return(
        <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/dashboard">Menu</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            <Nav.Link href="/category">Categorias</Nav.Link>
          </Nav>
          <Form>
          <Button variant="btn btn-primary btn-lg" type="button" onClick={handleLogout}>Sair</Button>
          </Form>
        </Container>
      </Navbar>
      <div align="center">
        <br />
            <h1>Dashboard</h1>
            <hr />
            <h5>Token: {token}</h5>
            <hr />
        </div></div>
    )
}