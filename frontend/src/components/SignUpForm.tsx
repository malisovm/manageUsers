import React, { useRef, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Link, useNavigate } from 'react-router-dom'
import Container from './Container'
import { useAddUserMutation } from '../redux/usersApi'
import { nanoid } from '@reduxjs/toolkit'
import { User } from '../interfaces'
import Message from './Message'

export default function SignUpForm() {
  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const [addUser] = useAddUserMutation()
  const navigate = useNavigate()
  const [message, setMessage] = useState({ show: false, text: '', variant: '' })

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    const UTCDate = new Date().toUTCString()
    const shortDate = /\d{1,2}\s\D{3}\s\d{4}/.exec(UTCDate)![0]
    let newUser: User = {
      _id: nanoid(),
      name: nameRef!.current!.value,
      email: emailRef!.current!.value,
      password: passwordRef!.current!.value,
      created: shortDate,
      lastVisit: '',
      active: true,
    }
    addUser(newUser)
      .unwrap()
      .then((fulfilled) => {
        setMessage({ show: true, text: 'User created!', variant: 'success' })
        setTimeout(() => {
          navigate('/')
        }, 1500)
      })
      .catch((rejected) =>
      setMessage({
          show: true,
          text: rejected.data.message,
          variant: 'danger',
        })
      )
  }

  return (
    <Container>
      <h3>Create Account</h3>
      <br />
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            ref={nameRef}
            required
            placeholder="Enter username"
            autoComplete="off"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            ref={emailRef}
            required
            type="email"
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            ref={passwordRef}
            required
            type="password"
            placeholder="Enter password"
          />
        </Form.Group>
        <Button className="mb-3" variant="primary" type="submit">
          Submit
        </Button>
        <br />
        <Link to="/" style={{ fontSize: '0.8rem' }}>
          Back to log in
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
