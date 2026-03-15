"use client";

import { useActionState, useEffect, useRef } from "react";
import { createCustomerAction } from "../../../app/customers/actions";
import { initialFormActionState } from "../../server/form-state";
import { FormSubmitButton } from "./form-submit-button";

function getFieldError(fieldErrors: Record<string, string> | undefined, field: string): string | undefined {
  return fieldErrors?.[field];
}

export function CustomerCreateForm() {
  const [state, formAction] = useActionState(createCustomerAction, initialFormActionState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <article className="panel-card">
      <div className="section-heading section-heading--compact">
        <div>
          <p className="eyebrow">Create Customer</p>
          <h2>New customer record</h2>
        </div>
      </div>

      <form action={formAction} className="form-stack" ref={formRef}>
        <div className="field-grid">
          <label className="form-field">
            <span>Name</span>
            <input className="form-input" name="name" placeholder="Acme Transport" required type="text" />
            <small className="field-error">{getFieldError(state.fieldErrors, "name")}</small>
          </label>

          <label className="form-field">
            <span>Company name</span>
            <input className="form-input" name="companyName" placeholder="Acme Transport LLC" type="text" />
            <small className="field-error">{getFieldError(state.fieldErrors, "companyName")}</small>
          </label>
        </div>

        <div className="field-grid">
          <label className="form-field">
            <span>Email</span>
            <input className="form-input" name="email" placeholder="billing@example.com" type="email" />
            <small className="field-error">{getFieldError(state.fieldErrors, "email")}</small>
          </label>

          <label className="form-field">
            <span>Phone</span>
            <input className="form-input" name="phone" placeholder="555-0101" type="text" />
            <small className="field-error">{getFieldError(state.fieldErrors, "phone")}</small>
          </label>
        </div>

        <div className="field-grid">
          <label className="form-field">
            <span>Billing street 1</span>
            <input className="form-input" name="billingStreet1" type="text" />
            <small className="field-error">{getFieldError(state.fieldErrors, "billingStreet1")}</small>
          </label>

          <label className="form-field">
            <span>Billing street 2</span>
            <input className="form-input" name="billingStreet2" type="text" />
            <small className="field-error">{getFieldError(state.fieldErrors, "billingStreet2")}</small>
          </label>
        </div>

        <div className="field-grid field-grid--thirds">
          <label className="form-field">
            <span>City</span>
            <input className="form-input" name="billingCity" type="text" />
            <small className="field-error">{getFieldError(state.fieldErrors, "billingCity")}</small>
          </label>

          <label className="form-field">
            <span>State</span>
            <input className="form-input" name="billingState" type="text" />
            <small className="field-error">{getFieldError(state.fieldErrors, "billingState")}</small>
          </label>

          <label className="form-field">
            <span>Postal code</span>
            <input className="form-input" name="billingPostalCode" type="text" />
            <small className="field-error">{getFieldError(state.fieldErrors, "billingPostalCode")}</small>
          </label>
        </div>

        <div className="field-grid">
          <label className="form-field">
            <span>Country</span>
            <input className="form-input" defaultValue="US" name="billingCountry" type="text" />
            <small className="field-error">{getFieldError(state.fieldErrors, "billingCountry")}</small>
          </label>

          <label className="form-field">
            <span>Notes</span>
            <textarea className="form-textarea" name="notes" rows={3} />
            <small className="field-error">{getFieldError(state.fieldErrors, "notes")}</small>
          </label>
        </div>

        <div className="form-actions">
          <div className="form-feedback">
            {state.message ? (
              <p className={state.status === "error" ? "form-message form-message--error" : "form-message"}>
                {state.message}
              </p>
            ) : null}
          </div>
          <FormSubmitButton idleLabel="Create customer" pendingLabel="Creating..." />
        </div>
      </form>
    </article>
  );
}
