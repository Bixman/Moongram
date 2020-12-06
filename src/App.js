import "./App.scss";
import React, { useState, useEffect } from "react";
import Post from "./components/Post";
import Nav from "./components/Nav";
import SideLeft from "./components/SideLeft";
import SideRight from "./components/SideRight";
import NewPost from "./components/NewPost";
import Gallery from "./components/Gallery";
import { db } from "./firebase";
import { layoutGenerator } from "react-break";

const layout = layoutGenerator({
  mobile: 0,
  tablet: 650,
  desktop: 950
});

const OnMobile = layout.is("mobile");
const OnTablet = layout.is("tablet");
const OnDesktop = layout.is("desktop");

function App() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [view, setView] = useState("allPosts");

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
        setPosts(
          snapshot.docs.map(doc => ({
            id: doc.id,
            post: doc.data()
          }))
        );
      });
  }, []);

  function addName(name) {
    setUser(name);
  }

  function chooseView(view) {
    setView(view);
    console.log(view);
  }

  const postsList = posts.map(({ id, post }) => (
    <Post
      username={post.username}
      img_url={post.img_url}
      key={id}
      description={post.description}
      postId={id}
      user={user}
    />
  ));

  const userPostsList = posts
    .filter(userPost => user === userPost.post.username)
    .map(({ id, post }) => (
      <Post
        username={post.username}
        img_url={post.img_url}
        key={id}
        description={post.description}
        postId={id}
        user={user}
      />
    ));

  const gallery = posts.map(({ id, post }) => ({
    id: id,
    img_url: post.img_url,
    username: post.username
  }));

  const userGallery = <Gallery gallery={gallery} username={user} />;

  const views =
    (view === "allPosts" ? postsList : "") ||
    (view === "userGallery" ? userGallery : "") ||
    (view === "userPosts" && userPostsList != "" ? (
      userPostsList
    ) : user ? (
      <div className="app__zeroOwnPosts">
        <p>
          Nie dodałeś jeszcze żadnych postów{" "}
          <i className="material-icons">sentiment_very_dissatisfied</i>
        </p>
      </div>
    ) : (
      ""
    ));

  const addPost = user ? (
    <NewPost username={user} />
  ) : (
    <p>Musisz się zalogować, żeby dodawać posty</p>
  );

  return (
    <div className="app">
      <div className="navbar">
        <Nav addName={addName} username={user} chooseView={chooseView} />
      </div>
      <OnMobile>
        <div className="app__posts">
          {addPost}
          {views}
        </div>
      </OnMobile>
      <OnTablet>
        <div className="app__content">
          <div className="app__sideBarLeft">
            <SideLeft chooseView={chooseView} />
          </div>
          <div className="app__posts">
            {addPost}
            {views}
          </div>
        </div>
      </OnTablet>
      <OnDesktop>
        <div className="app__content">
          <div className="app__sideBarLeft">
            <SideLeft chooseView={chooseView} />
          </div>
          <div className="app__posts">
            {addPost}
            {views}
          </div>
          {view !== "userGallery" ? (
            <div className="app__gallery">
              <SideRight
                gallery={gallery}
                username={user}
                chooseView={chooseView}
                view={view}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </OnDesktop>
    </div>
  );
}

export default App;
