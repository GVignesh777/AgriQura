import React, { useState, useRef } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  Loader2,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import contactConfig from '../../config/contactConfig';
import contactService from '../../services/contact.service';

export default function ContactForm({
  selectedSubject = '',
  onResetSubject,
  formRef
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    userType: 'Farmer',
    subject: selectedSubject || 'General Inquiry',
    message: ''
  });

  const [attachment, setAttachment] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error' | 'offline'
  const [ticketId, setTicketId] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  // Sync prop changes for pre-filled subject
  React.useEffect(() => {
    if (selectedSubject) {
      setFormData((prev) => ({ ...prev, subject: selectedSubject }));
    }
  }, [selectedSubject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileError('');

    if (!file) return;

    // Check size <= 5MB
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size exceeds 5MB limit. Please upload a smaller file.');
      return;
    }

    // Check mime type (Images & PDFs)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Unsupported file type. Please upload JPG, PNG, WEBP, or PDF.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachment({
        filename: file.name,
        fileSize: file.size,
        mimeType: file.type,
        fileUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setAttachment(null);
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!navigator.onLine) {
      setSubmitStatus('offline');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await contactService.submitContact({
        ...formData,
        attachment
      });

      if (res.success) {
        setTicketId(res.ticketId || `AQ-2026-${Math.floor(10000 + Math.random() * 90000)}`);
        setSubmitStatus('success');
        // Reset fields
        setFormData({
          name: '',
          email: '',
          phone: '',
          userType: 'Farmer',
          subject: 'General Inquiry',
          message: ''
        });
        setAttachment(null);
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTicketId = () => {
    if (ticketId) {
      navigator.clipboard.writeText(ticketId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section ref={formRef} className="space-y-6">
      
      {/* ──── SUCCESS STATE ──── */}
      {submitStatus === 'success' && (
        <div className="p-8 sm:p-10 bg-slate-900 border border-agri-500/40 rounded-3xl text-center space-y-6 shadow-2xl animate-scale-up">
          <div className="w-16 h-16 rounded-full bg-agri-500/20 text-agri-400 border border-agri-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="text-2xl font-extrabold text-white">Message Sent Successfully</h3>
            <p className="text-sm text-slate-300">
              Thank you for reaching out to AgriQura. Our agricultural support team has received your message and will review it promptly.
            </p>
          </div>

          {/* Reference Ticket ID Card */}
          <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-2xl max-w-sm mx-auto space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Your Support Reference ID:
            </p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-base sm:text-lg font-mono font-extrabold text-amber-400">
                {ticketId}
              </code>
              <button
                onClick={copyTicketId}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                title="Copy Reference ID"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Save this reference ID for future tracking and follow-up communication.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setSubmitStatus(null)}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
            >
              Send Another Message
            </button>
            <a
              href="/"
              className="px-6 py-2.5 bg-agri-500 hover:bg-agri-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md"
            >
              Return to Home
            </a>
          </div>
        </div>
      )}

      {/* ──── ERROR STATE ──── */}
      {submitStatus === 'error' && (
        <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-red-400 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>Something went wrong. We couldn't submit your message. Please try again.</span>
          </div>
          <button
            onClick={() => setSubmitStatus(null)}
            className="px-3 py-1.5 bg-red-500/20 text-red-300 text-xs font-bold rounded-lg hover:bg-red-500/30 shrink-0"
          >
            Dismiss & Retry
          </button>
        </div>
      )}

      {/* ──── OFFLINE STATE ──── */}
      {submitStatus === 'offline' && (
        <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-amber-300 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>You're currently offline. Please check your internet connection and try again.</span>
          </div>
          <button
            onClick={() => setSubmitStatus(null)}
            className="px-3 py-1.5 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-lg hover:bg-amber-500/30 shrink-0"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ──── MAIN FORM ──── */}
      {submitStatus !== 'success' && (
        <div className="p-6 sm:p-10 bg-slate-900/95 border border-slate-800 rounded-3xl space-y-6 shadow-2xl backdrop-blur-sm">
          
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white">Send Us a Message</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Tell us how we can help. Our support team typically responds to all inquiries as soon as possible.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-agri-500/40 focus:border-agri-500 transition-all shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-agri-500/40 focus:border-agri-500 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Row 2: Phone Number & User Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">
                  Phone Number <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-agri-500/40 focus:border-agri-500 transition-all shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">
                  I am a... <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-agri-500/40 focus:border-agri-500 transition-all cursor-pointer appearance-none pr-10"
                  >
                    {contactConfig.userTypes.map((type) => (
                      <option
                        key={type}
                        value={type}
                        className="bg-slate-900 text-white py-2 px-3 font-medium"
                      >
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Row 3: Subject / Reason */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">
                Subject / Reason for Contact <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-agri-500/40 focus:border-agri-500 transition-all cursor-pointer appearance-none pr-10"
                >
                  {contactConfig.subjects.map((sub) => (
                    <option
                      key={sub}
                      value={sub}
                      className="bg-slate-900 text-white py-2 px-3 font-medium"
                    >
                      {sub}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Row 4: Message Content (High Contrast, Crisp White Text) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">
                  Message Details <span className="text-red-400">*</span>
                </label>
                <span className="text-[11px] font-semibold text-slate-400">
                  {formData.message.length} / 3000 chars
                </span>
              </div>
              <textarea
                name="message"
                required
                rows={5}
                maxLength={3000}
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your question, issue, or feedback in detail..."
                className="w-full px-4 py-3.5 bg-slate-950/90 border border-slate-700/80 rounded-xl text-sm text-white font-normal placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-agri-500/50 focus:border-agri-500 transition-all shadow-inner resize-y min-h-[140px] leading-relaxed"
                style={{ color: '#ffffff', backgroundColor: '#030712' }}
              />
            </div>

            {/* Optional Attachment Area */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                <span>Attach Screenshot or Document</span>
                <span className="text-slate-500 font-normal">(Max 5MB - JPG, PNG, PDF)</span>
              </label>

              {!attachment ? (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    className="hidden"
                    id="contact-file-upload"
                  />
                  <label
                    htmlFor="contact-file-upload"
                    className="p-4 border-2 border-dashed border-slate-700/80 hover:border-agri-500/60 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all bg-slate-950/50 text-xs font-medium text-slate-400 hover:text-slate-200"
                  >
                    <Paperclip className="w-4 h-4 text-agri-400" />
                    <span>Click to attach an image or PDF file</span>
                  </label>
                </div>
              ) : (
                <div className="p-3 bg-slate-950 border border-slate-700 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5 truncate">
                    {attachment.mimeType?.includes('image') ? (
                      <ImageIcon className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                    )}
                    <span className="text-xs font-medium text-slate-200 truncate max-w-xs">
                      {attachment.filename}
                    </span>
                    <span className="text-[10px] text-slate-500 shrink-0">
                      ({Math.round(attachment.fileSize / 1024)} KB)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {fileError && <p className="text-xs text-red-400">{fileError}</p>}
            </div>

            {/* Submit CTA */}
            <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800">
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-agri-400 shrink-0" />
                <span>Your information is protected by our strict privacy policy.</span>
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-agri-600 to-emerald-600 hover:from-agri-500 hover:to-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-agri-950/60 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shrink-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      )}

    </section>
  );
}
