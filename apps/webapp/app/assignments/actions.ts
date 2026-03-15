"use server";

import type { CreateAssignmentRequest } from "@registry/api-contracts";
import { registryWebRoutes } from "@registry/config";
import { createAssignmentSchema } from "@registry/validation";
import { revalidatePath } from "next/cache";
import { createAssignment, getDefaultOrganization } from "../../src/server/registry-data";
import {
  flattenFieldErrors,
  getCurrencyCentsFromDollars,
  getOptionalFormValue,
  getRequiredFormValue,
  type FormActionState
} from "../../src/server/form-state";

export async function createAssignmentAction(
  _previousState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const organization = await getDefaultOrganization();

  const payload: CreateAssignmentRequest = {
    organizationId: organization.id,
    customerId: getRequiredFormValue(formData, "customerId"),
    assetId: getRequiredFormValue(formData, "assetId"),
    startDate: getRequiredFormValue(formData, "startDate"),
    endDate: getOptionalFormValue(formData, "endDate"),
    billingCadence: getRequiredFormValue(formData, "billingCadence") as CreateAssignmentRequest["billingCadence"],
    rateInCents: getCurrencyCentsFromDollars(formData, "rateDollars"),
    status: getRequiredFormValue(formData, "status") as CreateAssignmentRequest["status"],
    notes: getOptionalFormValue(formData, "notes")
  };

  const result = createAssignmentSchema.safeParse(payload);

  if (!result.success) {
    return {
      status: "error",
      message: "Assignment details need attention.",
      fieldErrors: flattenFieldErrors(result.error.flatten().fieldErrors)
    };
  }

  try {
    await createAssignment(result.data);
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Assignment could not be created."
    };
  }

  revalidatePath(registryWebRoutes.dashboard);
  revalidatePath(registryWebRoutes.customers);
  revalidatePath(registryWebRoutes.assets);
  revalidatePath(registryWebRoutes.assignments);

  return {
    status: "success",
    message: "Assignment created."
  };
}
