import React from 'react'
import Sidebar from '../assets/Sidebar.jsx'
import { Outlet } from 'react-router-dom'
import Navbar from '../assets/Navbar.jsx'

function Applayout() {
  return (
    <div>
     <div className='sm:ml-63 w-full'>
       <Navbar/>
     </div>
      <aside className='hidden sm:flex'>
        <Sidebar/>
      </aside>
      <div className='w-[86.5vw] ml-[13vw] mt-[7vh]'>
        <Outlet/>
      </div>


    </div>
  )
}

export default Applayout
