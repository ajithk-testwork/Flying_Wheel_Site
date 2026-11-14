import Image from "next/image";
import styles from "./LoadingScreen.module.css";

interface LoadingScreenProps {
  totalFrames: number;
  loadedFrames: number;
}

export default function LoadingScreen({
  totalFrames,
  loadedFrames,
}: LoadingScreenProps) {
  const percentage =
    totalFrames > 0 ? Math.round((loadedFrames / totalFrames) * 100) : 0;

  const progress = Math.min(100, percentage);

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <Image
          src="/logo/logo.png"
          alt="Flying Wheel logo"
          width={200}
          height={200}
          className={styles.logo}
          priority
        />

        <div className={styles.progressWrapper}>
          <svg viewBox="0 0 100 100" className={styles.svg}>
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#262626"
              strokeWidth="6"
              fill="none"
            />

            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#FFC400"
              strokeWidth="6"
              fill="none"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              className={styles.progressCircle}
            />
          </svg>

          <div className={styles.percentage}>{progress}%</div>
        </div>

        <p>PREPARING YOUR RIDE...</p>
      </div>
    </div>
  );
}
