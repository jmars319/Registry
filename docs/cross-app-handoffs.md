# Cross-App Handoffs

Registry should interoperate with the rest of the tenra suite through explicit exported records or local APIs. The first implementation should be file-based and easy to inspect before any background automation is introduced.

## Registry to Ledger

Purpose: move posted financial activity into a bookkeeping system.

Canonical envelope: `tenra-registry.ledger-export.v1`.

```json
{
  "schema": "tenra-registry.ledger-export.v1",
  "exportedAt": "2026-05-06T17:30:00.000Z",
  "organizationId": "organization-id",
  "sourceApp": "registry",
  "rows": [
    {
      "externalId": "receivable-entry-id",
      "customerCode": "customer-id",
      "customerName": "Customer name",
      "entryType": "charge",
      "effectiveDate": "YYYY-MM-DD",
      "description": "Readable ledger description",
      "amountMinor": 10000
    }
  ]
}
```

## Scout to Registry

Purpose: turn a qualified opportunity into a customer or prospect record.

Minimum record:

```json
{
  "schema": "tenra.scout.registry-lead.v1",
  "businessName": "Business name",
  "contactName": "optional-contact",
  "email": "optional-email",
  "phone": "optional-phone",
  "websiteUrl": "optional-url",
  "evidence": [
    {
      "kind": "screenshot | audit | search-result | note",
      "title": "Evidence title",
      "source": "source path or URL"
    }
  ],
  "recommendedNextStep": "Human-readable next action"
}
```

## Registry to Assembly

Purpose: create documents, notices, or content from approved operational context.

Canonical envelope: `tenra-registry.assembly-document-request.v1`.

```json
{
  "schema": "tenra-registry.assembly-document-request.v1",
  "exportedAt": "2026-05-06T17:30:00.000Z",
  "sourceApp": "registry",
  "organizationId": "organization-id",
  "customerId": "customer-id",
  "documentType": "notice",
  "title": "Customer notice",
  "contextMarkdown": "Approved facts to use",
  "desiredOutput": "notice"
}
```

## Align to Registry

Purpose: attach public profile and location state to an organization/customer location.

Minimum record:

```json
{
  "schema": "tenra.align.registry-location-state.v1",
  "source": "google-business-profile",
  "providerLocationId": "locations/123",
  "displayName": "Public profile name",
  "address": "Public address",
  "profileHealthScore": 0,
  "reviewNeedsReplyCount": 0,
  "syncIssues": [
    {
      "severity": "info | warning | critical",
      "title": "Issue title",
      "recommendedAction": "Action to review"
    }
  ]
}
```

## Guardrail and Proxy

Guardrail should approve or deny any AI-capable write, send, file, or network action before it runs. Proxy should shape outgoing customer-visible wording after a human has chosen the content goal and before the final review step.
