import React, { useState, useRef } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Link } from 'react-router-dom'
import Container from './Container'
import { useVerifyUserMutation } from '../redux/usersApi'
import { useNavigate } from 'react-router-dom'
import Message from './Message'
import { useAppDispatch } from '../redux/hooks'
import { authenticated } from '../redux/authSlice'

export default function SignInForm() {
  const nameRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()
  const [message, setMessage] = useState({ show: false, text: '', variant: '' })
  const [verifyUser] = useVerifyUserMutation()
  const dispatch = useAppDispatch()

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    verifyUser({
      name: nameRef!.current!.value,
      password: passwordRef!.current!.value,
    }).then((result) => {
      //@ts-ignore
      if (result.data === 'not found')
        setMessage({
          show: true,
          text: 'Wrong username or password',
          variant: 'danger',
        })
      //@ts-ignore
      else if (result.data.active === false)
        setMessage({
          show: true,
          text: 'You have been blocked',
          variant: 'danger',
        })
      else {
        //@ts-ignore
        dispatch(authenticated({ status: true, user: result.data._id }))
        navigate('/users')
      }
    })
  }

  return (
    <Container>
      <h3>Log in</h3>
      <br />
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            placeholder="Enter username"
            autoComplete="off"
            ref={nameRef}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            ref={passwordRef}
          />
        </Form.Group>
        <Button className="mb-3" variant="primary" type="submit">
          Submit
        </Button>
        <br />
        <Link to="/signup" style={{ fontSize: '0.8rem' }}>
          Don't have an account? Sign up!
        </Link>
      </Form>
      {message.show && (
        <Message
          variant={message.variant}
          text={message.text}
          setMessage={setMessage}
        />
      )}
    </Container>
  )
}
