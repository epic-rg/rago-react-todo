import React from 'react'

const Navbar = () => {
  return (
    <nav className='flex justify-between bg-violet-700 mx-auto text-white p-2 px-8'>

        <div className="font-bold text-4xl">
            TO-DO-APP
        </div>
       
       <ul className="flex flex-row gap-12 justify-center items-center">
        <li className='cursor-pointer hover:font-bold duration-300'>Home</li>
        <li className='cursor-pointer hover:font-bold duration-300'>Your tasks</li>
       </ul>

    </nav>
  )
}

export default Navbar
