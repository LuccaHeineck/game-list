const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// AUTH
export async function loginUser(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error("Login failed");
  }
  return await response.json();
}

export async function registerUser(username, email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) {
    throw new Error("Regsitration failed");
  }
  return await response.json();
}

export async function fetchAllDBGames() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/games`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Unauthorized");
  }
  return await response.json();
}

export async function fetchGamesByName(name) {
  const token = localStorage.getItem("token");

  // Encode the name for URL safety
  const encodedName = encodeURIComponent(name);

  const response = await fetch(
    `${API_BASE_URL}/api/IGDB/games?name=${encodedName}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Unauthorized");
  }

  return await response.json();
}

export async function fetchGameInfoById(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/games/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Unauthorized");
  }
  return await response.json();
}

export async function fetchGamesByGenres() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/IGDB/games-by-genres`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Unauthorized");
  }
  return await response.json();
}

export async function fetchGamesByGenre(genreId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/IGDB/games-genres?genreId=${genreId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) throw new Error("Unauthorized");
    throw new Error("Failed to fetch games by genre");
  }

  return await response.json();
}

export async function addGameToList(userGame) {
  const token = localStorage.getItem("token");

  try {
    console.log(token);

    const response = await fetch(`${API_BASE_URL}/api/user-games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userGame),
    });

    if (!response.ok) {
      throw new Error(`Failed to add game: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding game to list:", error);
    throw error;
  }
}
