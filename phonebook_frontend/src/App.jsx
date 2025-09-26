import { useState } from "react";
import Search from "./Search";
import Form from "./Form";
import Numbers from "./Numbers";
import { useEffect } from "react";
import personService from "./services/persons";
import Notification from "./Notification";

const App = () => {
  const baseNotification = {
    message: null,
    variant: "error",
  };

  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState(baseNotification);

  const handleNameChange = (e) => setNewName(e.target.value);
  const handleNumberChange = (e) => setNewNumber(e.target.value);
  const handleSearchChange = (e) => setSearch(e.target.value);

  const checkExistingPerson = () => {
    // find existing person
    const existingPerson = persons.find((item) => item.name === newName);
    if (!existingPerson) return false;

    // update existing person
    const isUpdate = confirm(
      `${newName} is already added to phonebook. Do you wish to update?`
    );
    if (isUpdate) handleUpdate(existingPerson);
    return true;
  };

  const showNotification = (data) => {
    setNotification({ ...notification, ...data });
    setTimeout(() => setNotification(baseNotification), 5000);
  };

  const handleCreate = (e) => {
    e.preventDefault();

    // skip create flow if update started or found the same person
    const isUpdating = checkExistingPerson();
    if (isUpdating) return;

    const newPersons = [...persons];
    const newPerson = {
      name: newName,
      number: newNumber,
    };

    personService
      .create(newPerson)
      .then((newPerson) => {
        setPersons([...newPersons, newPerson]);
        setNewName("");
        setNewNumber("");
        showNotification({
          message: `Successfully created ${newName}`,
          variant: "success",
        });
      })
      .catch((err) => {
        const message = err?.response?.data?.error;
        showNotification({
          message: `Failed to create ${newName}: ${message}`,
        });
        console.log(err);
      });
  };

  const handleDelete = (person) => {
    const isDelete = confirm(`Delete ${person.name}?`);
    if (!isDelete) return;

    personService
      .deletePerson(person.id)
      .then(() => {
        setPersons(persons.filter((existing) => existing.id !== person.id));
        showNotification({
          message: `Successfully deleted ${newName}`,
          variant: "success",
        });
      })
      .catch((err) => {
        showNotification({ message: `${person.name} does not exist` });
        console.log(err);
      });
  };

  const handleUpdate = (existingPerson) => {
    const updatePerson = {
      ...existingPerson,
      number: newNumber,
    };

    personService
      .update(existingPerson.id, updatePerson)
      .then((updatedPerson) => {
        const updatedPersons = persons.map((item) =>
          item.id === existingPerson.id ? updatedPerson : item
        );
        setPersons(updatedPersons);
        setNewName("");
        setNewNumber("");
        showNotification({
          message: `Successfully updated ${newName}'s number: ${newNumber}`,
          variant: "success",
        });
      })
      .catch((err) => {
        const message = err?.response?.data?.error;
        showNotification({
          message,
        });
        console.log(err);
      });
  };

  const filtered = persons.filter((item) =>
    item.name.toLowerCase().includes(search)
  );

  useEffect(() => {
    personService
      .getAll()
      .then((persons) => setPersons(typeof persons === "object" ? persons : []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Notification
        message={notification.message}
        variant={notification.variant}
      />
      <h1>Phonebook</h1>
      <Search search={search} handleSearchChange={handleSearchChange} />
      <h2>Add a new</h2>
      <Form
        newName={newName}
        newNumber={newNumber}
        handleSubmit={handleCreate}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Numbers filtered={filtered} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
