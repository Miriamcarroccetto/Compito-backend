import React from 'react'
import { Form, Button, Container } from 'react-bootstrap'

export default function RegisterPage() {
    return (
        <Container className="mt-5" style={{ maxWidth: '400px' }}>
            <h2>Registrati</h2>
            {/* {errorMsg && <Alert variant="danger">{errorMsg}</Alert>} */}
            <Form /*onSubmit={handleSubmit}*/>
                <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control name="name" /*value={formData.name} onChange={handleChange}*/ required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Cognome</Form.Label>
                    <Form.Control name="lastname" /*value={formData.lastname} onChange={handleChange}*/ required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" /*value={formData.email} onChange={handleChange}*/ required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" /*value={formData.password} onChange={handleChange} */required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Data di nascita</Form.Label>
                    <Form.Control type="date" name="birthday" /*value={formData.birthday} onChange={handleChange}*/ required />
                </Form.Group>
                <Button type="submit" variant="success">Registrati</Button>
            </Form>

            <p className="mt-3">
                Hai già un account? <a href="/">Accedi qui</a>
            </p>

        </Container>
    )
}
