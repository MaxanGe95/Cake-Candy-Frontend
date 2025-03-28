import React, { useState, useEffect } from "react";
import { updateUser, fetchUsers, deleteUser } from "../api/user";
import { fetchEmployeeNames } from "../api/salary";
import { InputString, DropdownInput } from "../components/form/Inputs";
import { EditButton, DeleteButton } from "../components/form/Buttons";

const User = () => {
  const [users, setUsers] = useState([]); // Zustand für Benutzerdaten
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [employeeNames, setEmployeeNames] = useState([]);

  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newEmployeeName, setNewEmployeeName] = useState("");

  const loadUsers = async () => {
    try {
      const usersData = await fetchUsers(); // Benutzerdaten abrufen
      setUsers(usersData); // Benutzerdaten im Zustand speichern
    } catch (error) {
      console.error("Fehler beim Laden der Benutzer:", error);
    }
  };

  // Mitarbeiternamen laden
  const loadEmployeeNames = async () => {
    try {
      const employeeNames = await fetchEmployeeNames();
      setEmployeeNames(employeeNames); 
    } catch (error) {
      console.error("Fehler beim Laden der Benutzer:", error);
    }
  };

  useEffect(() => {
    loadUsers();
    loadEmployeeNames();
  }, []); // Nur einmal beim Laden der Komponente aufrufen

  const openDialog = (user) => {
    setSelectedUser(user);
    setNewUsername(user.username || "");
    setNewEmail(user.email || "");
    setNewRole(user.role || "kunde");
    setNewEmployeeName(user.employeeName);
    setDialogOpen(true);
  };

  const handleDelete = async (user) => {
    await deleteUser(user._id);    
    loadUsers();
  }

  const handleSaveDialog = async () => {
    const updatedUser = {
      ...selectedUser,
      username: newUsername,
      email: newEmail,
      role: newRole,
      employeeName: newEmployeeName
    };

    try {
      await updateUser(updatedUser); // API-Aufruf zum Speichern des Benutzers
      setDialogOpen(false);
      // Benutzer nach dem Speichern aktualisieren
      const updatedUsers = users.map((user) =>
        user._id === selectedUser._id ? updatedUser : user
      );
      setUsers(updatedUsers); // Benutzerdaten im Zustand aktualisieren
    } catch (error) {
      console.error("Fehler beim Speichern des Benutzers:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-center text-2xl font-bold text-teal-200 mb-4">Nutzerverwaltung</h1>
      {/* Tabelle */}
      <table className="min-w-full text-amber-100 border rounded-md overflow-hidden text-center">
        <thead className="bg-teal-950/80">
          <tr>
            <th className="p-2">Nutzername</th>
            <th className="p-2">E-Mail</th>
            <th className="p-2">Rolle</th>
            <th className="p-2">Mitarbeiter Name</th>
            <th className="p-2">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {users.map((employee) => (
            <tr
              key={employee._id}
              className="border border-amber-100 cursor-pointer hover:bg-[#7ec6cc80]"
            >
              <td className="p-2 text-left">{employee.username}</td>
              <td className="p-2">{employee.email}</td>
              <td className="p-2">{employee.role}</td>
              <td className="p-2">{employee.employeeName}</td>
              <td className="p-2">
                <EditButton onClick={() => openDialog(employee)} />
                <DeleteButton onClick={() => handleDelete(employee)}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bearbeitungsdialog */}
      {dialogOpen && selectedUser && (
        <div className="fixed inset-0 z-100 flex items-center justify-center">
          <div className="p-6 rounded-md shadow-lg w-100 bg-teal-900">
            <h2 className="text-lg font-bold mb-2">Benutzer bearbeiten</h2>
            <InputString
              placeholder="Benutzername"
              value={newUsername}
              onChange={(e) => setNewUsername(e)}
            />
            <InputString
              className="mt-1"
              placeholder="E-Mail"
              value={newEmail}
              onChange={(e) => setNewEmail(e)}
            />
            <DropdownInput
              className="mt-1"
              options={["kunde", "mitarbeiter", "admin"]}
              value={newRole}
              onChange={(e) => setNewRole(e)}
            />
            <DropdownInput
              className="mt-1"
              options={employeeNames}
              placeholder="Mitarbeiter Name"
              value={newEmployeeName}
              onChange={(e) => setNewEmployeeName(e)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white px-3 py-1 rounded"
                onClick={() => setDialogOpen(false)}
              >
                Abbrechen
              </button>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={handleSaveDialog}
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
