import React, { useState, useEffect } from "react";
import "./Post.scss";
import { Avatar } from "@material-ui/core";
import PropTypes from "prop-types";
import { db, firebase } from "../firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { layoutGenerator } from "react-break";

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

const layout = layoutGenerator({
  mobile: 0,
  tablet: 650,
  desktop: 950
});

const OnMobile = layout.is("mobile");
const OnTablet = layout.is("tablet");
const OnDesktop = layout.is("desktop");

function Post(props) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [imgPopUp, setImgPopUp] = useState(false);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  useEffect(() => {
    if (props.postId) {
      db.collection("posts")
        .doc(props.postId)
        .collection("comments")
        .orderBy("timestamp", "asc")
        .onSnapshot(snapshot => {
          setComments(snapshot.docs.map(doc => doc.data()));
        });
    }
  }, [props.postId]);

  const postComment = e => {
    e.preventDefault();
    db.collection("posts")
      .doc(props.postId)
      .collection("comments")
      .add({
        text: comment,
        username: props.user,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    setComment("");
  };

  return (
    <div className="post" id={props.key}>
      <div className="post__nav">
        <Avatar className="post__avatar" alt={props.username} src="brak" />
        <h2>{props.username}</h2>
      </div>
      <OnMobile>
        <img className="post__img" src={props.img_url} alt="Brak zdjęcia"></img>
      </OnMobile>
      <OnTablet>
        <img className="post__img" src={props.img_url} alt="Brak zdjęcia"></img>
      </OnTablet>

      <OnDesktop>
        <img
          className="post__img"
          src={props.img_url}
          alt="Brak zdjęcia"
          onClick={() => setImgPopUp(true)}
        ></img>
      </OnDesktop>
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

      <div className="post__description">
        <p>
          <strong>{props.username}:</strong>
        </p>
        <p>{props.description}</p>
      </div>
      <div className="post__commentsAll">
        {comments.map(comment => (
          <p key={props.key}>
            <strong>
              {comment.username}
              {": "}
            </strong>
            {comment.text}
          </p>
        ))}
      </div>
      {props.user ? (
        <form className="post__commentsForm" onSubmit={postComment}>
          <input
            className="post__comment"
            type="text"
            placeholder="Dodaj komentarz"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <button type="submit" className="post__btn" disabled={!comment}>
            Dodaj swój komentarz
          </button>
        </form>
      ) : (
        <center>
          <p>Zaloguj się, aby dodawać komentarze</p>
        </center>
      )}
    </div>
  );
}

Post.propTypes = {
  username: PropTypes,
  postId: PropTypes,
  img_url: PropTypes,
  key: PropTypes,
  description: PropTypes,
  user: PropTypes
};

export default Post;
