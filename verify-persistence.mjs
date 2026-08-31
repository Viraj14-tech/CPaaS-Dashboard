import { campaignsStore } from './src/lib/store/campaigns.js';
import { clientsStore } from './src/lib/store/clients.js';
import { usersStore } from './src/lib/store/users.js';
import fs from 'fs';

console.log("--- Starting Persistence & Isolation Verification ---");

// Helper to check conditions
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

// 1. Log in as admin conceptually (we will perform admin action on store directly as the server action would)
console.log("\n[Admin] Adding new MANSE campaign...");
const manseClient = clientsStore.getAll().find(c => c.name.toLowerCase().includes('manse') || c.id === 'client_1');
assert(!!manseClient, "Found MANSE client");

const initialCampaigns = campaignsStore.findByClientId(manseClient.id);
const initialSent = initialCampaigns.reduce((sum, c) => sum + c.sent, 0);

// Add campaign
const newCampaign = campaignsStore.create({
  id: `test_camp_${Date.now()}`,
  clientId: manseClient.id,
  campaignName: 'Test Persistence Campaign',
  campaignDate: new Date().toISOString(),
  templateName: 'test_template',
  category: 'MARKETING',
  templateType: 'text',
  status: 'completed',
  totalAudience: 1000,
  sent: 900,
  delivered: 850,
  failed: 50,
  read: 800,
  amountSpent: 450,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// 2. Confirm campaigns.json changes
const fileContent = JSON.parse(fs.readFileSync('./data/campaigns.json', 'utf8'));
const fileHasCampaign = fileContent.some(c => c.id === newCampaign.id);
assert(fileHasCampaign, "Campaign added to data/campaigns.json");

// 3. Confirm Dashboard KPIs changed (simulating what the client page reads)
const updatedCampaigns = campaignsStore.findByClientId(manseClient.id);
const newSent = updatedCampaigns.reduce((sum, c) => sum + c.sent, 0);
assert(newSent === initialSent + 900, "Dashboard KPI Sent increased by exactly 900");

// 4. Edit the campaign
console.log("\n[Admin] Editing campaign...");
campaignsStore.update(newCampaign.id, { sent: 950, delivered: 900 });

// Confirm edit persisted
const editedCampaign = campaignsStore.findById(newCampaign.id);
assert(editedCampaign.sent === 950, "Campaign edit applied successfully (sent = 950)");

const editedKPIs = campaignsStore.findByClientId(manseClient.id);
const editedSent = editedKPIs.reduce((sum, c) => sum + c.sent, 0);
assert(editedSent === initialSent + 950, "Dashboard KPI Sent updated to new value");

// 5. Delete it
console.log("\n[Admin] Deleting campaign...");
campaignsStore.delete(newCampaign.id);

// Confirm deletion
const deletedCampaign = campaignsStore.findById(newCampaign.id);
assert(!deletedCampaign, "Campaign disappeared from store");
const fileContentAfterDelete = JSON.parse(fs.readFileSync('./data/campaigns.json', 'utf8'));
assert(!fileContentAfterDelete.some(c => c.id === newCampaign.id), "Campaign disappeared from data/campaigns.json");

// 6. Multi-client Isolation Test
console.log("\n[Admin] Creating a second client (TRASSIR)...");
const trassirClient = clientsStore.create({
  id: `client_${Date.now()}`,
  name: 'TRASSIR',
  displayName: 'TRASSIR Security',
  contactPerson: 'Admin',
  phone: '1234567890',
  email: 'admin@trassir.com',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

campaignsStore.create({
  id: `trassir_camp_${Date.now()}`,
  clientId: trassirClient.id,
  campaignName: 'Secret Trassir Campaign',
  campaignDate: new Date().toISOString(),
  templateName: 'secret',
  category: 'UTILITY',
  templateType: 'text',
  status: 'completed',
  totalAudience: 100,
  sent: 100,
  delivered: 100,
  failed: 0,
  read: 100,
  amountSpent: 50,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// Simulate Manse log in
console.log("\n[Isolation] Testing Manse access to TRASSIR data...");
// In our app, /dashboard uses campaignsStore.findByClientId(session.clientId).
const manseSessionClientId = manseClient.id; 
const manseVisibleCampaigns = campaignsStore.findByClientId(manseSessionClientId);

const canSeeTrassir = manseVisibleCampaigns.some(c => c.clientId === trassirClient.id);
assert(!canSeeTrassir, "MANSE cannot retrieve TRASSIR's campaigns using the store lookup (isolation enforced)");

console.log("\n✅ All Persistence and Isolation tests completed successfully!");
