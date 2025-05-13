import {useState} from "react";
import { Container, FormControl, Button } from "react-bootstrap";
import BlogList from "../../components/blog/blog-list/BlogList";
import "./styles.css";

const Home = props => {

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };


  return (
    <Container fluid="sm">
      <h1 className="blog-main-title mb-3">Benvenuto sullo Strive Blog!</h1>
       <FormControl
        type="search"
        placeholder="Cerca blogpost..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="mb-4"
        style={{ width: "250px" }}
      />
      <BlogList searchQuery={searchQuery}/>
    </Container>
  );
};

export default Home;
