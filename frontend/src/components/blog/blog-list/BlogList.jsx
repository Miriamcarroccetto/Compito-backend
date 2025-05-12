import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import BlogItem from "../blog-item/BlogItem";

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)


  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {

        const token = localStorage.getItem('token');


        if (!token) {
          throw new Error("Token di autenticazione mancante");
        }

        const response = await fetch(`${process.env.REACT_APP_APIURL}/blogPosts`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error("Errore nel recupero dei blog posts");
        }

        const data = await response.json();
        setPosts(data.blogPosts);
        setLoading(false);
      } catch (err) {
        console.error("Errore nel caricamento dei post:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <Row>
      {posts.map((post, i) => (
        <Col
          key={`item-${i}`}
          md={4}
          style={{
            marginBottom: 50,
          }}
        >
          <BlogItem key={post.title} {...post} />
        </Col>
      ))}
    </Row>
  );
};

export default BlogList;
