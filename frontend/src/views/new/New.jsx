import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import "./styles.css";

const NewBlogPost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [cover, setCover] = useState("");
  const [readTimeValue, setReadTimeValue] = useState("");
  const [readTimeUnit, setReadTimeUnit] = useState("");
  const [content, setContent] = useState("");
  const [currentAuthorId, setCurrentAuthorId] = useState("");

  useEffect(() => {
    const fetchAuthor = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${process.env.REACT_APP_APIURL}/authors/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setCurrentAuthorId(data._id);
        } else {
          console.error("Autore non trovato");
        }
      } catch (err) {
        console.error("Errore recupero autore:", err);
      }
    };

    fetchAuthor();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Effettua il login prima di pubblicare.");
      return;
    }

    const payload = {
      title,
      category,
      cover,
      content,
      readTime: {
        value: Number(readTimeValue),
        unit: readTimeUnit,
      },
      author: currentAuthorId
    };
    console.log("Payload inviato:", JSON.stringify(payload, null, 2))

    try {
      const res = await fetch(`${process.env.REACT_APP_APIURL}/blogPosts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Errore durante la creazione del post.");
      }

      const result = await res.json();
      alert("Post creato con successo!");

      setTitle("");
      setCategory("");
      setCover("");
      setReadTimeValue("");
      setReadTimeUnit("");
      setContent("");
    } catch (err) {
      console.error(err);
      alert("Errore nella pubblicazione del post.");
    }
  };

  return (
    <Container className="new-blog-container">
      <Form className="mt-5" onSubmit={handleSubmit}>
        <Form.Group className="mt-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control
            size="lg"
            placeholder="Titolo del post"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Control
            size="lg"
            as="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Seleziona una categoria</option>
            <option>Salute e benessere</option>
            <option>Biologia</option>
            <option>Tecnologia</option>
            <option>Cibo</option>
            <option>Animali</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>URL Immagine Copertina</Form.Label>
          <Form.Control
            size="lg"
            placeholder="https://..."
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Tempo di Lettura</Form.Label>
          <div className="d-flex gap-3">
            <Form.Control
              type="number"
              placeholder="Valore (es. 5)"
              value={readTimeValue}
              onChange={(e) => setReadTimeValue(e.target.value)}
              required
            />
            <Form.Control
              as="select"
              value={readTimeUnit}
              onChange={(e) => setReadTimeUnit(e.target.value)}
              required
            >
              <option value="">Unità</option>
              <option>minuti</option>
              <option>ore</option>
            </Form.Control>
          </div>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Contenuto del Blog</Form.Label>
          <Form.Control
            as="textarea"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Scrivi il contenuto del tuo post..."
            required
          />
        </Form.Group>

        <Form.Group className="d-flex mt-4 justify-content-end">
          <Button type="reset" size="lg" variant="outline-dark">
            Reset
          </Button>
          <Button
            type="submit"
            size="lg"
            variant="dark"
            style={{ marginLeft: "1em" }}
          >
            Invia
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default NewBlogPost;
