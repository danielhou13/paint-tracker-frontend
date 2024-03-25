import React, { useState } from "react";
import KanbanBoard from "../KanbanBoard/KanbanBoard";

export default function Home({ permissions, loginFunction, user }) {
  const [notAdam, setnotAdam] = useState(false);

  //navbar with sys admin menu that only works if user === adam. Footer with more details, middle kanbanboard
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <span className="navbar-brand">Paint Availability Kanban Board</span>
          <ul className="navbar-nav">
            {user === "Adam" ? (
              <li className="nav-item active">
                <a
                  className="nav-link px-2"
                  href="https://django-paint-6d3cee377c88.herokuapp.com/admin/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  System admin menu
                </a>
              </li>
            ) : (
              <li className="nav-item">
                <button className="nav-link" onClick={() => setnotAdam(true)}>
                  System admin menu
                </button>
              </li>
            )}

            <li className="navbar-text px-2">Current User: {user}</li>
            <li className="nav-item">
              <button className="nav-link" onClick={() => loginFunction(false)}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <KanbanBoard
        permissions={permissions}
        loginFunction={loginFunction}
      ></KanbanBoard>
      {notAdam && (
        <div
          className="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          You do not have authorization to access the System Admin menu.
          Currently only Adam has authorization.
          <button
            type="button"
            className="btn-close"
            data-dismiss="alert"
            onClick={() => setnotAdam(false)}
          ></button>
        </div>
      )}
      <footer className="fixed-bottom mt-auto py-2 bg-light">
        All users except for John can edit the stock of paints. The system admin
        Adam can update the permissions and assigned groups of each user to
        allow for different permissions.
      </footer>
    </div>
  );
}
