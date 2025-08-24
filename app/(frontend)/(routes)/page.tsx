"use client";

import React, { useState } from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";

import styles from "./App.module.css";
import { Address as AddressType } from "../types";
import { useFormFields } from "@/hooks/useFormFields";
import transformAddress from "../core/models/address";
import Form from "../ui/components/Form/Form";
import ErrorMessage from "../ui/components/ErrorMessage/ErrorMessage";

const Page = () => {
  /**
   * Form fields states
   * TODO: Write a custom hook to set form fields in a more generic way:
   * - Hook must expose an onChange handler to be used by all <InputText /> and <Radio /> components
   * - Hook must expose all text form field values, like so: { postCode: '', houseNumber: '', ...etc }
   * - Remove all individual useState
   * - Remove all individual onChange handlers, like handlePostCodeChange for example
   */

  const { fields, handleChange, resetFields } = useFormFields({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
  });

  const [selectedAddress, setSelectedAddress] = useState("");
  /**
   * Results states
   */
  const [error, setError] = useState<undefined | string>(undefined);
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [loading, setLoading] = useState(false);
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  const handleSelectedAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setSelectedAddress(e.target.value);

  /** TODO: Fetch addresses based on houseNumber and postCode using the local BE api
   * - Example URL of API: ${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=1345&streetnumber=350
   * - Ensure you provide a BASE URL for api endpoint for grading purposes!
   * - Handle errors if they occur
   * - Handle successful response by updating the `addresses` in the state using `setAddresses`
   * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
   * - Ensure to clear previous search results on each click
   * - Bonus: Add a loading state in the UI while fetching addresses
   */
  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setAddresses([]);
    setLoading(true);

    if (!fields.postCode.trim() || !fields.houseNumber.trim()) {
      setError("Postcode and house number fields are mandatory!");
      return;
    }

    try {
      const { postCode, houseNumber } = fields;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/addresses?postcode=${postCode}&streetnumber=${houseNumber}`
      );

      if (!res.ok) throw new Error("Failed to fetch addresses");

      const data = await res.json();
      const transformed = data.details.map((addr: any) =>
        transformAddress({ ...addr })
      );
      setAddresses(transformed);
    } catch (err) {
      setError("Something went wrong while searching addresses.");
    } finally {
      setLoading(false);
    }
  };

  /** TODO: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   */
  const handlePersonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!fields.firstName.trim() || !fields.lastName.trim()) {
      setError("First name and last name fields mandatory!");
      return;
    }

    if (!selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === selectedAddress
    );

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({
      ...foundAddress,
      firstName: fields.firstName,
      lastName: fields.lastName,
    });
  };

  const handleClear = () => {
    resetFields();
    setAddresses([]);
    setError(undefined);
  };

  return (
    <main className={styles.main}>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        <Form
          legend="🏠 Find an address"
          onSubmit={handleAddressSubmit}
          submitLabel="Find"
        >
          <div className={styles.formRow}>
            <InputText
              name="postCode"
              onChange={handleChange}
              placeholder="Post Code"
              value={fields.postCode}
            />
          </div>
          <div className={styles.formRow}>
            <InputText
              name="houseNumber"
              onChange={handleChange}
              value={fields.houseNumber}
              placeholder="House numbers"
            />
          </div>
        </Form>
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={handleSelectedAddressChange}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {selectedAddress && (
          <Form
            legend="✏️ Add personal info to address "
            onSubmit={handlePersonSubmit}
            submitLabel="Add to addressbook"
          >
            <div className={styles.formRow}>
              <InputText
                name="firstName"
                placeholder="First name"
                onChange={handleChange}
                value={fields.firstName}
              />
            </div>
            <div className={styles.formRow}>
              <InputText
                name="lastName"
                placeholder="Last name"
                onChange={handleChange}
                value={fields.lastName}
              />
            </div>
          </Form>
        )}

        {error && <ErrorMessage message={error} />}

        <Button type="button" variant="secondary" onClick={handleClear}>
          Clear all fields
        </Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
};

export default Page;
