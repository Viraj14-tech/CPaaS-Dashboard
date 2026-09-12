-- Run this script in your Supabase SQL Editor to create the necessary tables

CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "contactPerson" TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL,
  "createdAt" TEXT NOT NULL,
  "updatedAt" TEXT NOT NULL
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  role TEXT NOT NULL,
  "clientId" TEXT,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE campaigns (
  id TEXT PRIMARY KEY,
  "clientId" TEXT NOT NULL,
  "campaignName" TEXT NOT NULL,
  "campaignDate" TEXT NOT NULL,
  "templateName" TEXT NOT NULL,
  category TEXT NOT NULL,
  "templateType" TEXT NOT NULL,
  status TEXT NOT NULL,
  "totalAudience" NUMERIC NOT NULL,
  sent NUMERIC NOT NULL,
  delivered NUMERIC NOT NULL,
  failed NUMERIC NOT NULL,
  read NUMERIC NOT NULL,
  "amountSpent" NUMERIC NOT NULL,
  "createdAt" TEXT NOT NULL,
  "updatedAt" TEXT NOT NULL
);

CREATE TABLE waba (
  id TEXT PRIMARY KEY,
  "clientId" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "mobileNumber" TEXT NOT NULL,
  "createdOn" TEXT NOT NULL,
  "expiryDate" TEXT NOT NULL,
  "verificationStatus" TEXT NOT NULL,
  "phoneStatus" TEXT NOT NULL,
  quality TEXT NOT NULL,
  "messagingLimit" TEXT NOT NULL,
  "businessName" TEXT NOT NULL,
  "businessId" TEXT NOT NULL,
  "wabaAccountId" TEXT NOT NULL,
  "phoneNumberId" TEXT NOT NULL,
  insights TEXT NOT NULL
);

-- Note: We use TEXT for dates/numbers where it maps strictly to the TypeScript interfaces.
-- NUMERIC is used for campaign stats to allow mathematical sorting if needed.
-- Make sure to turn OFF Row Level Security (RLS) for these tables if you just want it to work instantly without policies, 
-- or write policies to allow anon key access (e.g. `ALTER TABLE clients DISABLE ROW LEVEL SECURITY;` for all 4 tables).

ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns DISABLE ROW LEVEL SECURITY;
ALTER TABLE waba DISABLE ROW LEVEL SECURITY;
