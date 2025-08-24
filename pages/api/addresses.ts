import type { NextApiRequest, NextApiResponse } from "next";
import generateMockAddresses from "../../app/(frontend)/utils/generateMockAddresses";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { postcode, streetnumber },
  } = req;

  if (!postcode || !streetnumber) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode and street number fields mandatory!",
    });
  }

  if ((postcode as string).length < 4) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode must be at least 4 digits!",
    });
  }

  // ✅ Shared validation function
  const validateNumericField = (
    value: string,
    fieldName: "Postcode" | "Street Number"
  ): string | null => {
    if (!/^\d+$/.test(value) || Number(value) < 0) {
      return `${fieldName} must be all digits and non negative!`;
    }
    return null;
  };

  // ✅ Use the same validator for both fields
  const postcodeError = validateNumericField(postcode as string, "Postcode");
  if (postcodeError) {
    return res
      .status(400)
      .send({ status: "error", errormessage: postcodeError });
  }

  const streetError = validateNumericField(
    streetnumber as string,
    "Street Number"
  );
  if (streetError) {
    return res.status(400).send({ status: "error", errormessage: streetError });
  }

  const mockAddresses = generateMockAddresses(
    postcode as string,
    streetnumber as string
  );

  if (mockAddresses) {
    const timeout = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    // simulate latency
    await timeout(500);

    return res.status(200).json({
      status: "ok",
      details: mockAddresses,
    });
  }

  return res.status(404).json({
    status: "error",
    // DO NOT MODIFY MSG - used for grading
    errormessage: "No results found!",
  });
}
