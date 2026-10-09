"use client";

import { useActionState } from "react";
import { submitForm, type FormState } from "./actions";

const initialState: FormState = {};

export default function SubmissionForm() {
  const [state, formAction, isPending] = useActionState(submitForm, initialState);

  return (
    <form action={formAction}>
      <label>
        Email
        <input type="email" name="email" autoComplete="email" required />
      </label>

      <label>
        Password
        <input type="password" name="password" autoComplete="new-password" required />
      </label>

      <label>
        First name
        <input type="text" name="firstName" autoComplete="given-name" required />
      </label>

      <label>
        Last name
        <input type="text" name="lastName" autoComplete="family-name" required />
      </label>

      <button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit"}
      </button>

      {state.error && <p className="error" role="alert">{state.error}</p>}
      {state.success && <p className="success" role="status">{state.success}</p>}
      {state.greeting && <p className="success" role="status">{state.greeting}</p>}
    </form>
  );
}
