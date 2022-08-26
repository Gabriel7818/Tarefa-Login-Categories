import React, { useState, useContext, useEffect } from "react";
import api from '../../services/api';
import { Link, useHistory } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import { Container } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Context } from '../../Context/AuthContext';
// import { Nav, Navbar } from 'react-bootstrap';

const initialValue = {
    name: '',
    description: ''
}

export const CategoryForm = (props) => {

    const history = useHistory();
    const [id] = useState(props.match.params.id);
    const [values, setValues] = useState(initialValue);
    const [acao, setAcao] = useState('Novo');
    const [status, setStatus] = useState({
        type: '',
        mensagem: '',
        loading: false
    })

    const { authenticated, handleLogout } = useContext(Context);

    const valorInput = e => setValues({
        ... values,
        [e.target.name]: e.target.value
    })

    useEffect( () => {

      const getCategory = async () => {

        const valueToken = localStorage.getItem('token');
        const headers = {
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + valueToken
            }
        }

        await api.get("/categories/show/"+id, headers)
            .then( (response) => {
                if(response.data.categories){
                  setValues(response.data.categories);
                  setAcao('Editar')
                } else {
                  setStatus({
                    type: 'warning',
                    mensagem:'Categoria não Encontrada !'
                  })
                } 
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
                    });
                };
            });
    };
    
    if(id) getCategory();
    }, [id])

    const formSubmit = async e => {
        e.preventDefault();
        setStatus({ loading: true });

        const valueToken = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'headers': {'Authorization': 'Bearer ' + valueToken}
        }

        if(!id){

          await api.post("/categories/create", values, headers)
              .then( (response) => {
                      console.log(response);
                      setStatus({loading: false});
                      return history.push('/category')
                  }).catch( (err) => {
                      if(err.response){
                          setStatus({
                              type: 'error',
                              mensagem: err.response.data.mensagem,
                              loading: false
                          })
                      } else {
                          setStatus({
                              type: 'error',
                              mensagem: 'Erro: Tente mais Tarde !',
                              loading: false
                          })                
                      }  
                  })
        } else {
          await api.put("/categories/update", values, headers)
              .then( (response) => {
                      console.log(response);
                      setStatus({loading: false});
                      return history.push('/category')
                  }).catch( (err) => {
                      if(err.response){
                          setStatus({
                              type: 'error',
                              mensagem: err.response.data.mensagem,
                              loading: false
                          })
                      } else {
                          setStatus({
                              type: 'error',
                              mensagem: 'Erro: Tente mais Tarde !',
                              loading: false
                          });              
                      };
                  });
        };
    };

    return(
        <div>    
             {/* <Navbar bg="dark" variant="dark">
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
            </Navbar> */}
            <Container className="box">
              
              <Form onSubmit={formSubmit} className="borderForm">
                {['success',].map((variant) => (
                  <p>
                    {status.type == 'success' ? 
                    <Alert key={variant} variant={variant}>{status.mensagem}</Alert>: ""}
                  </p>
                ))}
          
                {['danger',].map((variant) => (
                  <p>
                    {status.type == 'error' ? 
                    <Alert key={variant} variant={variant}>{status.mensagem}</Alert>: ""}
                  </p>
                ))}
          
                {['warning'].map((variant) => (
                  <p>
                    {status.loading ?
                  <Alert key={variant} variant={variant}> Enviando... </Alert> : ""}
                  </p>
                ))}
                <h1>{acao}(a) Categoria</h1>
                <hr />
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Nome da Categoria:</Form.Label>
                  <Form.Control type="text" name="name" required value={values.name} onChange={valorInput} placeholder="Nome..." />
                </Form.Group>  

                <Form.Group className="mb-3" controlId="formBasicDescription">
                  <Form.Label>Descrição da Categoria:</Form.Label>
                  <Form.Control type="text" name="description" required value={values.description} onChange={valorInput} placeholder="Descrição..." />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                </Form.Group>
                {status.loading ? <Button id="button" variant="primary" disabled type="submit" >Enviando...</Button>
                : <Button id="button" variant="primary" type="submit">Enviar</Button>}
              </Form>
          </Container>
        </div>
    )
}