import React from 'react';
import styles from './index.module.css';

interface IProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "defaultValue"> {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
}

const Slider = React.forwardRef<HTMLInputElement, IProps>(
  ({ onChange, onBlur, name, min = 0, max = 100, value: valueProp, defaultValue = 50, ...rest }, ref) => {
    const initialValue = typeof valueProp !== 'undefined' ? Number(valueProp) : Number(defaultValue ?? 50);
    const [value, setValue] = React.useState(initialValue);

    React.useEffect(() => {
      if (typeof valueProp !== "undefined") {
        setValue(Number(valueProp));
      }
    }, [valueProp]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = Number(e.target.value);
      setValue(nextValue);
      if (onChange) onChange(nextValue);
    };

    return (
      <div className={styles.sliderDiv}>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          value={value}
          name={name}
          className={styles.slider}
          onChange={handleChange}
          onBlur={onBlur}
          {...rest}
        />
        <p className={styles.sliderValue}>{value}</p>
      </div>
    );
  }
);

Slider.displayName = "Slider";

export default Slider;
