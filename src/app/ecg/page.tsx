"use client"
import React from 'react'
import Image from 'next/image'
import styles from "./ecg.module.css";
import {get, onValue, ref} from "firebase/database";
import { useEffect, useState } from 'react';
import { database } from '../../../firebase/clientAPP';

const page = () => {
    const [heartbeat, setHeartbeat] = useState([]);

    useEffect(() => {
        const dataRef = ref(database, 'heart'); 
    
        const unsubscribe = onValue(dataRef, (snapshot) => {
          const value = snapshot.val();
          setHeartbeat(value);
          console.log(value);
        });
        return () => unsubscribe();
      }, []);

    return (
    <article className={styles.ecg}>
        <h1 className={styles.title}> <Image src={"/images/main/img1.png"} height={50} width={50} alt='heart'/> ECG Checkup</h1>
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