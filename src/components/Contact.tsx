import React from "react";
import { Container, Form, Card } from "react-bootstrap";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Envelope from "../three/Envelope";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type FormData = { name: string; email: string; message: string };

const Contact: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Message:", data);
    toast.success("Message sent 🚀");
    reset();
  };

  return (
    <section id="contact" className="py-5 position-relative">
      {/* Background 3D Envelope */}
      <Canvas
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} />
        <Envelope />
        <OrbitControls enableZoom={false} autoRotate />
      </Canvas>

      <Container className="position-relative">
        <h2 className="text-center fw-bold mb-5 glass-text">Contact Me</h2>

        <Card
          className="glass-card shadow-sm border-0 mx-auto"
          style={{ maxWidth: "600px" }}
        >
          <Card.Body>
            <Form onSubmit={handleSubmit(onSubmit)} className="d-grid gap-3">
              <Form.Control
                placeholder="Your Name"
                {...register("name", { required: true })}
              />
              <Form.Control
                type="email"
                placeholder="Your Email"
                {...register("email", { required: true })}
              />
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Your Message"
                {...register("message", { required: true })}
              />

              {/* ✅ Fixed button (no TS error) */}
              <button type="submit" className="btn btn-primary">
                Send
              </button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </section>
  );
};

export default Contact;
