import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import Header from '../components/Header'
import Hero from '../components/Hero'
import { useSelector } from 'react-redux'
const  Home= () =>{
    // const user = useSelector((state)=>state.user)
    // console.log(user,"user ivade ethii")

  return (
    <>
    <Header/>
    <Hero/>
    </>
  )
}

export default Home