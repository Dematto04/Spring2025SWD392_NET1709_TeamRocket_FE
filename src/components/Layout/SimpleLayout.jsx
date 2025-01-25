import React from 'react'
import { Outlet } from 'react-router-dom'

function SimpleLayout() {
  return (
    <>
        <div>None</div>
        <Outlet/>
    </>
  )
}

export default SimpleLayout