import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Context } from '../../Context/AuthContext';
import Table from 'react-bootstrap/Table';
import './category.css';
import { confirmAlert } from 'react-confirm-alert';
import { useHistory } from 'react-router-dom';
import { Nav, Navbar, Container, Button, Form } from 'react-bootstrap';

export const ListaCategories = () => {

    const history = useHistory();
    const [data, setData] = useState([]);
    const [page, setPage] = useState();
    const [lastPage, setLastPage] = useState("")
    const { authenticated, handleLogout } = useContext(Context);
    const [status, setStatus] = useState({
        type:'',
        mensagem:''
    })

    const confirmDelete = (categories) => {
        confirmAlert({
          title: "Atenção !",
          message:
            "Você tem certeza que deseja apagar a Categoria " +
            categories.id +
            "?",
          buttons: [
            {
              label: "Sim",
              onClick: () => handleDelete(categories.id)
            },
            {
              label: "Não",
              onClick: () => history.push("/category")
            }
          ]
        });
      };

    const handleDelete = async (idCategories) => {
        console.log(idCategories);

        const valueToken = localStorage.getItem('token');
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        };

        await api.delete("/categories/delete/"+idCategories, headers)
        .then( (response) => {
            setStatus({
                type: 'sucess',
                mensagem: response.data.mensagem
            })
            getUsers();
        }).catch( (err) => {
            if(err.response){
                setStatus({
                    type:'error',
                    mensagem: err.response.data.mensagem
                })
            } else {
                setStatus({
                    type:'error',
                    mensagem: 'Erro: Tente mais Tarde !'
                })
            }
        })
    }

    const getCategories = async (page) => {

        if( page === undefined ) {
            page = 1
        }
        setPage(page);

        const valueToken = localStorage.getItem('token');
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        };

        await api.get("/categories/all/pages/" + page, headers)
            .then( (response) => {
                setData(response.data.categories);
                setLastPage(response.data.lastPage);
                setStatus({loading: false})
            }).catch( (err) => {
                if(err.response){
                    setStatus({
                        type:'error',
                        mensagem: err.response.data.mensagem
                    })
                } else {
                    setStatus({
                        type:'error',
                        mensagem: 'Erro: Tente mais Tarde !'
                    })
                }
            })
    }

    useEffect( () => {
        getCategories();
    }, [])

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
            
            <h1 className="userCenter">Lista de Categorias</h1>

            <div className="buttonDiv">
                <Button className="buttonNew" variant="btn btn-success" href="/category/novo">Nova Categoria</Button>{' '}
            </div>
            <div className="table">
                <Table striped bordered hover>
                    <tbody>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Descrição</th>
                    </tr>
                    {(!status.loading &&
                    data.map(categories => (
                        <tr key={categories.id}>
                            <td>{categories.id}</td>
                            <td>{categories.name}</td>
                            <td>{categories.description}</td>
                            <td className="spaceFlex">
                            <Button className="noLink" variant="btn btn-warning">
                                <Link className="onLink" to={"/category/editar/"+categories.id}>Editar</Link>
                            </Button>
                            <Button variant="btn btn-danger" onClick={() => confirmDelete(categories)}>
                                Excluir
                            </Button>
                            </td>
                        </tr> 
                    ))
                    )}          
                    </tbody>
                </Table>
            </div>
            {/* Listagem de Categorias */}
            
            {/* <div className="Container">
            { page !== 1
                ? <Button type="button" onClick={ () => getCategories(1)}>Primeira</Button>
                : <Button type="button" disabled>Início</Button>
            }{" "}
            
            { page !== 1
                ? <Button type="button" onClick={ () => getCategories(page - 1)}>{page - 1}</Button>
                : ""
            }{" "}

            <Button type="button" disabled>{page}</Button>{" "}

            { page !== lastPage
                ? <Button type="button" onClick={ () => getCategories(page + 1)}>{page + 1}</Button>
                : ""
            }{" "}

            { page !== lastPage 
                ? <Button type="button" onClick={ () => getCategories(lastPage)}>Ultima</Button>
                : <Button type="button" disabled>Fim</Button>
            }
            </div> */}
        </div>
    )
}