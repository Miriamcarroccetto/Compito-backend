
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import NavBar from "./components/navbar/BlogNavbar";
import Footer from "./components/footer/Footer";
import Home from "./views/home/Home";
import Blog from "./views/blog/Blog";
import NewBlogPost from "./views/new/New";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 
  const fetchAuthors = async () => {
     const token = localStorage.getItem("token")

     if(!token) {
      console.warn('Nessun token trovato')
     }

    const res = await fetch(process.env.REACT_APP_APIURL + "/authors", {

    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    }
  });

  if (!res.ok) {
    console.error("Errore nella richiesta:", res.status)
    return;
  }

  const data = await res.json()
  console.log(data)
};

  useEffect(() => {
    if (isLoggedIn) {
    fetchAuthors()}
  }, [isLoggedIn])

  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/home" exact element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />
       <Route path="/new" element={<NewBlogPost />} />
        <Route path="/" element={<LoginPage setIsLoggedIn={setIsLoggedIn} fetchAuthors={fetchAuthors} />} />
        <Route path="/register" element={<RegisterPage setIsLoggedIn={setIsLoggedIn} fetchAuthors={fetchAuthors} />} />
      </Routes>
       <Footer />
    </Router>
  )
}
