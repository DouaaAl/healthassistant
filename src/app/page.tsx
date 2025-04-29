import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main>
        <Image className={styles.img}
        src={"/images/main.png"}
        height={896}
        width={1393}
        alt="main"
        />
        <Image className={styles.waves}
        src={"/images/shapes/waves.png"}
        height={140}
        width={1534}
        alt="waves"
        />
        <Image
        className={styles.biground}
        src={"/images/shapes/biground.png"}
        height={525}
        width={639}
        alt="circle"
        />
        <div className={styles.start}>
          <h1>Start Here</h1>
          <ul>
            <li><a href="">
              <Image
              height={50}
              width={50}
              src={"/images/main/img1.png"}
              alt="ecg"
              />
              <h3 className="red">ECG Checkup</h3>
              </a></li>
            <li><a href="">
            <Image
              height={50}
              width={50}
              src={"/images/main/img2.png"}
              alt="ecg"
              />
              <h3 className="yellow">Find A Doctor</h3>
              </a></li>
            <li><a href="">
            <Image
              height={50}
              width={50}
              src={"/images/main/img3.png"}
              alt="ecg"
              />
              <h3 className="green">Blood Oxygene</h3>
              </a></li>
            <li><a href="">
            <Image
              height={50}
              width={50}
              src={"/images/main/img4.png"}
              alt="ecg"
              />
              <h3 className="purple">Health History</h3>
              </a></li>
          </ul>
          <a href="">
          <button>Get Health Assistance !</button>
          </a>
        </div>
      </main>
    </div>
  );
}
