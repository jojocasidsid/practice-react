import React from "react";
import styles from "./ErrorMessage.module.css";

type ErrorMessageProps = {
  message?: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <p className={styles.error} role="alert">
      {message}
    </p>
  );
};

export default ErrorMessage;
