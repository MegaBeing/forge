import React from 'react';
import styles from './index.module.css';

const Slider = () => {
  const [value, setValue] = React.useState(50);
  return (
    <div className={styles.sliderDiv}>
      <input type="range" min={0} max={100} defaultValue={50} className={styles.slider} id="myRange" onChange={(e) => setValue(parseInt(e.target.value))} />
      <p className={styles.sliderValue}>{value}</p>
    </div>
  );
}

export default Slider;
