const API_URL = "http://localhost:5000/api/salaries";

export const fetchEmployeeNames = async () => {
  try {
    const response = await fetch(`${API_URL}/employeeNames`);
    return await response.json();
  } catch (error) {
    console.error("Fehler beim Laden der Mitarbeiternamen:", error);
    throw error;
  }
};