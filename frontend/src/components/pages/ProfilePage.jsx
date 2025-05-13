import React, { useEffect, useState } from "react";
import { Container, Card, Spinner, Alert, Row, Col, Button } from "react-bootstrap";
import "./style.css";

const ProfilePage = () => {
    const [author, setAuthor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUploading, setIsUploading] = useState(false); 
    const [image, setImage] = useState(null);  
    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Token mancante");
                    return;
                }

                const response = await fetch(`${process.env.REACT_APP_APIURL}/authors/me`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    setError(`Errore: ${response.status} - ${errorText}`);
                    return;
                }

                const data = await response.json();
                setAuthor(data);
            } catch (err) {
                setError("Errore nel caricamento del profilo");
                console.error("Errore nel caricamento del profilo", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAuthor();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    
    const handleImageUpload = async () => {
        if (!image) return;

        const formData = new FormData();
        formData.append('avatar', image);

        const token = localStorage.getItem("token");

        try {
            setIsUploading(true);

            const response = await fetch(`${process.env.REACT_APP_APIURL}/authors/${author._id}/avatar`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                setError(`Errore nel caricamento dell'immagine: ${errorText}`);
                return;
            }

            const updatedAuthor = await response.json();
            setAuthor(updatedAuthor);  
            setImage(null); 
        } catch (err) {
            setError("Errore nel caricamento dell'immagine");
            console.error("Errore nel caricamento dell'immagine", err);
        } finally {
            setIsUploading(false);
        }
    };

    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="page-container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            {author ? (
                <Card style={{ width: "22rem" }} className="shadow-lg">
                    <Card.Img
                        variant="top"
                        src={author.avatar || "default-avatar.jpg"}  
                        alt="avatar"
                        style={{ objectFit: "cover", height: "300px" }}
                    />

                    <Card.Body>
                        <Card.Title>{author.name} {author.lastname}</Card.Title>
                        <Card.Text>
                            <strong>Email:</strong> {author.email}<br />
                            <strong>Birthday:</strong> {new Date(author.birthday).toLocaleDateString()}
                        </Card.Text>

                        <Row>
                            <Col>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={isUploading}
                                />
                            </Col>
                            <Col>
                                <Button
                                    onClick={handleImageUpload}
                                    disabled={isUploading || !image}
                                >
                                    {isUploading ? "Caricamento..." : "Carica Immagine"}
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            ) : (
                <Alert variant="warning">Non sono riuscito a trovare il profilo.</Alert>
            )}
        </Container>
    );
};

export default ProfilePage;
