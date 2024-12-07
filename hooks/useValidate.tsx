import { useState } from "react";

const useValidation = () => {
  const [errors, setErrors] = useState({});

  const validate = (field: any, value: any) => {
    let error = "";

    switch (field) {
      case "fullName":
        if (!/^[A-Za-z]{2,} [A-Za-z]{2,}$/.test(value)) {
          error =
            "Full name must contain at least two words, each with a minimum of 2 characters.";
        }
        break;

      case "phoneNumber":
        if (!/^[0-9]{10}$/.test(value)) {
          error = "Phone number must be exactly 10 digits.";
        }
        break;

      case "aadhaarCardNumber":
        if (!/^[0-9]{12}$/.test(value)) {
          error = "Aadhaar card number must be exactly 12 digits.";
        }
        break;

      case "email":
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          error = "Please enter a valid email address.";
        }
        break;
      case "password":
        if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(value)) {
          error =
            "Password must be at least 8 characters long, contain one capital letter, and one number.";
        }
        break;

      default:
        error = "Invalid field type.";
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  return { validate, errors };
};

export default useValidation;
