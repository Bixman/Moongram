import React from "react";
import "./SideLeft.scss";
import PropTypes from "prop-types";

function SideLeft(props) {
  return (
    <div className="sideLeft">
      <button onClick={() => props.chooseView("allPosts")}>Posty</button>
      <button onClick={() => props.chooseView("userPosts")}>Twoje posty</button>
      <button onClick={() => props.chooseView("userGallery")}>
        Zobacz swoją galerię
      </button>
    </div>
  );
}
SideLeft.propTypes = {
  chooseView: PropTypes.func
};
export default SideLeft;
