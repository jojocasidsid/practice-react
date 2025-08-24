"use client";

import { useState } from "react";

type FormFields<T> = {
  [K in keyof T]: T[K];
};

export function useFormFields<T extends Record<string, any>>(initialValues: T) {
  const [fields, setFields] = useState<FormFields<T>>(initialValues);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const resetFields = () => {
    setFields(initialValues);
  };

  return { fields, handleChange, setFields, resetFields };
}
