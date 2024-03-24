import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";

function App() {
  const [user, setUser] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [permissions, setPermissions] = useState([]);

  const LoginFunction = (isLoggedIn) => {
    setLoggedIn(isLoggedIn);
  };

  const permissionsRetrieve = (listOfPermissions) => {
    setPermissions(listOfPermissions.filter((perm) => perm.includes("paint")));
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            loggedIn ? (
              <Home
                permissions={permissions}
                loginFunction={LoginFunction}
                user={user}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            !loggedIn ? (
              <Login
                setLoggedIn={LoginFunction}
                setPermissions={permissionsRetrieve}
                user={setUser}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
