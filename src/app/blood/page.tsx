import React from 'react'
import Image from 'next/image'
import styles from "./blood.module.css";

const page = () => {
  return (
    <article className={styles.blood}>
        <h1 className={styles.title}> <Image src={"/images/main/img2.png"} height={50} width={50} alt='heart'/> Blood Oxygene</h1>
        <article className={styles.checkup}>
            <div className={styles.flex}>
                <h2>Realtime Checkup</h2>
                <button className={styles.blue}>Start Here</button>
            </div>
            <div>

            </div>
            <div className={styles.flex}>
                <h4><span>Result:</span> No Apparant sickness</h4>
                <button className={styles.orange}>Register</button>
            </div>
        </article>

        <article className={styles.checkup}>
            <div className={styles.flex}>
                <h2>History Checkup</h2>
                <button className={styles.blue}>Start Here</button>
            </div>
            <div>

            </div>
            <div className={styles.flex}>
                <h4><span>Result:</span> No Apparant sickness</h4>
                <button className={styles.orange}>Register</button>
            </div>
        </article>
    </article>
  )
}

export default page