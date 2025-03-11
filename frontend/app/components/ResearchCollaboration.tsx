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

interface ResearchCollaborationProps {
  web3: Web3;
  account: string;
}

interface ProjectResult {
  0: string; // title
  1: string; // description
  2: string[]; // contributors
  3: string[]; // documents
  4: boolean; // isCompleted
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
  const [loadingStates, setLoadingStates] = useState({
    fetchingProjects: false,
    creatingProject: false,
    addingContributor: false,
    addingDocument: false,
    completingProject: false,
  });
  const [formErrors, setFormErrors] = useState({
    title: "",
    description: "",
    contributor: "",
    document: "",
  });

  useEffect(() => {
    setMounted(true);
    return () => {
      setLoadingStates({
        fetchingProjects: false,
        creatingProject: false,
        addingContributor: false,
        addingDocument: false,
        completingProject: false,
      });
    };
  }, []);

  useEffect(() => {
    if (mounted && web3 && account) {
      console.log("Attempting to fetch projects with:", {
        web3: !!web3,
        account,
        contractAddress: researchCollaboration.address,
      });
      checkNetworkAndFetch();
    }
  }, [mounted, web3, account]);

  const checkNetworkAndFetch = async () => {
    try {
      // First check if web3 is properly initialized
      if (!web3 || !web3.eth) {
        console.error("Web3 is not properly initialized");
        setProjects([]);
        return;
      }

      // Check if MetaMask is connected
      const accounts = await web3.eth.getAccounts();
      if (!accounts || accounts.length === 0) {
        console.error("No accounts found - please connect MetaMask");
        setProjects([]);
        return;
      }

      // Try to get network ID with error handling
      let networkId;
      try {
        networkId = await web3.eth.net.getId();
        console.log("Current network ID:", networkId);
      } catch (networkError: unknown) {
        if (networkError instanceof Error) {
          console.error("Error getting network ID:", networkError.message);
        } else {
          console.error("Unknown error getting network ID");
        }
        setProjects([]);
        return;
      }

      // Check if we're on the correct network (e.g., localhost:8545 is network 31337)
      if (Number(networkId) !== 31337) {
        console.error("Please connect to the local hardhat network");
        setProjects([]);
        return;
      }

      // Verify RPC connection
      try {
        await web3.eth.getBlockNumber();
      } catch (rpcError) {
        console.error("RPC connection failed:", rpcError);
        setProjects([]);
        return;
      }

      fetchProjects();
    } catch (error) {
      console.error("Error checking network:", error);
      setProjects([]);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, fetchingProjects: true }));

      // Verify contract address
      if (!researchCollaboration.address) {
        console.error("Contract address is not defined");
        setProjects([]);
        setLoadingStates((prev) => ({ ...prev, fetchingProjects: false }));
        return;
      }

      console.log("Contract configuration:", {
        address: researchCollaboration.address,
        hasAbi: !!researchCollaboration.abi,
        networkId: await web3.eth.net.getId(),
      });

      // Create contract instance
      const contract = new web3.eth.Contract(
        researchCollaboration.abi,
        researchCollaboration.address,
      );

      // Debug logging
      console.log(
        "Contract ABI:",
        JSON.stringify(researchCollaboration.abi, null, 2),
      );
      console.log("Contract methods:", Object.keys(contract.methods));

      // Verify contract is deployed
      try {
        const code = await web3.eth.getCode(researchCollaboration.address);
        console.log("Contract deployment check:", {
          address: researchCollaboration.address,
          code: code,
          isDeployed: code !== "0x",
        });

        if (code === "0x") {
          console.error(
            "No contract code at specified address. This usually means either:",
            [
              "1. The contract is not deployed",
              "2. The contract address is incorrect",
              "3. You're connected to the wrong network",
            ].join("\n"),
          );
          setProjects([]);
          setLoadingStates((prev) => ({ ...prev, fetchingProjects: false }));
          return;
        }

        // Get project count using the public variable getter
        console.log("Attempting to call projectCount()...");
        try {
          const projectCount = await contract.methods.projectCount().call();
          console.log("Project count:", projectCount);
          const count = Number(projectCount);

          const fetchedProjects: Project[] = [];
          if (count > 0) {
            for (let i = 1; i <= count; i++) {
              try {
                // Call the getProject function we added to the contract
                const result = (await contract.methods
                  .getProject(i)
                  .call()) as ProjectResult;
                console.log(`Project ${i} data:`, result);

                fetchedProjects.push({
                  id: i,
                  title: result[0],
                  description: result[1],
                  contributors: result[2],
                  documents: result[3],
                  isCompleted: result[4],
                });
              } catch (error) {
                console.error(`Error fetching project ${i}:`, error);
              }
            }
          }
          console.log("Fetched projects:", fetchedProjects);
          setProjects(fetchedProjects);
        } catch (error) {
          console.error("Error interacting with contract:", error);
          setProjects([]);
        }
      } catch (error) {
        console.error("Error interacting with contract:", error);
        setProjects([]);
      }
    } catch (error) {
      console.error("Error in fetchProjects:", error);
      setProjects([]);
    } finally {
      setLoadingStates((prev) => ({ ...prev, fetchingProjects: false }));
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
      setLoadingStates((prev) => ({ ...prev, creatingProject: true }));
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
      setLoadingStates((prev) => ({ ...prev, creatingProject: false }));
    }
  };

  const addContributor = async (projectId: number) => {
    if (!validateContributorForm()) {
      return;
    }

    try {
      setLoadingStates((prev) => ({ ...prev, addingContributor: true }));
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
      setLoadingStates((prev) => ({ ...prev, addingContributor: false }));
    }
  };

  const addDocument = async (projectId: number) => {
    if (!validateDocumentForm()) {
      return;
    }

    try {
      setLoadingStates((prev) => ({ ...prev, addingDocument: true }));
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
      setLoadingStates((prev) => ({ ...prev, addingDocument: false }));
    }
  };

  const completeProject = async (projectId: number) => {
    try {
      setLoadingStates((prev) => ({ ...prev, completingProject: true }));
      const contract = new web3.eth.Contract(
        researchCollaboration.abi,
        researchCollaboration.address,
      );
      await contract.methods.completeProject(projectId).send({ from: account });

      await fetchProjects();
    } catch (error) {
      console.error("Error completing project:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, completingProject: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form from submitting automatically
    await createProject();
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
        <form onSubmit={handleSubmit} className="space-y-4">
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
            type="submit"
            disabled={loadingStates.creatingProject}
            className="w-full rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400">
            {loadingStates.creatingProject ? (
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
        </form>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Active Projects</h3>
        {loadingStates.fetchingProjects ? (
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
                    disabled={loadingStates.completingProject}
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
                      disabled={loadingStates.addingContributor}
                      className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400">
                      {loadingStates.addingContributor ? "Adding..." : "Add"}
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
                      disabled={loadingStates.addingDocument}
                      className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400">
                      {loadingStates.addingDocument ? "Adding..." : "Add"}
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
