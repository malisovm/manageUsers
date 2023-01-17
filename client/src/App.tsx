import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import SignInForm from './components/SignInForm'
import SignUpForm from './components/SignUpForm'
import { UsersTable } from './components/UsersTable'
import { useAppSelector } from './redux/hooks'
import { Navigate } from 'react-router-dom'

export default function App() {
  const auth = useAppSelector((state) => state.auth)

  return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SignInForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/users" element={auth.status ? <UsersTable /> : <Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
  )
}
