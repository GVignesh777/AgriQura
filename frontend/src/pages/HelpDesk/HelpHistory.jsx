import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { History, MessageSquare, Clock, ArrowRight, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function HelpHistory({
  isAuthenticated,
  history = [],
  loading = false,
}) {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25 font-bold uppercase">
            Open
          </span>
        );
      case 'in progress':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/25 font-bold uppercase">
            In Progress
          </span>
        );
      case 'resolved':
      case 'completed':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-bold uppercase">
            Resolved
          </span>
        );
      default:
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold uppercase">
            {status || 'Logged'}
          </span>
        );
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-agri-400 text-xs font-bold uppercase tracking-wider mb-1">
              <History className="w-3.5 h-3.5" />
              <span>Your Account Support</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Recent Help & Support History
            </h2>
          </div>

          {isAuthenticated && history.length > 0 && (
            <Link
              to="/history"
              className="text-xs font-semibold text-agri-400 hover:text-agri-300 flex items-center gap-1"
            >
              <span>View All Past Queries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Auth Gate Check */}
        {!isAuthenticated ? (
          <div className="py-10 text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                Sign in to view your help history
              </h3>
              <p className="text-xs text-slate-400">
                Track your active support tickets, past AI conversation transcripts, and field recommendations.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link to="/login" className="btn-primary py-2.5 px-5 text-xs font-bold">
                Sign In
              </Link>
              <Link to="/register" className="btn-secondary py-2.5 px-4 text-xs font-semibold">
                Create Account
              </Link>
            </div>
          </div>
        ) : loading ? (
          /* Loading skeleton */
          <div className="py-6 space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 animate-pulse flex items-center justify-between">
                <div className="space-y-2">
                  <div className="w-48 h-4 bg-slate-800 rounded" />
                  <div className="w-24 h-3 bg-slate-800 rounded" />
                </div>
                <div className="w-16 h-6 bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        ) : history.length === 0 ? (
          /* Empty History */
          <div className="py-10 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-agri-500/10 border border-agri-500/20 text-agri-400 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No support requests yet</h3>
            <p className="text-xs text-slate-400">
              When you ask the AI assistant questions or submit issue reports, they will be archived here for easy reference.
            </p>
            <div className="pt-2">
              <Link to="/assistant" className="btn-primary py-2 px-4 text-xs font-bold inline-flex">
                Ask a Farm Question
              </Link>
            </div>
          </div>
        ) : (
          /* History List */
          <div className="divide-y divide-slate-800/80 mt-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-950/30 px-3 rounded-xl transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">
                      {item.title}
                    </span>
                    {getStatusBadge(item.status)}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="text-slate-300 font-medium">{item.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => navigate(item.type === 'query' ? '/assistant' : '#report-problem')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-700"
                  >
                    <span>{item.type === 'query' ? 'View Conversation' : 'Ticket Info'}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
