"use client";

import { useState, useRef } from "react";
import { X, Upload, FileDown, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { generateCampaignTemplate, parseCampaignExcel, ParsedCampaignResult } from "@/lib/utils/campaignExcel";
import { importBulkCampaigns } from "@/app/actions/admin/campaigns";
import * as XLSX from "xlsx";

export function BulkCampaignModal({ client, campaigns, onClose, onRefresh }: { client: any, campaigns: any[], onClose: () => void, onRefresh?: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<ParsedCampaignResult[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success'>('idle');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setIsParsing(true);
    setResults([]);
    
    try {
      const parsedResults = await parseCampaignExcel(selectedFile, campaigns);
      setResults(parsedResults);
    } catch (err) {
      alert("Failed to parse the Excel file. Please ensure it's a valid format.");
    } finally {
      setIsParsing(false);
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadTemplate = () => {
    generateCampaignTemplate();
  };

  const handleImport = async () => {
    const validRows = results.filter(r => r.valid).map(r => r.data);
    if (validRows.length === 0) return;
    
    setIsImporting(true);
    const result = await importBulkCampaigns(client.id, validRows);
    setIsImporting(false);
    
    if (result.error) {
      alert(`Import failed: ${result.error}`);
    } else {
      setImportStatus('success');
      if (onRefresh) onRefresh();
    }
  };

  const downloadErrorReport = () => {
    const errors = results.filter(r => !r.valid).map(r => ({
      Row: r.rowNumber,
      Error: r.error
    }));
    
    const ws = XLSX.utils.json_to_sheet(errors);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Errors");
    XLSX.writeFile(wb, "Campaign_Import_Errors.xlsx");
  };

  const validCount = results.filter(r => r.valid).length;
  const errorCount = results.filter(r => !r.valid).length;

  if (importStatus === 'success') {
    return (
      <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Campaigns Imported Successfully</h3>
          <p className="text-slate-600 mb-6">
            <span className="font-semibold text-slate-900">{validCount}</span> campaigns were added to the system.
          </p>
          {errorCount > 0 && (
            <p className="text-amber-600 text-sm mb-6 bg-amber-50 px-4 py-2 rounded-lg">
              {errorCount} rows were skipped due to validation errors.
            </p>
          )}
          <button onClick={onClose} className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium w-full">
            Close & Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50 rounded-t-xl">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Bulk Add Campaigns</h3>
            <p className="text-slate-500 text-sm mt-1">Upload an Excel file to add multiple campaigns at once.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {/* Template Download Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-indigo-50 border border-indigo-100 p-4 rounded-lg mb-6">
            <div className="flex items-center mb-3 sm:mb-0">
              <FileDown className="w-5 h-5 text-indigo-500 mr-3 shrink-0" />
              <p className="text-sm text-indigo-900">
                Need the column layout? Download the template, fill it in, then upload it below.
              </p>
            </div>
            <button 
              onClick={handleDownloadTemplate}
              className="whitespace-nowrap px-4 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-md text-sm font-medium hover:bg-indigo-50 transition-colors shadow-sm"
            >
              Download Template
            </button>
          </div>

          {/* Upload Area */}
          {!file && (
            <div 
              className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-slate-500" />
              </div>
              <h4 className="text-slate-700 font-semibold mb-1">Drag and drop your Excel file here</h4>
              <p className="text-slate-500 text-sm mb-4">.xlsx or .xls files supported</p>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-100 shadow-sm">
                Choose File
              </button>
            </div>
          )}

          {/* Parsing Loading State */}
          {isParsing && (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 font-medium">Parsing Excel file...</p>
            </div>
          )}

          {/* Results Area */}
          {file && !isParsing && results.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-slate-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{file.name}</p>
                    <p className="text-xs text-slate-500">{results.length} rows detected</p>
                  </div>
                </div>
                <button 
                  onClick={() => setFile(null)} 
                  className="text-sm text-slate-500 hover:text-slate-800 underline"
                >
                  Change file
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                  <p className="text-sm text-green-700 font-medium">Valid Campaigns</p>
                  <p className="text-2xl font-bold text-green-800">{validCount}</p>
                </div>
                <div className={`${errorCount > 0 ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'} border p-4 rounded-lg`}>
                  <p className={`text-sm font-medium ${errorCount > 0 ? 'text-red-700' : 'text-slate-600'}`}>Rows with Errors</p>
                  <p className={`text-2xl font-bold ${errorCount > 0 ? 'text-red-800' : 'text-slate-700'}`}>{errorCount}</p>
                </div>
              </div>

              {/* Errors Preview */}
              {errorCount > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-slate-800 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 text-red-500 mr-1.5" /> 
                      Validation Errors
                    </h4>
                    <button 
                      onClick={downloadErrorReport}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Download Error Report
                    </button>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 font-semibold text-slate-600 w-16">Row</th>
                          <th className="px-3 py-2 font-semibold text-slate-600">Error</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {results.filter(r => !r.valid).slice(0, 100).map((r, i) => (
                          <tr key={i} className="bg-white">
                            <td className="px-3 py-2 text-slate-500 font-medium">{r.rowNumber}</td>
                            <td className="px-3 py-2 text-red-600">{r.error}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {errorCount > 100 && <p className="text-xs text-slate-500 mt-2 italic">Showing first 100 errors. Download report to see all.</p>}
                </div>
              )}

              {/* Valid Data Preview */}
              {validCount > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm mb-2">Valid Data Preview</h4>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto max-h-48 overflow-y-auto">
                      <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead className="bg-slate-50 sticky top-0">
                          <tr>
                            <th className="px-3 py-2 font-semibold text-slate-600">Name</th>
                            <th className="px-3 py-2 font-semibold text-slate-600">Date</th>
                            <th className="px-3 py-2 font-semibold text-slate-600">Category</th>
                            <th className="px-3 py-2 font-semibold text-slate-600">Status</th>
                            <th className="px-3 py-2 font-semibold text-slate-600 text-right">Audience</th>
                            <th className="px-3 py-2 font-semibold text-slate-600 text-right">Sent</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {results.filter(r => r.valid).slice(0, 5).map((r, i) => (
                            <tr key={i} className="bg-white">
                              <td className="px-3 py-2 text-slate-800">{r.data.campaignName}</td>
                              <td className="px-3 py-2 text-slate-600">{new Date(r.data.campaignDate).toLocaleDateString()}</td>
                              <td className="px-3 py-2 text-slate-600">{r.data.category}</td>
                              <td className="px-3 py-2 text-slate-600 capitalize">{r.data.status}</td>
                              <td className="px-3 py-2 text-slate-600 text-right">{r.data.totalAudience.toLocaleString()}</td>
                              <td className="px-3 py-2 text-slate-600 text-right">{r.data.sent.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Showing first {Math.min(5, validCount)} of {validCount} campaigns</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-between items-center">
          <button 
            onClick={onClose} 
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium text-sm hover:bg-white"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleImport}
            disabled={isImporting || validCount === 0 || !file}
            className={`px-5 py-2 rounded-lg font-medium text-sm flex items-center transition-colors ${
              isImporting || validCount === 0 || !file 
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {isImporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Importing...
              </>
            ) : (
              `Import ${validCount > 0 ? validCount : ''} Campaigns`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
