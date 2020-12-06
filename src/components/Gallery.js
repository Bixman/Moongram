import React from "react";
import PropTypes from "prop-types";
import MiniImg from "./MiniImg";
import "./Gallery.scss";

function Gallery(props) {
  const imgGallery = props.gallery;
  const imgs = imgGallery
    .filter(username => props.username === username.username)
    .map(({ id, img_url }) => <MiniImg img_url={img_url} key={id} />);

  return (
    <div className="gallery">
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
        <p>Zaloguj się, żeby zobaczyć swoją galerię</p>
      )}
    </div>
  );
}

Gallery.propTypes = {
  gallery: PropTypes.array,
  username: PropTypes.string
};

export default Gallery;
