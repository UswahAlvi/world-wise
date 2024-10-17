import styles from './Button.module.css'

export default function Button({type,onClick,children}){
    return(
        <button className={`${styles.btn} ${styles[type]}`} onClick={onClick}>
            {children}
        </button>
    )
}