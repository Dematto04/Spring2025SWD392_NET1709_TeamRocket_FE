import React from 'react'
import { ThemeToggle } from '../ui/theme-toggle'
import { Button } from '../ui/button'
import { useDispatch } from 'react-redux'
import { login, logout } from '@/redux/features/authSlice'

function Navbar() {
    const dispatch = useDispatch()
    const handleLogin = () => {
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
    <div className='p-3 flex items-center justify-between'>
        <div className='w-40'>
            <img src='/public/logo.png' className='object-contain w-full'/>
        </div>
        <div>
            
        </div>
        <ThemeToggle/>
    </div>
  )
}

export default Navbar