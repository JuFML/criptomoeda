import styles from './header.module.css'
import { Link } from 'react-router'
import Logoimg from '../../assets/logo.svg'

const Header = () => {
    return (
        <header className={styles.container}>
            <Link to='/'>
                <img src={Logoimg} alt="Logo image" />
            </Link>
        </header>
    )
}

export { Header }