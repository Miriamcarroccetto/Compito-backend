import React, { useEffect, useState } from "react";
import { Container, Card, Spinner, Alert, Row, Col } from "react-bootstrap";
import "./style.css";

const ProfilePage = () => {
    const [author, setAuthor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
                        src={
                            author.avatar
                        }
                        alt="avatar"
                        style={{ objectFit: "cover", height: "300px" }}
                    />

                    <Card.Body>
                        <Card.Title>{author.name} {author.lastname}</Card.Title>
                        <Card.Text>
                            <strong>Email:</strong> {author.email}<br />
                            <strong>Birthday:</strong> {new Date(author.birthday).toLocaleDateString()}
                        </Card.Text>
                    </Card.Body>
                </Card>
            ) : (
                <Alert variant="warning">Non sono riuscito a trovare il profilo.</Alert>
            )}
        </Container>
    );
};

export default ProfilePage;
