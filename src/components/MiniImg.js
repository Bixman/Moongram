import React, { useState } from "react";
import "./MiniImg.scss";
import PropTypes from "prop-types";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles(() => ({
  paper: {
    position: "absolute",
    border: "2px solid #a3a3a3",
    padding: "1vw"
  }
}));

function MiniImg(props) {
  const [imgPopUp, setImgPopUp] = useState(false);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  return (
    <div className="miniImg">
      <img
        className="miniImg__single"
        src={props.img_url}
        alt="Coś poszło nie tak"
        id={props.key}
        onClick={() => setImgPopUp(true)}
      ></img>
      <Modal open={imgPopUp} onClose={() => setImgPopUp(false)}>
        <div style={modalStyle} className={classes.paper}>
          <button
            className="miniImg__closeBig"
            onClick={() => setImgPopUp(false)}
          >
            X
          </button>
          <img
            className="miniImg__singleBig"
            src={props.img_url}
            alt="Coś poszło nie tak"
            id={props.key}
          ></img>
        </div>
      </Modal>
    </div>
  );
}

MiniImg.propTypes = {
  img_url: PropTypes,
  key: PropTypes
};

export default MiniImg;
