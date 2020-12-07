import React, { useState, useEffect } from "react";
import "./Nav.scss";
import { auth } from "../firebase";
import { Avatar } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { layoutGenerator } from "react-break";
import { Menu, MenuItem } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";

const layout = layoutGenerator({
  mobile: 0,
  tablet: 650,
  desktop: 950
});

const OnMobile = layout.is("mobile");
const OnTablet = layout.is("tablet");
const OnDesktop = layout.is("desktop");

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: "#5c00b8",
    border: "3px solid #a3a3a3",
    borderRadius: "10px",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

function Nav(props) {
  const classes = useStyles();
  const [logIn, setLogIn] = useState(false);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [modalStyle] = useState(getModalStyle);
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerAlert, setRegisterAlert] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
        passingLog(user.displayName);
      } else {
        setUser(null);
        passingLog(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

  function passingLog(name) {
    props.addName(name);
  }

  const logging = e => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.message));
    setLogIn(false);
  };

  const registerring = e => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        return authUser.user.updateProfile({
          displayName: username
        });
      })
      .then(() => auth.signOut())
      .catch(error => alert(error.message));
    setRegister(false);
    setRegisterAlert(true);
  };

  const menuItem = {
    color: "#dbdbdb",
    backgroundColor: "#5c00b8",
    border: "2px solid #a3a3a3",
    hover: {
      color: "#000000",
      backgroundColor: "#bf80ff",
      borderColor: "#000000"
    }
  };

  const navLogo = (
    <div>
      <img
        src="/logo_min.png"
        alt="Brak loga"
        onClick={() => props.chooseView("allPosts")}
      ></img>
      <h1 onClick={() => props.chooseView("allPosts")}>Moongram</h1>
    </div>
  );

  return (
    <div className="navbar">
      <OnMobile>
        <div className="navbar">
          <div>
            {user?.displayName ? (
              <Menu
                styles={{ backgroundColor: "#bf80ff" }}
                menuButton={
                  <button className="navbar__menu">
                    <i className="material-icons mobileMenu">list</i>
                  </button>
                }
              >
                <MenuItem
                  styles={menuItem}
                  onClick={() => props.chooseView("allPosts")}
                >
                  Posty
                </MenuItem>
                <MenuItem
                  styles={menuItem}
                  onClick={() => props.chooseView("userPosts")}
                >
                  Twoje posty
                </MenuItem>
                <MenuItem
                  styles={menuItem}
                  onClick={() => props.chooseView("userGallery")}
                >
                  Zobacz swoją galerię
                </MenuItem>
              </Menu>
            ) : (
              <Menu
                styles={{ backgroundColor: "#bf80ff" }}
                menuButton={
                  <button className="navbar__menu">
                    <i className="material-icons mobileMenu">list</i>
                  </button>
                }
              >
                <MenuItem styles={menuItem} onClick={() => setLogIn(true)}>
                  Zaloguj się
                </MenuItem>
                <MenuItem styles={menuItem} onClick={() => setRegister(true)}>
                  Zarejestruj się
                </MenuItem>
                <MenuItem
                  styles={menuItem}
                  onClick={() => props.chooseView("allPosts")}
                >
                  Posty
                </MenuItem>
                <MenuItem
                  styles={menuItem}
                  onClick={() => props.chooseView("userPosts")}
                >
                  Twoje posty
                </MenuItem>
                <MenuItem
                  styles={menuItem}
                  onClick={() => props.chooseView("userGallery")}
                >
                  Zobacz swoją galerię
                </MenuItem>
              </Menu>
            )}

            <h1 onClick={() => props.chooseView("allPosts")}>Moongram</h1>
          </div>
          {user?.displayName ? (
            <div className="navbar__logOut">
              <Avatar
                className="post__avatar"
                alt={user.displayName}
                src="brak"
              />
              <button onClick={() => auth.signOut()}>Wyloguj się</button>
            </div>
          ) : (
            <div className="navbar__logIn"></div>
          )}
        </div>
      </OnMobile>
      <OnTablet>
        <div className="navbar">
          <div>{navLogo}</div>
          {user?.displayName ? (
            <div className="navbar__logOut">
              <Avatar
                className="post__avatar"
                alt={user.displayName}
                src="brak"
              />
              <button onClick={() => auth.signOut()}>Wyloguj się</button>
            </div>
          ) : (
            <div className="navbar__logIn">
              <button onClick={() => setLogIn(true)}>Zaloguj się</button>
              <button onClick={() => setRegister(true)}>Zarejestruj się</button>
            </div>
          )}
        </div>
      </OnTablet>
      <OnDesktop>
        <div className="navbar">
          <div>{navLogo}</div>
          {user?.displayName ? (
            <div className="navbar__logOut">
              <h2>{user.displayName}</h2>
              <Avatar
                className="post__avatar"
                alt={user.displayName}
                src="brak"
              />
              <button
                onClick={() => {
                  auth.signOut(), props.chooseView("allPosts");
                }}
              >
                Wyloguj się
              </button>
            </div>
          ) : (
            <div className="navbar__logIn">
              <button onClick={() => setLogIn(true)}>Zaloguj się</button>
              <button onClick={() => setRegister(true)}>Zarejestruj się</button>
            </div>
          )}
        </div>
      </OnDesktop>
      <Modal open={register} onClose={() => setRegister(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="navbar__registration" onSubmit={registerring}>
            <input
              placeholder="Nazwa użytkownika (max 10 znaków)"
              type="text"
              maxLength="10"
              value={username}
              required
              onChange={e => setUsername(e.target.value)}
            />
            <input
              placeholder="Email (dowolny, w odpowiednim formacie)"
              type="email"
              value={email}
              required
              onChange={e => setEmail(e.target.value)}
            />
            <input
              placeholder="Hasło (max 10 znaków)"
              type="password"
              maxLength="10"
              value={password}
              required
              onChange={e => setPassword(e.target.value)}
            />
            <button className="button" type="submit">
              Zarejestruj się
            </button>
            <button onClick={() => setRegister(false)}>Wyjdź</button>
          </form>
        </div>
      </Modal>
      <Modal open={logIn} onClose={() => setLogIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="navbar__logging">
            <input
              placeholder="Email"
              type="email"
              value={email}
              required
              onChange={e => setEmail(e.target.value)}
            />
            <input
              placeholder="Hasło"
              type="password"
              maxLength="10"
              value={password}
              required
              onChange={e => setPassword(e.target.value)}
            />
            <button onClick={logging}>Zaloguj</button>
            <button onClick={() => setLogIn(false)}>Wyjdź</button>
          </form>
        </div>
      </Modal>
      <Modal open={registerAlert} onClose={() => setRegisterAlert(false)}>
        <div style={modalStyle} className={classes.paper}>
          <div className="navbar__registerConfirmation">
            <center>
              <p>Zarejestrowano pomyślnie, możesz się teraz zalogować.</p>
              <button onClick={() => setRegisterAlert(false)}>Zamknij</button>
            </center>
          </div>
        </div>
      </Modal>
    </div>
  );
}

Nav.propTypes = {
  addName: PropTypes.func,
  chooseView: PropTypes.func
};

export default Nav;
