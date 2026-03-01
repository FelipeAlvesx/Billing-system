// src/modules/billing/billing.types.ts
export const FeatureKey = {
  BASIC_DASHBOARD: "BASIC_DASHBOARD",
  API_ACCESS: "API_ACCESS",
  EXPORT_PDF: "EXPORT_PDF",
} as const;

export type FeatureKey = (typeof FeatureKey)[keyof typeof FeatureKey];

export const SubscriptionStatus = {
  ACTIVE: "ACTIVE",
  PAST_DUE: "PAST_DUE",
  CANCELED: "CANCELED",
} as const;

export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];