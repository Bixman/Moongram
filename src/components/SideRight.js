import React from "react";
import "./SideRight.scss";
import PropTypes from "prop-types";
import MiniImg from "./MiniImg";

function SideRight(props) {
  const imgGallery = props.gallery;
  const imgs = imgGallery
    .filter(username => props.username === username.username)
    .slice(0, 9)
    .map(({ id, img_url }) => <MiniImg img_url={img_url} key={id} />);

  return (
    <div className="sideRight">
      <h2>Twoje najnowsze zdjęcia</h2>
      <div>
        {props.username ? (
          imgs != "" ? (
            imgs
          ) : (
            <p>
              Nie dodałes jeszcze żadnych zdjęć{" "}
              <i className="material-icons">sentiment_very_dissatisfied</i>
            </p>
          )
        ) : (
          <p>Nie jesteś zalogowany</p>
        )}
      </div>
    </div>
  );
}

SideRight.propTypes = {
  gallery: PropTypes,
  username: PropTypes,
  chooseView: PropTypes.func
};

export default SideRight;
