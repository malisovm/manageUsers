import React, { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { TbLockOpen, TbLock, TbTrash } from 'react-icons/tb'
import Form from 'react-bootstrap/Form'
import Container from './Container'
import { User } from '../interfaces'
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useBlockUserMutation,
} from '../redux/usersApi'
import Spinner from 'react-bootstrap/Spinner'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { useNavigate } from 'react-router-dom'
import { authenticated } from '../redux/authSlice'
import { useLazyIsUserActiveQuery } from '../redux/usersApi'

export function UsersTable() {
  const { data, isLoading, isError } = useGetUsersQuery()
  const [allChecked, setAllChecked] = useState(false)
  const [userIds, setUserIds] = useState<string[]>([])
  const [checkedUserIds, setCheckedUserIds] = useState<string[]>([])
  const [deleteUser] = useDeleteUserMutation()
  const [blockUser] = useBlockUserMutation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)
  const [checkUserStatus] = useLazyIsUserActiveQuery()

  useEffect(() => {
    if (!auth.status) navigate('/')
  }, [auth, navigate])

  useEffect(() => {
    if (data) setUserIds(data.map((user: User) => user._id))
  }, [data])

  async function checkIfActive() {
    let result = await checkUserStatus(auth.user)
    return result
  }

  function logoff() {
    dispatch(authenticated({ status: false, user: auth.user }))
  }

  function handleCheck(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, checked } = e.target
    if (checked) setCheckedUserIds([...checkedUserIds, id])
    else
      setCheckedUserIds([...checkedUserIds].filter((userId) => userId !== id))
    setAllChecked(false)
  }

  function handleCheckAll() {
    if (allChecked) setCheckedUserIds([])
    else setCheckedUserIds(userIds)
    setAllChecked(!allChecked)
  }

  async function handleDelete() {
    let status = await checkIfActive()
    if (!status.data) logoff()
    else {
      deleteUser(checkedUserIds)
      if (checkedUserIds.includes(auth.user)) logoff()
    }
  }

  async function handleBlock() {
    let status = await checkIfActive()
    if (!status.data) logoff()
    else {
      blockUser({ ids: checkedUserIds, active: false })
      if (checkedUserIds.includes(auth.user)) logoff()
    }
  }

  async function handleUnblock() {
    let status = await checkIfActive()
    if (!status.data) logoff()
    else blockUser({ ids: checkedUserIds, active: true })
  }

  if (isLoading)
    return (
      <Container>
        <Spinner animation="border" />
      </Container>
    )

  if (isError)
    return (
      <Container>
        <h1>An error has occured!</h1>
      </Container>
    )

  return (
    <Container>
      <ButtonGroup aria-label="Basic example">
        <Button variant="dark" onClick={handleBlock}>
          <TbLock />
          Block
        </Button>
        <Button variant="secondary" onClick={handleUnblock}>
          <TbLockOpen />
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          <TbTrash />
        </Button>
      </ButtonGroup>
      <br />
      Current id: {auth.user}
      <br />
      <br />
      <Table striped bordered hover responsive="md">
        <thead>
          <tr>
            <th>
              <Form.Check
                checked={allChecked}
                aria-label="mainCheck"
                onChange={handleCheckAll}
              />
            </th>
            <th>id</th>
            <th>Name</th>
            <th>eMail</th>
            <th>Created</th>
            <th>Last visit</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user: User) => (
            <tr key={user._id}>
              <td>
                <Form.Check
                  onChange={handleCheck}
                  checked={checkedUserIds.includes(user._id)}
                  id={user._id}
                  aria-label={user._id}
                />
              </td>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.created}</td>
              <td>{user.lastVisit}</td>
              <td>{user.active ? 'Active' : 'Blocked'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}
