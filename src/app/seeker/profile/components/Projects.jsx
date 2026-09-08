"use client";

import React, { useEffect, useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";

const SeekerProjects = () => {
  const [project, setProject] = useState({ title: "" });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seeker/profile/project");
      const data = await res.json();
      if (res.ok) {
        setProjects(data || []);
      } else {
        console.error("Failed to fetch projects:", data.error);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!project.title.trim()) return;

    try {
      const res = await fetch("/api/seeker/profile/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newProject: project.title }),
      });

      const data = await res.json();

      if (res.ok) {
        setProjects(data);
        setProject({ title: "" });
      } else {
        console.error("Failed to add project:", data.error);
      }
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  const handleDelete = async (index) => {
    try {
      const res = await fetch("/api/seeker/profile/project", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index }),
      });

      const data = await res.json();

      if (res.ok) {
        const updatedProjects = [...projects];
        updatedProjects.splice(index, 1);
        setProjects(updatedProjects);
      } else {
        console.error("Failed to delete project:", data.error);
      }
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-4">Project</h4>

      <Form className="mx-auto" style={{ maxWidth: "500px" }}>
        <div className="d-flex flex-column gap-2 mb-4">
          <Form.Label className="fw-semibold">Please Enter Project Name</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={project.title}
            onChange={handleChange}
            placeholder="Please Enter Project Name"
          />
          <Button
            variant="primary"
            style={{ width: "150px", padding: "6px 12px" }}
            onClick={handleAdd}
          >
            Add Project
          </Button>
        </div>

        <div>
          {loading ? (
            <Spinner animation="border" />
          ) : projects.length === 0 ? (
            <p className="text-muted">No projects added yet.</p>
          ) : (
            <ul className="list-unstyled">
              {projects.map((proj, index) => (
                <li
                  key={index}
                  className="d-flex align-items-center justify-content-between mb-2"
                >
                  <span className="fw-bold">{proj}</span>
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="bg-light border-0"
                    onClick={() => handleDelete(index)}
                  >
                    <FaTrashAlt color="#3e7bfa" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Form>
    </div>
  );
};

export default SeekerProjects;



