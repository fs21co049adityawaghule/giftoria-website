import React, { useState } from 'react';
import { Upload, X, CheckCircle, FileText, Image as ImageIcon, AlertCircle, Sparkles } from 'lucide-react';
import { CustomizationData, Product } from '../../types';
import { businessConfig } from '../../config/businessConfig';
import { useToast } from '../../context/ToastContext';

interface CustomizationSectionProps {
  product: Product;
  value: CustomizationData;
  onChange: (data: CustomizationData) => void;
}

export const CustomizationSection: React.FC<CustomizationSectionProps> = ({
  product,
  value,
  onChange,
}) => {
  const { showToast } = useToast();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...value, customMessage: e.target.value });
  };

  const handleFileUpload = (file: File) => {
    setUploadError(null);

    // Validate size strictly (1 MB = 1,048,576 bytes)
    if (file.size > businessConfig.uploadMaxSizeBytes) {
      const errorMsg = 'File must be 1 MB or smaller.';
      setUploadError(errorMsg);
      showToast(errorMsg, 'error');
      return;
    }

    // Validate format
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      const errorMsg = 'Allowed formats: JPG, JPEG, PNG, WEBP, PDF';
      setUploadError(errorMsg);
      showToast(errorMsg, 'error');
      return;
    }

    // Format human readable size
    const sizeKB = (file.size / 1024).toFixed(1);
    const formattedSize = `${sizeKB} KB`;

    // Create image preview if image type
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange({
          ...value,
          uploadedFileName: file.name,
          uploadedFileType: file.type,
          uploadedFileSizeFormatted: formattedSize,
          uploadedFileUrl: e.target?.result as string,
        });
        showToast('Design uploaded successfully! ✨', 'success');
      };
      reader.readAsDataURL(file);
    } else {
      // PDF or non-image document
      onChange({
        ...value,
        uploadedFileName: file.name,
        uploadedFileType: file.type,
        uploadedFileSizeFormatted: formattedSize,
        uploadedFileUrl: undefined,
      });
      showToast('Document uploaded successfully!', 'success');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    onChange({
      ...value,
      uploadedFileName: undefined,
      uploadedFileType: undefined,
      uploadedFileSizeFormatted: undefined,
      uploadedFileUrl: undefined,
    });
    setUploadError(null);
    showToast('File removed', 'info');
  };

  return (
    <div className="bg-giftoria-cream-100 rounded-3xl p-5 sm:p-6 border border-giftoria-wine-800/15 shadow-sm space-y-6">
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-giftoria-wine-800/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-giftoria-wine-800 text-giftoria-gold-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-giftoria-wine-900">
              Personalize Your Gift
            </h3>
            <p className="text-xs text-gray-500">
              Add your message and custom design (Max 1 MB)
            </p>
          </div>
        </div>
        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-giftoria-gold-500 text-giftoria-charcoal-900 rounded-full">
          Step-by-Step
        </span>
      </div>

      {/* Custom Message Field */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-giftoria-charcoal-900">
          1. Add Your Custom Message / Name <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="Enter name, quote, date, or customization instructions..."
          value={value.customMessage || ''}
          onChange={handleMessageChange}
          className="w-full bg-white border border-gray-300 rounded-2xl p-3.5 text-xs text-giftoria-charcoal-900 focus:outline-none focus:ring-2 focus:ring-giftoria-wine-800 focus:border-transparent transition-all placeholder:text-gray-400"
        />
        <div className="text-[11px] text-gray-500 flex justify-between">
          <span>Tip: Add recipient name or anniversary quote</span>
          <span>{value.customMessage?.length || 0} chars</span>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-giftoria-charcoal-900">
          2. Upload Your Design or Photo <span className="text-gray-400 font-normal">(Max 1 MB)</span>
        </label>

        {/* Uploaded File Display Card */}
        {value.uploadedFileName ? (
          <div className="bg-white border-2 border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm animate-in fade-in">
            <div className="flex items-center gap-3 overflow-hidden">
              {value.uploadedFileUrl ? (
                <img
                  src={value.uploadedFileUrl}
                  alt="Upload preview"
                  className="w-12 h-12 rounded-xl object-cover border shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-giftoria-wine-50 text-giftoria-wine-800 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
              )}
              <div className="truncate">
                <div className="font-semibold text-xs text-giftoria-charcoal-900 truncate">
                  {value.uploadedFileName}
                </div>
                <div className="text-[11px] text-gray-500 flex items-center gap-2">
                  <span>{value.uploadedFileSizeFormatted}</span>
                  <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">
                    ✓ Validated (&lt; 1 MB)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <label className="text-[11px] font-bold text-giftoria-wine-800 hover:underline cursor-pointer">
                Replace
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Dropzone Box */
          <label className="border-2 border-dashed border-giftoria-wine-800/30 hover:border-giftoria-wine-800 rounded-2xl p-6 text-center bg-white cursor-pointer transition-all duration-200 group block">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-giftoria-wine-50 text-giftoria-wine-800 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-giftoria-wine-900 group-hover:text-giftoria-wine-700">
              Click to browse or drop your photo/design here
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              Supports JPG, JPEG, PNG, WEBP, PDF (Strictly Maximum 1 MB)
            </div>
          </label>
        )}

        {/* Error Feedback */}
        {uploadError && (
          <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 text-xs p-3 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{uploadError}</span>
          </div>
        )}
      </div>

      {/* Live Readiness Summary Checklist */}
      <div className="pt-3 border-t border-giftoria-wine-800/10 grid grid-cols-3 gap-2 text-center text-[11px]">
        <div className={`p-2 rounded-xl font-medium flex items-center justify-center gap-1 ${value.customMessage ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Message</span>
        </div>
        <div className={`p-2 rounded-xl font-medium flex items-center justify-center gap-1 ${value.uploadedFileName ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Design File</span>
        </div>
        <div className="p-2 rounded-xl font-bold bg-giftoria-wine-800 text-white flex items-center justify-center gap-1 shadow-sm">
          <span>Ready to Customize</span>
        </div>
      </div>
    </div>
  );
};
