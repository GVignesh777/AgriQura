import React, { useState } from 'react';
import {
  AlertTriangle,
  Upload,
  X,
  MapPin,
  CheckCircle2,
  Loader2,
  RefreshCw,
  FileImage,
  Send,
} from 'lucide-react';
import { helpDeskService } from './helpDesk.service';

export default function ReportProblem({ user, onReportSubmitted }) {
  const [category, setCategory] = useState('AI Response');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [screenshotName, setScreenshotName] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [ticketDetails, setTicketDetails] = useState(null);

  const categories = [
    'AI Response',
    'Crop Information',
    'Market Price',
    'Weather',
    'Voice Assistant',
    'Login/Account',
    'Technical Issue',
    'Other',
  ];

  // Geolocation handler
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrors((prev) => ({
        ...prev,
        location: 'Geolocation is not supported by your browser.',
      }));
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const locString = `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`;
        setLocation(locString);
        setErrors((prev) => ({ ...prev, location: null }));
      },
      (err) => {
        setIsLocating(false);
        setErrors((prev) => ({
          ...prev,
          location: 'Could not acquire GPS position. You can type your district instead.',
        }));
      },
      { timeout: 8000 }
    );
  };

  // Image Upload handler with <5MB validation
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        file: 'Please upload a valid image file (.png, .jpg, .webp).',
      }));
      return;
    }

    // Validate size (5MB max)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrors((prev) => ({
        ...prev,
        file: 'Image size exceeds maximum limit of 5MB.',
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, file: null }));
    setScreenshotName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeScreenshot = () => {
    setScreenshotPreview(null);
    setScreenshotName('');
  };

  const validateForm = () => {
    const errs = {};
    if (!category) {
      errs.category = 'Please select a category';
    }
    if (!description.trim()) {
      errs.description = 'Please describe the problem or issue you encountered';
    } else if (description.trim().length < 10) {
      errs.description = 'Description must be at least 10 characters long';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');

    const payload = {
      category,
      description: description.trim(),
      screenshot: screenshotPreview,
      location: location.trim(),
      contactPhone: contactPhone.trim(),
      farmerName: user?.name || 'Guest Farmer',
    };

    const { data, error } = await helpDeskService.reportProblem(payload);

    setIsSubmitting(false);

    if (error) {
      setSubmitError(error);
    } else {
      setSubmitSuccess(true);
      setTicketDetails(data.ticket);
      onReportSubmitted?.();
    }
  };

  const handleResetForm = () => {
    setCategory('AI Response');
    setDescription('');
    setLocation('');
    setScreenshotPreview(null);
    setScreenshotName('');
    setErrors({});
    setSubmitSuccess(false);
    setSubmitError('');
    setTicketDetails(null);
  };

  return (
    <section id="report-problem" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Report a Problem or Inaccurate Advisory
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Help us improve AgriQura. Report incorrect crop advice, app bugs, or connectivity problems.
            </p>
          </div>
        </div>

        {/* Success State */}
        {submitSuccess ? (
          <div className="p-8 text-center space-y-4 animate-fade-in-down">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-white">
                Thanks for helping us improve AgriQura!
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Your issue has been submitted successfully. Our agronomy and technical teams review reports to improve model quality.
              </p>
            </div>

            {ticketDetails && (
              <div className="inline-block p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300">
                <span className="text-slate-400">Ticket Reference: </span>
                <span className="font-mono font-bold text-agri-400">{ticketDetails.id}</span>
                <span className="mx-2 text-slate-600">•</span>
                <span className="font-semibold text-amber-400">{ticketDetails.category}</span>
              </div>
            )}

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={handleResetForm}
                className="btn-primary py-2.5 px-5 text-xs font-semibold"
              >
                Submit Another Report
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="space-y-6">
            {submitError && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-between text-xs text-rose-300">
                <span>{submitError}</span>
                <button
                  type="button"
                  onClick={() => setSubmitError('')}
                  className="text-rose-400 hover:text-rose-200"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Category Select */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Problem Category <span className="text-red-400">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-[11px] text-rose-400">{errors.category}</p>
                )}
              </div>

              {/* Contact Phone (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Contact Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-agri-500"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                Problem Description <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what happened (e.g. 'The AI recommended spraying pesticide during heavy rain' or 'Market price for Warangal cotton was outdated')..."
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-agri-500"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Minimum 10 characters</span>
                <span>{description.length} characters</span>
              </div>
              {errors.description && (
                <p className="text-[11px] text-rose-400">{errors.description}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                Farm / District Location (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Warangal Rural, Telangana"
                  className="flex-1 px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-agri-500"
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                  title="Detect current GPS location"
                >
                  {isLocating ? (
                    <Loader2 className="w-4 h-4 animate-spin text-agri-400" />
                  ) : (
                    <MapPin className="w-4 h-4 text-agri-400" />
                  )}
                  <span className="hidden sm:inline">Use GPS</span>
                </button>
              </div>
              {errors.location && (
                <p className="text-[11px] text-amber-400">{errors.location}</p>
              )}
            </div>

            {/* Screenshot Upload with Preview */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                Attach Screenshot (Optional, Max 5MB)
              </label>

              {screenshotPreview ? (
                <div className="relative inline-block border border-slate-700 rounded-2xl p-2 bg-slate-950/90">
                  <img
                    src={screenshotPreview}
                    alt="Screenshot Preview"
                    className="h-28 sm:h-36 w-auto object-cover rounded-xl border border-slate-800"
                  />
                  <button
                    type="button"
                    onClick={removeScreenshot}
                    className="absolute top-3 right-3 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-md"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[10px] text-slate-400 truncate max-w-xs mt-1 px-1">
                    {screenshotName}
                  </p>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-700 hover:border-agri-500/50 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/40 hover:bg-slate-950/80">
                  <Upload className="w-6 h-6 text-slate-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-300">
                    Click or drag image to upload screenshot
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    PNG, JPG, WEBP up to 5MB
                  </span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

              {errors.file && <p className="text-[11px] text-rose-400">{errors.file}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary py-3 px-6 text-sm font-bold shadow-lg shadow-agri-950/50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Submitting Report...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-white" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
