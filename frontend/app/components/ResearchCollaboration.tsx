"use client";

import React, { useState, useEffect } from "react";
import { researchCollaboration } from "../lib/web3";
import Web3 from "web3";

interface Project {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  contributors: string[];
  documents: string[];
}

interface ProjectResponse {
  title: string;
  description: string;
  isCompleted: boolean;
}

interface ResearchCollaborationProps {
  web3: Web3;
  account: string;
}

const ResearchCollaboration: React.FC<ResearchCollaborationProps> = ({
  web3,
  account,
}) => {
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const [newContributor, setNewContributor] = useState("");
  const [newDocument, setNewDocument] = useState("");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    title: "",
    description: "",
    contributor: "",
    document: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && web3 && account) {
      fetchProjects();
    }
  }, [mounted, web3, account]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const contract = new web3.eth.Contract(
        researchCollaboration.abi,
        researchCollaboration.address,
      );
      const projectCount = await contract.methods.projectCount().call();
      const count = Number(projectCount);

      const fetchedProjects: Project[] = [];
      for (let i = 1; i <= count; i++) {
        const project = (await contract.methods
          .projects(i)
          .call()) as ProjectResponse;
        fetchedProjects.push({
          id: i,
          title: project.title,
          description: project.description,
          isCompleted: project.isCompleted,
          contributors: [], // Will be populated in a separate call
          documents: [], // Will be populated in a separate call
        });
      }
      setProjects(fetchedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateProjectForm = () => {
    const errors = {
      title: "",
      description: "",
      contributor: "",
      document: "",
    };
    let isValid = true;

    if (!newProject.title.trim()) {
      errors.title = "Title is required";
      isValid = false;
    }

    if (!newProject.description.trim()) {
      errors.description = "Description is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const validateContributorForm = () => {
    const errors = {
      title: "",
      description: "",
      contributor: "",
      document: "",
    };
    let isValid = true;

    if (!newContributor.trim()) {
      errors.contributor = "Contributor address is required";
      isValid = false;
    } else if (!web3.utils.isAddress(newContributor)) {
      errors.contributor = "Invalid Ethereum address";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const validateDocumentForm = () => {
    const errors = {
      title: "",
      description: "",
      contributor: "",
      document: "",
    };
    let isValid = true;

    if (!newDocument.trim()) {
      errors.document = "Document hash is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const createProject = async () => {
    if (!validateProjectForm()) {
      return;
    }

    try {
      setLoading(true);
      const contract = new web3.eth.Contract(
        researchCollaboration.abi,
        researchCollaboration.address,
      );
      await contract.methods
        .createProject(newProject.title, newProject.description)
        .send({ from: account });

      await fetchProjects();
      setNewProject({ title: "", description: "" });
      setFormErrors({
        title: "",
        description: "",
        contributor: "",
        document: "",
      });
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
    }
  };

  const addContributor = async (projectId: number) => {
    if (!validateContributorForm()) {
      return;
    }

    try {
      setLoading(true);
      const contract = new web3.eth.Contract(
        researchCollaboration.abi,
        researchCollaboration.address,
      );
      await contract.methods
        .addContributor(projectId, newContributor)
        .send({ from: account });

      await fetchProjects();
      setNewContributor("");
      setFormErrors({
        title: "",
        description: "",
        contributor: "",
        document: "",
      });
    } catch (error) {
      console.error("Error adding contributor:", error);
    } finally {
      setLoading(false);
    }
  };

  const addDocument = async (projectId: number) => {
    if (!validateDocumentForm()) {
      return;
    }

    try {
      setLoading(true);
      const contract = new web3.eth.Contract(
        researchCollaboration.abi,
        researchCollaboration.address,
      );
      await contract.methods
        .addDocument(projectId, newDocument)
        .send({ from: account });

      await fetchProjects();
      setNewDocument("");
      setFormErrors({
        title: "",
        description: "",
        contributor: "",
        document: "",
      });
    } catch (error) {
      console.error("Error adding document:", error);
    } finally {
      setLoading(false);
    }
  };

  const completeProject = async (projectId: number) => {
    try {
      setLoading(true);
      const contract = new web3.eth.Contract(
        researchCollaboration.abi,
        researchCollaboration.address,
      );
      await contract.methods.completeProject(projectId).send({ from: account });

      await fetchProjects();
    } catch (error) {
      console.error("Error completing project:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Research Collaboration</h2>
        <div className="text-sm text-gray-600">
          Connected as: {account.slice(0, 6)}...{account.slice(-4)}
        </div>
      </div>

      {/* Create New Project */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold">Create New Project</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Project Title
            </label>
            <input
              type="text"
              placeholder="Enter a descriptive title for your project"
              value={newProject.title}
              onChange={(e) => {
                setNewProject({ ...newProject, title: e.target.value });
                if (formErrors.title) {
                  setFormErrors({ ...formErrors, title: "" });
                }
              }}
              className={`w-full rounded border p-2 ${
                formErrors.title ? "border-red-500" : ""
              }`}
            />
            {formErrors.title && (
              <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Project Description
            </label>
            <textarea
              placeholder="Describe your research project in detail..."
              value={newProject.description}
              onChange={(e) => {
                setNewProject({ ...newProject, description: e.target.value });
                if (formErrors.description) {
                  setFormErrors({ ...formErrors, description: "" });
                }
              }}
              className={`w-full rounded border p-2 ${
                formErrors.description ? "border-red-500" : ""
              }`}
              rows={4}
            />
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-500">
                {formErrors.description}
              </p>
            )}
          </div>
          <button
            onClick={createProject}
            disabled={loading}
            className="w-full rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400">
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="mr-2 h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Project...
              </div>
            ) : (
              "Create Project"
            )}
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Active Projects</h3>
        {loading && projects.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-lg bg-white">
            <div className="text-center">
              <svg
                className="mx-auto h-8 w-8 animate-spin text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-gray-600">Loading projects...</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900">
              No projects yet
            </h3>
            <p className="mt-2 text-gray-600">
              Create your first research project to get started!
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <p className="mt-2 text-gray-600">{project.description}</p>
                  <div className="mt-2">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        project.isCompleted
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                      {project.isCompleted ? "Completed" : "In Progress"}
                    </span>
                  </div>
                </div>
                {!project.isCompleted && (
                  <button
                    onClick={() => completeProject(project.id)}
                    className="rounded bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700">
                    Mark Complete
                  </button>
                )}
              </div>

              {/* Add Contributor */}
              {!project.isCompleted && (
                <div className="mt-6 rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-3 font-medium">Add Contributor</h4>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Enter Ethereum address of contributor"
                        value={newContributor}
                        onChange={(e) => {
                          setNewContributor(e.target.value);
                          if (formErrors.contributor) {
                            setFormErrors({ ...formErrors, contributor: "" });
                          }
                        }}
                        className={`w-full rounded border p-2 ${
                          formErrors.contributor ? "border-red-500" : ""
                        }`}
                      />
                      {formErrors.contributor && (
                        <p className="mt-1 text-sm text-red-500">
                          {formErrors.contributor}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => addContributor(project.id)}
                      disabled={loading}
                      className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400">
                      {loading ? "Adding..." : "Add"}
                    </button>
                  </div>
                </div>
              )}

              {/* Add Document */}
              {!project.isCompleted && (
                <div className="mt-4 rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-3 font-medium">Add Document</h4>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Enter IPFS hash of the document"
                        value={newDocument}
                        onChange={(e) => {
                          setNewDocument(e.target.value);
                          if (formErrors.document) {
                            setFormErrors({ ...formErrors, document: "" });
                          }
                        }}
                        className={`w-full rounded border p-2 ${
                          formErrors.document ? "border-red-500" : ""
                        }`}
                      />
                      {formErrors.document && (
                        <p className="mt-1 text-sm text-red-500">
                          {formErrors.document}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => addDocument(project.id)}
                      disabled={loading}
                      className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400">
                      {loading ? "Adding..." : "Add"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResearchCollaboration;
