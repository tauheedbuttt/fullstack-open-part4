import axios from "axios";
const baseUrl = "/api/persons";

const getAll = () => {
  const promise = axios.get(baseUrl);
  return promise.then((res) => res.data);
};

const create = (newObject) => {
  const promise = axios.post(baseUrl, newObject);
  return promise.then((res) => res.data);
};

const update = (id, newObject) => {
  const promise = axios.put(`${baseUrl}/${id}`, newObject);
  return promise.then((res) => res.data);
};

const deletePerson = (id) => {
  const promise = axios.delete(`${baseUrl}/${id}`);
  return promise.then((res) => res.data);
};

export default {
  getAll,
  create,
  update,
  deletePerson,
};
