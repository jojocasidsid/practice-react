"use client";

import React from "react";
import styles from "./Form.module.css";
import Button from "@/components/Button/Button";

interface FormProps {
  legend: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
  children: React.ReactNode;
}

const Form: React.FC<FormProps> = ({
  legend,
  onSubmit,
  submitLabel,
  children,
}) => {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <fieldset className={styles.fieldSet}>
        <legend>{legend}</legend>
        <div className={styles.formBody}>{children}</div>
        <Button type="submit">{submitLabel}</Button>
      </fieldset>
    </form>
  );
};

export default Form;
