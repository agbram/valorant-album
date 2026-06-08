import { Link } from "@tanstack/react-router";
import styles from './Navbar.module.css'
import { useNavigate } from '@tanstack/react-router'


export default function Navbar() {
const navigate = useNavigate()
  return (
    <>
      <div>
<nav className={styles.navbar}>
    <span className={styles.logo} onClick={() => navigate({ to: '/album' })}>Valorant STICKERS</span>
  <Link to="/" className={styles.link}>Dashboard</Link>
  <Link to="/album" className={styles.link}>Álbum</Link>
  <Link to="/figurinhas" className={styles.link}>Figurinhas</Link>
  <Link to="/figurinhas/nova" className={styles.btnNova}>Figurinha nova</Link>
</nav>
      </div>
    </>
  );
}
