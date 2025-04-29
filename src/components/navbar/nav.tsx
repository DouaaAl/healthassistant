import React from 'react'
import style from "./nav.module.css"
import Image from 'next/image'

const nav = () => {
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