import { Button } from '@/components/ui/button'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function ServiceIntroPage() {
    const nav = useNavigate()
    const serviceId = 12
  return (
    <div className='mt-96 h-screen w-screen'>
        <div>ServiceIntroPage</div>
        <Button onClick={()=>nav(`/service/${serviceId}`)}>Book now</Button>
    </div>
  )
}

export default ServiceIntroPage