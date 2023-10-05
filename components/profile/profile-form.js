import classes from "./profile-form.module.css";
import { useRef } from "react";
function ProfileForm() {
  const refPasswordNew = useRef();
  const refPasswordOld = useRef();
  //
  async function handleSubmit(e) {
    e.preventDefault();
    const passwordOld = refPasswordOld.current.value;
    const passwordNew = refPasswordNew.current.value;
    //console.log(passwordOld, passwordNew);
    if (passwordOld.trim().length < 7 || passwordNew.trim().length < 7) {
      console.log("Password length not met!");
      return;
    }
    fetch("api/user/update-password", {
      method: "PATCH",
      body: JSON.stringify({
        passwordOld: passwordOld,
        passwordNew: passwordNew,
      }),
      headers: { "Content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }
  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={refPasswordNew} />
      </div>
      <div className={classes.control}>
        <label htmlFor="old-password">Old Password</label>
        <input type="password" id="old-password" ref={refPasswordOld} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
