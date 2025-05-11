import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import '../pages/style.css';

export default function RegisterPage() {

    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_PRESET
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        birthday: '',
        avatar: '',
        password: '',

    });
    const [imagePreview, setImagePreview] = useState('')
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {

            setImagePreview(URL.createObjectURL(file));

            const formDataCloudinary = new FormData();
            formDataCloudinary.append('file', file);
            formDataCloudinary.append('upload_preset', uploadPreset)

            try {

                const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: 'POST',
                    body: formDataCloudinary
                });

                const data = await res.json();
                if (data.secure_url) {

                    setFormData({ ...formData, avatar: data.secure_url });
                } else {
                    setErrorMsg('Errore nel caricamento dell\'immagine');
                }
            } catch (err) {
                setErrorMsg('Errore nel caricamento dell\'immagine');
            }
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('')
        setSuccessMsg('')
        try {
            const res = await fetch(`${process.env.REACT_APP_APIURL}/authors`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Errore nella registrazione");
            }

            setSuccessMsg('Registrazione avvenuta con successo!')
        } catch (err) {
            setErrorMsg(err.message)
        }
    };

    return (
        <Container className="mt-5 page-container" style={{ maxWidth: '400px' }}>
            <h2>Registrati</h2>

            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
            {successMsg && <Alert variant="success">{successMsg}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Cognome</Form.Label>
                    <Form.Control
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <Form.Group className="mb-3">
                        <Form.Label>Avatar</Form.Label>
                        <Form.Control
                            type="file"
                            name="avatar"
                            onChange={handleImageUpload}
                            accept="image/*"
                        />
                        {imagePreview && (
                            <div className="mt-3">
                                <img src={imagePreview} alt="Avatar Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                            </div>
                        )}
                    </Form.Group>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Data di nascita</Form.Label>
                    <Form.Control
                        type="date"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Button type="submit" variant="success" disabled={!formData.avatar}>
                    Registrati
                </Button>

            </Form>

            <p className="mt-3">
                Hai già un account? <a href="/">Accedi qui</a>
            </p>

        </Container>
    );
}
