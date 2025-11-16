import React from 'react'
import Sidebar from '../Pages/Sidebar'
import { Outlet } from 'react-router-dom'
import Navbar from '../Pages/Navbar'

function Applayout() {
  return (
    <div>
     <div className='ml-63 w-full'>
       <Navbar/>
     </div>
      <aside>
        <Sidebar/>
      </aside>
      <div className='w-[86.5vw] ml-[13vw] mt-[7vh]'>
        <Outlet/>
      </div>


    </div>
  )
}

export default Applayout
