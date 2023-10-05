import Link from "next/link";
import { useSession, signOut } from "next-auth/client";
import classes from "./main-navigation.module.css";

function MainNavigation() {
  const [session, loading] = useSession();
  console.log("session : ", session);
  console.log("loading : ", loading);

  function handlerSignOut() {
    signOut({ callbackUrl: `${window.location.origin}/auth` });
  }
  return (
    <header className={classes.header}>
      <Link href="/">
        <a>
          <div className={classes.logo}>Next Auth</div>
        </a>
      </Link>
      <nav>
        <ul>
          {
            // only show LOGIN when not log in
            !session && (
              <li>
                <Link href="/auth">Login</Link>
              </li>
            )
          }
          {
            // greet the user when logged in
            session && <li>welcome back, {session.user.email}</li>
          }

          {
            // only show PROFILE when logged in
            session && (
              <li>
                <Link href="/profile">Profile</Link>
              </li>
            )
          }

          {
            // only show LOGUT when logged in
            session && (
              <li>
                <button onClick={handlerSignOut}>Logout</button>
              </li>
            )
          }
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
