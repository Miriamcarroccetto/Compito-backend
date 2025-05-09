import React from 'react'
import { Form, Button, Container } from 'react-bootstrap';

export default function LoginPage() {
    return (
        <Container className="mt-5" style={{ maxWidth: '400px' }}>
            <h2>Login</h2>
            {/* {errorMsg && <Alert variant="danger">{errorMsg}</Alert>} */}
            <Form /*onSubmit={handleLogin}*/>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        // value={email} 
                        // onChange={(e) => setEmail(e.target.value)} 
                        required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        // value={password} 
                        // onChange={(e) => setPassword(e.target.value)} 
                        required />
                </Form.Group>
                <Button type="submit" variant="primary">Login</Button>
            </Form>

            <p className="mt-3">
                Non hai un account? <a href="/register">Registrati qui</a>
            </p>

        </Container>
    )
}
