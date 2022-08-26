import React, { useState, useContext } from "react";
import Alert from 'react-bootstrap/Alert';
import { Container } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './styles.css';
import api from '../../services/api';
import { useHistory } from 'react-router-dom';
import { Context } from '../../Context/AuthContext';

export function Login() {
  const history = useHistory();  

  const { authenticated, singIn } = useContext(Context);
  console.log(`Situação do usuário na página Login: ${authenticated}`);

  const [user, setUser] = useState({
    email: '',
    password: ''
  })

  const [status, setStatus] = useState({
    type: '',
    mensagem: '',
    loading: false
  })

  const valorInput = e => setUser({ 
    ...user, 
    [e.target.name]: e.target.value
  })

  const loginSubmit = async e => {

    e.preventDefault();

    setStatus({
      loading:true,
    })

    const headers = {
      'Content-Type': 'application/json'
    }

    await api.post("/users/login", user, {headers})
    .then((response) => {
      setStatus({
        type: 'success',
        mensagem: response.data.mensagem
      })

      localStorage.setItem('token', (response.data.token));

      singIn(true);
      
      return history.push('/dashboard');

    }).catch((err) => {
      setStatus({
          type: 'error',
          mensagem: 'Erro: Tente mais Tarde !'
      })
      if(err.response){
        setStatus({
          type: 'error',
          mensagem: err.response.data.mensagem,
          loading: false
        })
      }
    })
  }
    return(
        <div className="background">
          <Container className="box">
              <Form onSubmit={loginSubmit} className="borderForm">
                {[
        'success',
      ].map((variant) => (
        <p>
          {status.type == 'success' ? 
          <Alert key={variant} variant={variant}>{status.mensagem}</Alert>: ""}
        </p>
      ))}
      {[
        'danger',
      ].map((variant) => (
        <p>
          {status.type == 'error' ? 
          <Alert key={variant} variant={variant}>{status.mensagem}</Alert>: ""}
        </p>
      ))}
      {[
        'warning'
      ].map((variant) => (
        <p>
          {status.loading ?
        <Alert key={variant} variant={variant}>Validando...</Alert> : ""}
        </p>
      ))}
                
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <h1>Login</h1>
                  <hr />
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control type="email" name="email" required onChange={valorInput} placeholder="Entre com seu E-mail" />
                  <Form.Text className="text-muted">
                    Nunca compartilharemos seus dados com ninguém.
                  </Form.Text>
                </Form.Group>
      
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control type="password" name="password" onChange={valorInput} placeholder="Entre com sua Senha" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check type="checkbox" label="Manter Sessão" />
                </Form.Group>
                {status.loading ? <Button id="button" variant="primary" disabled type="submit" >Acessando...</Button>
                : <Button id="button" variant="primary" type="submit" >Entrar</Button>}                
              </Form>
          </Container>
        </div>
    )

}