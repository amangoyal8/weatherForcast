import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Weather from '../Screens/Weather'

function Navigation() {
  return (
    <Routes>
      <Route path='/' element={<Weather />} />
    </Routes>
  )
}

export default Navigation
