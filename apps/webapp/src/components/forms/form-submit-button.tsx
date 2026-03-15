"use client";

import { useFormStatus } from "react-dom";

interface FormSubmitButtonProps {
  idleLabel: string;
  pendingLabel: string;
}

export function FormSubmitButton({ idleLabel, pendingLabel }: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button className="button-primary" disabled={pending} type="submit">
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
