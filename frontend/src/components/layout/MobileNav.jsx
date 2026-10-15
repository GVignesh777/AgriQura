import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, CloudSun, Sprout, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MobileNav() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { to: '/weather', icon: CloudSun, label: 'Weather' },
    { to: '/assistant', icon: MessageSquare, label: 'AI Chat', isCenter: true },
    { to: '/my-farm', icon: Sprout, label: 'Farm' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Fade gradient above the bar */}
      <div className="h-6 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />

      <nav className="bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/60 px-2 pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex items-end justify-around py-1.5 max-w-md mx-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all duration-200 ${
                    link.isCenter ? 'relative -mt-4' : ''
                  } ${
                    isActive
                      ? 'text-agri-400'
                      : 'text-slate-500 hover:text-slate-300'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.isCenter ? (
                      /* Elevated center Voice button */
                      <div className={`p-3 rounded-2xl shadow-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-br from-agri-500 to-emerald-500 shadow-agri-500/40 scale-105'
                          : 'bg-gradient-to-br from-agri-600 via-emerald-500 to-emerald-400 shadow-agri-600/30 hover:shadow-agri-500/40'
                      }`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                        isActive ? 'bg-agri-500/10' : ''
                      }`}>
                        <Icon className={`w-[18px] h-[18px] transition-all duration-200 ${
                          isActive ? 'text-agri-400' : ''
                        }`} />
                      </div>
                    )}
                    <span className={`text-[10px] font-semibold transition-all ${
                      isActive ? 'text-agri-400' : ''
                    }`}>
                      {link.label}
                    </span>
                    {/* Active indicator dot */}
                    {isActive && !link.isCenter && (
                      <span className="w-1 h-1 rounded-full bg-agri-400 -mt-0.5" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
