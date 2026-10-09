"use server";

export type FormState = {
  error?: string;
  success?: string;
  greeting?: string;
};

export async function submitForm(_previousState: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  // This action runs on the server. Check the terminal running `npm run dev` to see the email.
  console.log("Submitted email:", email);

  return {
    success: "Thanks for submitting!",
    greeting: `Hello, ${firstName} ${lastName}!`,
  };
}
