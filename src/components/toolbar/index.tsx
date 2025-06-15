import { useState } from 'react';
import { TOOLBAR_ITEMS } from './resolver';
import styles from './toolbar.module.css';
export default function Toolbar() {
    const [activeTool, setActiveTool] = useState<number>(-1);
    return (
        <div className={styles.container}>
            <div className={styles.toolbar}>
                {TOOLBAR_ITEMS.map((item, index) => (
                    <div
                        key={index}
                        className={`${styles.toolbarButton} ${activeTool === index ? styles.active : ''}`}
                        onClick={() => setActiveTool(index)}
                    >
                        <img src={item.icon} alt={item.label} className={styles.icon} />
                    </div>
                ))}
            </div>
        </div>
    );
}