import React from 'react'
import Sidebar from "./Sidebar"
import DashCards  from './DashCards'

const Dashboard = () => {
  return (
    <>
    
    <div className='flex flex-row flex-wrap w-full max-w-screen'>
    <div >
    <Sidebar/>
    </div>
    <DashCards />
    <DashCards />
    <DashCards />
    </div>
    </>
  )
}

export default Dashboard