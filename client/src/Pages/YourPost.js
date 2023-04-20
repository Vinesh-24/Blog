import React, {useContext, useEffect, useState} from "react";
import Post from "../Post";
import { UserContext } from "../UserContext";
const YourPost = () => {
    const [posts, setPosts] = useState([]);
    const {userInfo} = useContext(UserContext)
    console.log(userInfo.id)
    const data = new FormData();
    data.append('userid', userInfo.id);
    // console.log(data)
    const obj = {
        'userid' : userInfo.id
    }
    console.log(obj)
    useEffect(() => {
      fetch('http://localhost:4000/yourposts',{
        method: 'POST',
        body: JSON.stringify(obj),
      }).then(response => {
        response.json().then(posts => {
        console.log(posts);
          setPosts(posts);
        });
      });
    }, []);
    return (
      <>
          {posts.length > 0 && posts.map(post => (
            <Post {...post} />
          ))}
      </>      
    );
};

export default YourPost;

