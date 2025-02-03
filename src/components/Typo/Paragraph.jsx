import React from 'react'

function Paragraph({children, className}) {
  return (
    <p className={`lg:text-xl mt-3 text-gray-500 ${className}`}>{children}</p>
  )
}

export default Paragraph