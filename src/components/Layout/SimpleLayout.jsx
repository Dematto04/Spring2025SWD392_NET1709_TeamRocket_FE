import React from 'react'
import { Outlet } from 'react-router-dom'

function SimpleLayout() {
  return (
    <>
        <Outlet/>
    </>
  )
}

export default SimpleLayout