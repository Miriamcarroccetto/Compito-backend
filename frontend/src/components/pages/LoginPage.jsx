import { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom'
import "../pages/style.css"


export default function LoginPage({ setIsLoggedIn, fetchAuthors }) {

    const location = useLocation();
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');


      useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (token) {
     
            localStorage.setItem("token", token);
            setIsLoggedIn(true);
            fetchAuthors();
           
            navigate("/home");
        }
    }, [location, navigate, setIsLoggedIn, fetchAuthors])

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.REACT_APP_APIURL}/authors/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();



            if (!res.ok) {
                throw new Error(data.message || "Errore nel login");
            }

            if (data.token) {
                localStorage.setItem("token", data.token)
                setIsLoggedIn(true);
                fetchAuthors()
            } else {
                console.warn("Nessun token ricevuto dal backend")
            }


            navigate('/home')

        } catch (err) {
            setErrorMsg(err.message);
        }
    };


    return (
        <Container className="page-container mt-5 pt-5" style={{ maxWidth: '400px' }}>
            <h2>Login</h2>
            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                </Form.Group>
                <Button type="submit" variant="primary">Login</Button>
            </Form>

            <p className="mt-3">
                Non hai un account? <a href="/register">Registrati qui</a>
            </p>

            <p className="mt-3"> 
                <a href="http://localhost:3001/authors/auth/googlelogin">Accedi con Google</a>
            </p>

        </Container>
    )
}
