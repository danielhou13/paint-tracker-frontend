import axios from "axios";
import React, { useState } from "react";

export default function Login({ setLoggedIn, setPermissions, user }) {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("testtest12345");
  const [errorLogin, setErrorLogin] = useState(false);

  // Get user permissions and set logged in status
  const onButtonClick = () => {
    axios
      .post("https://django-paint-6d3cee377c88.herokuapp.com/api/login", {
        username: username,
        password: password,
      })
      .then((response) => {
        setErrorLogin(false);
        setLoggedIn(response.data.Logged_in);
        if (!!response.data.Permissions) {
          // get permissions' names
          setPermissions(
            response.data.Permissions.permissions_json.map(
              (item) => item.fields.name,
            ),
          );
        }
        console.log(response.data);
        user(response.data.name);
      })
      .catch((error) => {
        setErrorLogin(true);
      });
  };
  return (
    <div className="container-xl">
      <h1>Login</h1>
      <br />
      <form>
        <div className="form-group mt-3">
          <label>Email address</label>
          <input
            value={username}
            placeholder="Enter name/'painter'"
            onChange={(ev) => setusername(ev.target.value)}
            className="form-control"
          />
          <small className="form-text text-muted">
            Currently the only users are: Adam, John, Jane, painter. Please
            enter of of those values into the username. The system admin can use
            the Django admin tab to log in and add more users (password as
            below).
          </small>
        </div>
        <div className="form-group mt-5">
          <label>Password</label>
          <input
            value={password}
            placeholder="Enter your password here"
            onChange={(ev) => setPassword(ev.target.value)}
            className="form-control"
          />
          <small className="form-text text-muted">
            All users have the same password shown in the placeholder. The
            system admin (Adam) can log into the django admin page to change
            emails and permissions.
          </small>
        </div>
        <br />
        <div className="form-group mt-3">
          <input
            className={"inputButton"}
            type="button"
            onClick={onButtonClick}
            value={"Log in"}
          />
        </div>
      </form>

      {errorLogin && (
        <div className="alert alert-danger my-3">
          Could not log in message. (Need to implement username/password
          distinction)
        </div>
      )}
    </div>
  );
}
