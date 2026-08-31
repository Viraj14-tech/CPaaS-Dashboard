import { z } from 'zod';

export const CampaignSchema = z.object({
  campaignName: z.string().min(1, "Campaign name is required"),
  campaignDate: z.string().min(1, "Date is required"),
  templateName: z.string().min(1, "Template name is required"),
  category: z.string().min(1, "Category is required"),
  templateType: z.string().min(1, "Template type is required"),
  status: z.string().min(1, "Status is required"),
  totalAudience: z.coerce.number().min(0, "Must be >= 0"),
  sent: z.coerce.number().min(0, "Must be >= 0"),
  delivered: z.coerce.number().min(0, "Must be >= 0"),
  failed: z.coerce.number().min(0, "Must be >= 0"),
  read: z.coerce.number().min(0, "Must be >= 0"),
  amountSpent: z.coerce.number().min(0, "Must be >= 0"),
}).refine(data => data.sent <= data.totalAudience, {
  message: "Sent messages cannot exceed total audience",
  path: ["sent"],
}).refine(data => data.delivered + data.failed <= data.sent, {
  message: "Delivered + Failed cannot exceed Sent messages",
  path: ["delivered"],
});

export const WabaSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  mobileNumber: z.string().min(1, "Mobile number is required"),
  createdOn: z.string().min(1, "Creation date is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  verificationStatus: z.string().min(1, "Verification status is required"),
  phoneStatus: z.string().min(1, "Phone status is required"),
  quality: z.string().min(1, "Quality is required"),
  messagingLimit: z.string().min(1, "Messaging limit is required"),
  businessName: z.string().min(1, "Business name is required"),
  businessId: z.string().min(1, "Business ID is required"),
  wabaAccountId: z.string().min(1, "WABA Account ID is required"),
  phoneNumberId: z.string().min(1, "Phone Number ID is required"),
  insights: z.string().min(1, "Insights status is required"),
});

export const ClientSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  displayName: z.string().min(1, "Display name is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  status: z.string().min(1, "Status is required"),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});
