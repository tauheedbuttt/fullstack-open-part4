const Number = ({ person, handleDelete }) => {
  return (
    <div>
      {person.name} {person.number}{" "}
      <button onClick={() => handleDelete(person)}>delete</button>
    </div>
  );
};

export default Number;
