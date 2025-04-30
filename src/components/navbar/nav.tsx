"use client"
import React, { useEffect, useState } from 'react'
import style from "./nav.module.css"
import Image from 'next/image'
import { checkDoctorMetadata, setDoctorMetadata, syncClerkUserToDb } from '@/server/user'

const nav = () => {
  const [noMetaData, setNoMetaData] = useState(false);

  const changeUserInfo = async(isDoctor: boolean) =>{
    let res = await setDoctorMetadata(isDoctor);
    setNoMetaData(false);
  }
  const checkIsDoc = async()=>{
    let res = await checkDoctorMetadata();
    setNoMetaData(!res);
  }
  const checkuser = async() =>{
    await syncClerkUserToDb();
    await checkIsDoc();
  }
  useEffect(()=>{
    checkuser();
  }, [])

  if(noMetaData){
    return <div>
      <article>
        <h1>Are You A</h1>
        <button onClick={()=>{changeUserInfo(true)}}>
          Doctor
        </button>
        <h1>Or</h1>
        <button onClick={()=>{changeUserInfo(false)}}>
          Patient
        </button>
      </article>
    </div>
  }
  return (
    <header className={style.header}>
        <h1>Health Assistant</h1>
        <ul>
            <li><a href="">Find A Doctor</a></li>
            <li><a href="">ECG Problems</a></li>
            <li><a href="">Blood Oxygene</a></li>
            <li><a href="">Health History</a></li>
            <li><a href="">
                <Image
                src={"/images/profile.png"}
                height={50}
                width={50}
                alt="profile"
                />
                </a></li>
        </ul>
    </header>
  )
}

export default nav