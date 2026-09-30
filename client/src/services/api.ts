import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string | null;
  bio?: string | null;
  location?: string | null;
  avatar?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

// -------------------------
// Register
// -------------------------
export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", {
    name,
    email,
    password,
  });

  return response.data;
};

// -------------------------
// Login
// -------------------------
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });

  return response.data;
};

// -------------------------
// Update Profile
// -------------------------
export const updateProfile = async (
  token: string,
  data: {
    name: string;
    bio?: string;
    location?: string;
    githubUrl?: string;
    linkedinUrl?: string;
  }
) => {
  const response = await api.put("/users/profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export default api;