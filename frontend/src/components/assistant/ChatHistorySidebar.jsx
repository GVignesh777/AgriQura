import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  Brain,
} from 'lucide-react';

/**
 * Group conversations by time category
 */
function groupConversations(conversations) {
  const groups = {
    today: [],
    yesterday: [],
    lastWeek: [],
    older: [],
  };

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
  const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

  conversations.forEach((conv) => {
    const convDate = new Date(conv.lastMessageAt || conv.updatedAt || conv.createdAt || Date.now());
    if (convDate >= todayStart) {
      groups.today.push(conv);
    } else if (convDate >= yesterdayStart) {
      groups.yesterday.push(conv);
    } else if (convDate >= weekStart) {
      groups.lastWeek.push(conv);
    } else {
      groups.older.push(conv);
    }
  });

  return groups;
}

export default function ChatHistorySidebar({
  conversations = [],
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onOpenMemoryModal,
  isOpen,
  onToggleOpen,
  isMobileOpen,
  onCloseMobile,
  user,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter((conv) =>
    (conv.title || 'Untitled Advisory').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const grouped = groupConversations(filteredConversations);

  const renderGroup = (title, items) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="mb-4">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5 flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>{title}</span>
          <span className="text-[10px] text-slate-500 font-medium">({items.length})</span>
        </h4>
        <div className="space-y-1">
          {items.map((conv) => {
            const isActive = activeConversationId === (conv._id || conv.id);

            return (
              <div
                key={conv._id || conv.id}
                onClick={() => {
                  onSelectConversation(conv._id || conv.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                  isActive
                    ? 'bg-agri-500/15 border border-agri-500/30 text-emerald-300 font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <MessageSquare
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  <p className="text-xs truncate font-sans">
                    {conv.title || 'Crop Advisory Session'}
                  </p>
                </div>

                {/* Delete Conversation Button */}
                {onDeleteConversation && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv._id || conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete Conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900/95 backdrop-blur-2xl border-r border-slate-800 text-slate-200 select-none">
      
      {/* Top Header: New Chat Button */}
      <div className="p-3.5 border-b border-slate-800/80 space-y-2.5 shrink-0">
        <button
          type="button"
          onClick={() => {
            onNewConversation();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-agri-600 to-emerald-600 hover:from-agri-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-agri-950/50 hover:brightness-110 active:scale-95 transition-all border border-emerald-400/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Conversation</span>
        </button>

        {/* Search Chats */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search queries..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-agri-500/60"
          />
        </div>
      </div>

      {/* Conversations Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2 py-3 custom-scrollbar">
        {filteredConversations.length > 0 ? (
          <>
            {renderGroup('Today', grouped.today)}
            {renderGroup('Yesterday', grouped.yesterday)}
            {renderGroup('Previous 7 Days', grouped.lastWeek)}
            {renderGroup('Older History', grouped.older)}
          </>
        ) : (
          <div className="text-center py-10 px-4 text-slate-500">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs">No previous chats found.</p>
            <p className="text-[11px] text-slate-600 mt-1">
              Start a new conversation to save advice.
            </p>
          </div>
        )}
      </div>

      {/* Long-Term Memory Button in Sidebar */}
      {onOpenMemoryModal && (
        <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-950/40 shrink-0">
          <button
            type="button"
            onClick={() => {
              onOpenMemoryModal();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-800/40 text-purple-200 text-xs font-semibold transition-all group shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <span>AI Farm Memory</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Active
            </span>
          </button>
        </div>
      )}

      {/* Bottom Profile Pill */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-agri-600/30 border border-agri-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {user?.name || 'Farmer'}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {user?.phone || 'AgriQura ID: ' + (user?._id?.slice(-5) || 'PRO')}
            </p>
          </div>
        </div>

        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Connected" />
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Collapsible Sidebar */}
      <div
        className={`hidden md:block transition-all duration-300 shrink-0 h-full relative ${
          isOpen ? 'w-64 lg:w-72' : 'w-0 overflow-hidden'
        }`}
      >
        <div className="w-64 lg:w-72 h-full">
          {sidebarContent}
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs h-full z-10 animate-slide-right shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
