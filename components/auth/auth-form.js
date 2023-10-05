import { useState, useRef } from "react";
import classes from "./auth-form.module.css";
import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
//
//
function AuthForm() {
  const router = useRouter();
  const [session, loading] = useSession();
  const [isLogin, setIsLogin] = useState(true);
  const refEmail = useRef();
  const refPassword = useRef();

  async function handlerSubmit(e) {
    e.preventDefault();
    const loginDetails = {
      email: refEmail.current.value,
      password: refPassword.current.value,
    };
    // if existing account
    if (isLogin) {
      const result = await signIn("credentials", {
        redirect: false, // true if callbackUrl provided
        email: loginDetails.email,
        password: loginDetails.password,
        //callbackUrl: `${window.location.origin}/xxx`,
      });

      if (!result.error) {
        /* ++++++++++++++++++++
         THIS WORKS
        ++++++++++++++++++++++ */
        router.replace("/profile");
      }
    } else {
      // if new user signing up
      fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(loginDetails),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          // redirect to profile page
          /* -------------------
           THIS DOES NOT WORK ??
          ---------------------- */
          router.replace("/profile");
          console.log(router);
          // //<-- doesnt work
          //window.location.href = "/profile";
        });
    }
  }

  function switchAuthModeHandler() {
    //e.preventDefault();
    setIsLogin((prevState) => !prevState);
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={handlerSubmit}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={refEmail} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" required ref={refPassword} />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
