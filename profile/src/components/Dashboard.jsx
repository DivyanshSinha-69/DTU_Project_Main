import React from 'react'
import Sidebar from "./Sidebar"
import DashCards  from './DashCards'

const Dashboard = () => {
  return (
    <div>
      <Sidebar/>
      <DashCards />
      <DashCards />
      <DashCards />
    </div>

  )
}

export default Dashboard