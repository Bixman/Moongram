import React, { useState } from "react";
import "./NewPost.scss";
import { storage, db, firebase } from "../firebase";
import PropTypes from "prop-types";

function NewPost(props) {
  const [description, setDescription] = useState("");
  const [img, setImg] = useState(null);
  const [progressBar, setProgressBar] = useState(0);
  const [photoName, setPhotoName] = useState("");

  const handleImg = event => {
    if (event.target.files[0]) {
      setImg(event.target.files[0]);
      setPhotoName(event.target.value);
    }
  };

  const handleUpload = e => {
    e.preventDefault();
    if (img && description) {
      const uploadTask = storage.ref(`images/${img.name}`).put(img);
      uploadTask.on(
        "state_changed",
        snapshot => {
          const progressBar = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgressBar(progressBar);
        },
        error => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(img.name)
            .getDownloadURL()
            .then(urlImg => {
              db.collection("posts").add({
                img_url: urlImg,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                description: description,
                username: props.username
              });
              setProgressBar(0);
              setDescription("");
              setImg(null);
              setPhotoName("");
            });
        }
      );
    } else {
      alert("Musisz dodać zdjęcie lub opis");
    }
  };

  return (
    <div className="newPost" onSubmit={handleUpload}>
      <form>
        <label htmlFor="newPost">Nowy post:</label>
        <textarea
          type="text"
          id="newPost"
          placeholder="Napisz swojego posta..."
          value={description}
          onChange={event => setDescription(event.target.value)}
        ></textarea>

        <label htmlFor="img_upload">Wybierz zdjęcie:</label>
        <input
          type="file"
          id="img_upload"
          accept="image/*"
          className="visualHidden"
          value={photoName}
          onChange={handleImg}
        />
        <progress value={progressBar} max="100" />
        <button type="submit">Dodaj</button>
      </form>
    </div>
  );
}

NewPost.propTypes = {
  username: PropTypes
};

export default NewPost;
