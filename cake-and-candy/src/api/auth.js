export const loginUser = async (formData) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Sendet Cookies mit der Anfrage
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login fehlgeschlagen");
  
      return data; // Gibt die Nutzerdaten zurück
    } catch (err) {
      throw new Error(err.message);
    }
  };

// Nutzer aus LocalStorage holen
export const getUser = () => {
  return JSON.parse(localStorage.getItem("user")) || null;
};

// Prüfen, ob der Nutzer eingeloggt ist
export const isAuthenticated = () => {
  return getUser() !== null;
};

// Prüfen, ob der Nutzer ein Admin ist
export const isAdmin = () => {
  const user = getUser();
  return user?.role === "admin";
};

// Prüfen, ob der Nutzer ein Mitarbeiter ist
export const isMitarbeiter = () => {
  const user = getUser();
  return user?.role === "mitarbeiter"; // Oder andere Rollen, je nach Definition
};

// Logout-Funktion
export const logoutUser = () => {
  localStorage.removeItem("user");
};
  