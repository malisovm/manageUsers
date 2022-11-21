import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import SignInForm from './components/SignInForm'
import SignUpForm from './components/SignUpForm'
import { UsersTable } from './components/UsersTable'

export default function App() {


  //<ApiProvider api={usersApi}>
  //</ApiProvider>

  return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SignInForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/users" element={<UsersTable />} />
          </Routes>
        </BrowserRouter>
  )
}
