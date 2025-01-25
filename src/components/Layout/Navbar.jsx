import React from 'react'
import { ThemeToggle } from '../ui/theme-toggle'
import { Button } from '../ui/button'
import { useDispatch } from 'react-redux'
import { login, logout } from '@/redux/features/authSlice'

function Navbar() {
    const dispatch = useDispatch()
    const handleLogin = ()=> {
        dispatch(login({
            user: {
                name: 'Long',
                age: 21
            },
            userToken: {
                refreshToken: '123abc',
                accessToken: '123abc12312312313131'
            }
        }))
    }
  return (
    <div>
        <ThemeToggle/>
        navbar
        <Button onClick={handleLogin}>Login</Button>
        <Button onClick={()=> dispatch(logout())}>Logout</Button>
    </div>
  )
}

export default Navbar