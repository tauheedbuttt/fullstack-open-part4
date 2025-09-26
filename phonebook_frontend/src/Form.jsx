import Input from "./Input";

const Form = ({
  newName,
  newNumber,
  handleSubmit,
  handleNameChange,
  handleNumberChange,
}) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <Input label={"name"} value={newName} onChange={handleNameChange} />
          <Input
            label={"number"}
            value={newNumber}
            onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

export default Form;
