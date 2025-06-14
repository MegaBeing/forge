import styles from './toolbar.module.css';
export default function Toolbar() {
    return (
        <div className={styles.container}>
            <div className={styles.toolbar}>   
                <button className={styles.toolbarButton}>Button 1</button>
                <button className={styles.toolbarButton}>Button 2</button>
                <button className={styles.toolbarButton}>Button 3</button>
                <button className={styles.toolbarButton}>Button 4</button>
            </div>
        </div>
    );
}