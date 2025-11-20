const API_BASE_URL = "http://localhost:8080/api";

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    let errorMessage = `HTTP error! status: ${response.status}`;

    try {
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } else {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
    } catch (parseError) {
      console.error("Error parsing error response:", parseError);
    }

    throw new Error(errorMessage);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
};

// User API calls
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const getUserById = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`);
  return handleResponse(response);
};

export const getUserByUsername = async (username) => {
  const response = await fetch(`${API_BASE_URL}/users/username/${username}`);
  return handleResponse(response);
};

export const getAllUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`);
  return handleResponse(response);
};

export const updateUser = async (userId, userData) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const deleteUser = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};

// Document API calls
export const uploadDocument = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(response);
};

export const getDocumentById = async (documentId) => {
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}`);
  return handleResponse(response);
};

export const getAllDocumentsByUserId = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/documents/user/${userId}`);
  return handleResponse(response);
};

export const getDocumentsByCategory = async (userId, category) => {
  const response = await fetch(
    `${API_BASE_URL}/documents/user/${userId}/category/${category}`
  );
  return handleResponse(response);
};

export const searchDocumentsByFileName = async (userId, fileName) => {
  const response = await fetch(
    `${API_BASE_URL}/documents/user/${userId}/search?fileName=${fileName}`
  );
  return handleResponse(response);
};

export const deleteDocument = async (documentId) => {
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};

export const downloadDocument = async (documentId) => {
  const response = await fetch(
    `${API_BASE_URL}/documents/download/${documentId}`
  );

  if (!response.ok) {
    throw new Error(`Download failed: ${response.statusText}`);
  }

  return response.blob();
};

export const updateDocument = async (documentId, updatedData) => {
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });
  return handleResponse(response);
};

// User login
export const loginUser = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(response);
};

// Admin API calls
export const adminLogin = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/users/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(response);
};

export const toggleUserStatus = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/users/admin/toggle-status/${userId}`,
    {
      method: "PUT",
    }
  );
  return handleResponse(response);
};

export const toggleAdminStatus = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/users/admin/toggle-admin/${userId}`,
    {
      method: "PUT",
    }
  );
  return handleResponse(response);
};

export const deleteUserAdmin = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};

export const getAdminStats = async () => {
  const response = await fetch(`${API_BASE_URL}/users/admin/stats`);
  return handleResponse(response);
};

export const getAllDocumentsAdmin = async () => {
  const response = await fetch(`${API_BASE_URL}/documents/admin/all`);
  return handleResponse(response);
};

export const getDocumentStatsAdmin = async () => {
  const response = await fetch(`${API_BASE_URL}/documents/admin/stats`);
  return handleResponse(response);
};
