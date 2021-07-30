import { useState } from "react";

export default function useForm(initialData) {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});

  /** @param {React.ChangeEvent<HTMLInputElement>} ev */
  function handleChange(ev) {
    const { type, name } = ev.target;
    const target = ev.target;

    let value;
    // check what input type is then assign value accordingly
    switch (type) {
      case "number":
        value = target.valueAsNumber;
        break;
      case "checkbox":
      case "radio":
        value = target.checked;
        break;

      case "date":
        value = target.valueAsDate;
        break;

      case "file":
        value = target.files[0];
        break;

      default:
        value = target.value;
    }

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function getInputProps(inputName) {
    return {
      name: inputName,
      onChange: handleChange,
      value: data[inputName],
      error: errors[inputName],
    };
  }

  return {
    data,
    handleChange,
    getInputProps,
    setData,
    setErrors,
  };
}
