import React from 'react'

function Header1({children, className}) {
  return (
    <h1 className={`text-3xl lg:text-5xl font-semibold ${className}`}>{children}</h1>
  )
}

export default Header1