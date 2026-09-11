import * as XLSX from 'xlsx';
import { z } from 'zod';
import { CampaignSchema } from '../validation';

export interface CampaignImportRow {
  "Campaign Name": string;
  "Date": string;
  "Template Name": string;
  "Category": string;
  "Template Type": string;
  "Status": string;
  "Total Audience": number | string;
  "Sent": number | string;
  "Delivered": number | string;
  "Failed": number | string;
  "Read": number | string;
  "Amount Spent": number | string;
}

export interface ParsedCampaignResult {
  valid: boolean;
  rowNumber: number;
  data: any | null;
  error: string | null;
}

const TEMPLATE_HEADERS = [
  "Campaign Name",
  "Date",
  "Template Name",
  "Category",
  "Template Type",
  "Status",
  "Total Audience",
  "Sent",
  "Delivered",
  "Failed",
  "Read",
  "Amount Spent"
];

const SUPPORTED_CATEGORIES = ["MARKETING", "UTILITY"];
const SUPPORTED_TEMPLATE_TYPES = ["text", "image", "video", "document"];
const SUPPORTED_STATUSES = ["completed", "scheduled", "failed", "draft"];

function parseDate(dateVal: any): string | null {
  if (!dateVal) return null;
  
  if (typeof dateVal === 'number') {
    // Excel serial date
    const date = new Date((dateVal - (25569)) * 86400 * 1000);
    return date.toISOString();
  }
  
  const dateStr = String(dateVal).trim();
  
  // DD-MM-YYYY format
  const ddMMyyyy = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/;
  const match = dateStr.match(ddMMyyyy);
  if (match) {
    const [, day, month, year] = match;
    const d = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T12:00:00.000Z`);
    return d.toISOString();
  }

  // Fallback to JS parsing
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d.toISOString();
  
  return null;
}

function parseNumber(val: any, defaultVal: number = 0): number {
  if (val === undefined || val === null || val === '') return defaultVal;
  if (typeof val === 'number') return val;
  const cleaned = String(val).replace(/[₹,]/g, '').trim();
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? defaultVal : parsed;
}

function normalizeEnum(val: string | undefined, validOptions: string[]): string {
  if (!val) return "";
  const cleaned = String(val).trim().toLowerCase();
  const option = validOptions.find(opt => opt.toLowerCase() === cleaned);
  return option || String(val).trim(); // Returns normalized if matches, else original (will fail validation)
}

export function generateCampaignTemplate() {
  const wsData = [
    TEMPLATE_HEADERS,
    [
      "September Webinar",
      "03-09-2026",
      "webinar_reminder",
      "Marketing",
      "Text",
      "Completed",
      25000,
      24780,
      23850,
      930,
      16500,
      18250
    ]
  ];

  const instructionsData = [
    ["Column", "Description"],
    ["Campaign Name", "Name displayed in campaign reports"],
    ["Date", "Format DD-MM-YYYY or standard Excel date"],
    ["Template Name", "WhatsApp template name"],
    ["Category", "Must be one of: Marketing, Utility"],
    ["Template Type", "Must be one of: Text, Image, Video, Document"],
    ["Status", "Must be one of: Completed, Scheduled, Failed, Draft"],
    ["Total Audience", "Whole number (e.g., 25000)"],
    ["Sent", "Whole number, must be <= Total Audience"],
    ["Delivered", "Whole number"],
    ["Failed", "Whole number, Delivered + Failed must be <= Sent"],
    ["Read", "Whole number, optional"],
    ["Amount Spent", "Numeric value only; do not type ₹"]
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wsInstructions = XLSX.utils.aoa_to_sheet(instructionsData);

  XLSX.utils.book_append_sheet(wb, ws, "Template");
  XLSX.utils.book_append_sheet(wb, wsInstructions, "Instructions");

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Turiya_Campaign_Bulk_Upload_Template.xlsx";
  a.click();
  URL.revokeObjectURL(url);
}

export async function parseCampaignExcel(file: File, existingCampaigns: any[] = []): Promise<ParsedCampaignResult[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Parse raw data
        const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        
        const results: ParsedCampaignResult[] = [];
        
        rawData.forEach((row, index) => {
          // Ignore fully blank rows
          if (Object.values(row).every(v => v === "" || v === null || v === undefined)) {
            return;
          }
          
          const rowNum = index + 2; // +1 for 0-index, +1 for header
          
          // Map to known schema
          const mappedData = {
            campaignName: String(row["Campaign Name"] || "").trim(),
            campaignDate: parseDate(row["Date"]),
            templateName: String(row["Template Name"] || "").trim(),
            category: normalizeEnum(row["Category"], SUPPORTED_CATEGORIES),
            templateType: normalizeEnum(row["Template Type"], SUPPORTED_TEMPLATE_TYPES),
            status: normalizeEnum(row["Status"], SUPPORTED_STATUSES),
            totalAudience: parseNumber(row["Total Audience"]),
            sent: parseNumber(row["Sent"]),
            delivered: parseNumber(row["Delivered"]),
            failed: parseNumber(row["Failed"]),
            read: parseNumber(row["Read"], 0),
            amountSpent: parseNumber(row["Amount Spent"])
          };

          if (!mappedData.campaignDate) {
            results.push({
              valid: false,
              rowNumber: rowNum,
              data: null,
              error: "Invalid or missing Date"
            });
            return;
          }

          // Duplicate check
          const parsedDate = new Date(mappedData.campaignDate).toDateString();
          const isDuplicate = existingCampaigns.some(c => 
            c.campaignName.toLowerCase() === mappedData.campaignName.toLowerCase() &&
            c.templateName.toLowerCase() === mappedData.templateName.toLowerCase() &&
            new Date(c.campaignDate).toDateString() === parsedDate
          );

          if (isDuplicate) {
            results.push({
              valid: false,
              rowNumber: rowNum,
              data: null,
              error: "Possible duplicate campaign (Name, Date, Template Match)"
            });
            return;
          }

          // Validation
          const validation = CampaignSchema.safeParse(mappedData);
          
          if (!SUPPORTED_CATEGORIES.includes(mappedData.category.toUpperCase())) {
             results.push({
               valid: false, rowNumber: rowNum, data: null, error: `Invalid Category. Must be Marketing or Utility.`
             });
             return;
          }

          if (!SUPPORTED_TEMPLATE_TYPES.includes(mappedData.templateType.toLowerCase())) {
             results.push({
               valid: false, rowNumber: rowNum, data: null, error: `Invalid Template Type.`
             });
             return;
          }

          if (!SUPPORTED_STATUSES.includes(mappedData.status.toLowerCase())) {
             results.push({
               valid: false, rowNumber: rowNum, data: null, error: `Invalid Status.`
             });
             return;
          }
          
          if (!validation.success) {
            results.push({
              valid: false,
              rowNumber: rowNum,
              data: null,
              error: validation.error.issues[0].message
            });
            return;
          }

          results.push({
            valid: true,
            rowNumber: rowNum,
            data: validation.data,
            error: null
          });
        });
        
        resolve(results);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("File reading failed"));
    reader.readAsArrayBuffer(file);
  });
}
