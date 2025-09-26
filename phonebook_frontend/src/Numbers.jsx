import Number from "./Number";

const Numbers = ({ filtered, handleDelete }) => {
  return (
    <>
      {filtered.map((person) => (
        <Number key={person.id} person={person} handleDelete={handleDelete} />
      ))}
    </>
  );
};

export default Numbers;
