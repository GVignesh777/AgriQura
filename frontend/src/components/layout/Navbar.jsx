import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  Sprout,
  Bell,
  User,
  LogOut,
  Globe,
  Mic,
  Cpu,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  CloudSun,
  TrendingUp,
  Sparkles,
  Tractor,
  Shield,
  Leaf,
  Search,
  Bug,
  Landmark,
  ChevronRight,
  Headset,
  HelpCircle,
  Mail,
  Grid,
} from 'lucide-react';
import agrilogo from "../../assets/AgriQura_logo.png";
import LanguageSelectorModal from './LanguageSelectorModal';
import { SUPPORTED_LANGUAGES } from '../../i18n/i18n';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownTimerRef = useRef(null);
  const servicesTimerRef = useRef(null);

  // Track scroll to add depth effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Delayed close for dropdown (prevents flicker on gap between trigger & menu)
  const openDropdown = useCallback(() => {
    clearTimeout(dropdownTimerRef.current);
    setProfileDropdownOpen(true);
  }, []);

  const scheduleCloseDropdown = useCallback(() => {
    dropdownTimerRef.current = setTimeout(() => setProfileDropdownOpen(false), 200);
  }, []);

  const openServices = useCallback(() => {
    clearTimeout(servicesTimerRef.current);
    setServicesDropdownOpen(true);
  }, []);

  const scheduleCloseServices = useCallback(() => {
    servicesTimerRef.current = setTimeout(() => setServicesDropdownOpen(false), 200);
  }, []);

  const navLinks = [
    { path: '/dashboard', label: t('nav.dashboard', 'Dashboard'), icon: LayoutDashboard },
    {
      label: t('nav.services', 'Services'),
      icon: Grid,
      subLinks: [
        { path: '/assistant', label: t('nav.assistant', 'AI Assistant'), icon: Cpu, badge: 'Groq AI' },
        { path: '/disease', label: t('nav.disease', 'Disease Scan'), icon: Bug },
        { path: '/schemes', label: t('nav.schemes', 'Govt Schemes'), icon: Landmark },
        { path: '/my-farm', label: t('nav.myFarm', 'My Farm'), icon: Tractor },
        { path: '/market', label: t('nav.market', 'Mandi Rates'), icon: TrendingUp },
        { path: '/weather', label: t('nav.weather', 'Weather'), icon: CloudSun },
      ]
    },
    { path: '/help-desk', label: t('nav.helpDesk', 'Help-Line Desk'), icon: Headset },
    { path: '/faq', label: t('nav.faq', 'FAQ'), icon: HelpCircle },
    { path: '/contact', label: t('nav.contact', 'Contact'), icon: Mail },
  ];

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/login');
  };

  const currentLangCode = i18n.language || 'en';
  const currentLang =
    SUPPORTED_LANGUAGES.find(
      (l) => l.code === currentLangCode || currentLangCode.startsWith(l.code)
    ) || SUPPORTED_LANGUAGES[0];

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const userPhoto = user?.photoURL || user?.profilePic || user?.avatar || user?.picture;

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
            ? 'bg-slate-950/92 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-slate-800/60'
            : 'bg-slate-950/70 backdrop-blur-xl border-b border-transparent'
          }`}
      >
        {/* Top accent line — subtle gradient glow */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-agri-500/50 to-transparent" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-3">

            {/* ───── Brand Logo ───── */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0 relative">
              {/* Logo icon with layered glow */}
              <div className="relative">
                <div className="absolute inset-0 bg-agri-500/30 rounded-xl blur-md group-hover:blur-lg transition-all duration-500" />
                <div className="relative p-0.4 bg-gradient-to-br from-agri-600 via-emerald-500 to-emerald-400 rounded-xl shadow-lg shadow-agri-600/25 group-hover:shadow-agri-500/40 group-hover:scale-110 transition-all duration-300">
                  {/* <Sprout className="w-5 h-5 text-white" /> */}
                  <img src={agrilogo} alt="Agrilogo" className='w-12 h-12 rounded-lg' />
                </div>
              </div>
              <div className="flex flex-col -space-y-0.5">
                <span className="text-[17px] sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5 font-sans">
                  Agri<span className="bg-gradient-to-r from-agri-400 to-emerald-300 bg-clip-text text-transparent">Qura</span>
                </span>
                <span className="text-[9px] font-semibold text-slate-500 tracking-widest uppercase hidden sm:block">
                  AI-Powered Farm Intelligence • by GVignesh
                </span>
              </div>
            </Link>

            {/* ───── Desktop Navigation ───── */}
            <nav className="hidden xl:flex items-center gap-0.5 bg-slate-900/50 border border-slate-800/60 rounded-2xl px-1.5 py-1 backdrop-blur-sm">
              {isAuthenticated && navLinks.map((link) => {
                if (link.subLinks) {
                  return (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={openServices}
                      onMouseLeave={scheduleCloseServices}
                    >
                      <button className={`relative px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-200 flex items-center gap-1.5 group whitespace-nowrap ${servicesDropdownOpen ? 'bg-agri-500/15 text-agri-300 shadow-sm shadow-agri-500/10' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'}`}>
                        <link.icon className={`w-3.5 h-3.5 transition-colors ${servicesDropdownOpen ? 'text-agri-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                        <span>{link.label}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${servicesDropdownOpen ? 'rotate-180 text-agri-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                      </button>

                      {servicesDropdownOpen && (
                        <div className="absolute top-[calc(100%+4px)] left-1/2 -translate-x-1/2 w-56 bg-slate-950 border border-slate-700/80 shadow-2xl shadow-black/40 rounded-2xl z-50 animate-fade-in-down overflow-hidden p-1.5 space-y-0.5">
                          {link.subLinks.map((subLink) => {
                            const isSubActive = location.pathname === subLink.path;
                            const SubIcon = subLink.icon;
                            return (
                              <Link
                                key={subLink.path}
                                to={subLink.path}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-all duration-200 group ${isSubActive ? 'bg-agri-500/10 text-white' : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'}`}
                              >
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${isSubActive ? 'bg-agri-500/20 text-agri-400' : 'bg-slate-800 text-slate-400 group-hover:text-agri-300'}`}>
                                  <SubIcon className="w-3.5 h-3.5" />
                                </div>
                                <span className="flex-1">{subLink.label}</span>
                                {subLink.badge && (
                                  <span className={`text-[8px] px-1.5 py-[1px] rounded-md font-bold uppercase tracking-wider ${subLink.badge === 'Live' ? 'bg-rose-500/15 text-rose-400' : 'bg-agri-500/15 text-agri-400'}`}>
                                    {subLink.badge}
                                  </span>
                                )}
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-200 flex items-center gap-1.5 group whitespace-nowrap ${isActive
                        ? 'bg-agri-500/15 text-agri-300 shadow-sm shadow-agri-500/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                  >
                    {/* Active indicator dot */}
                    {isActive && (
                      <span className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-4 h-[2px] bg-agri-400 rounded-full" />
                    )}
                    {Icon && (
                      <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-agri-400' : 'text-slate-500 group-hover:text-slate-300'
                        }`} />
                    )}
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className={`text-[8px] px-1.5 py-[1px] rounded-md font-bold uppercase tracking-wider ${link.badge === 'Live'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25 animate-shimmer'
                          : 'bg-agri-500/15 text-agri-400 border border-agri-500/25'
                        }`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ───── Right Section ───── */}
            <div className="flex items-center gap-2 sm:gap-2.5">

              {/* Language Switcher Button — Opens 11 Indian Languages Modal */}
              <button
                onClick={() => setLangModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-agri-500/50 rounded-xl text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm group"
                title="Select Language (11 Languages)"
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-agri-400 group-hover:rotate-45 transition-transform duration-300" />
                <span className="font-bold text-agri-300 text-[11px]">{currentLang.native}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-1.5 relative" ref={dropdownRef}>

                  {/* Notification Bell */}
                  <Link
                    to="/alerts"
                    className="relative p-2 text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all duration-200 group"
                    title="Smart Alerts"
                  >
                    <Bell className="w-[18px] h-[18px] group-hover:rotate-12 transition-transform duration-300" />
                    {/* Notification badge */}
                    <span className="absolute top-1.5 right-1.5 flex items-center justify-center">
                      <span className="absolute w-2 h-2 bg-amber-400 rounded-full animate-ping opacity-75" />
                      <span className="relative w-2 h-2 bg-amber-400 rounded-full" />
                    </span>
                  </Link>

                  {/* ───── Profile Avatar Trigger ───── */}
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    onMouseEnter={openDropdown}
                    onMouseLeave={scheduleCloseDropdown}
                    className={`flex items-center gap-2 p-1 pl-1 pr-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group border ${profileDropdownOpen
                        ? 'bg-transparent border-gray-500/40 shadow-lg shadow-gray-900/20'
                        : 'bg-transparent border-gray-800/70 hover:bg-gray-800/70 hover:border-gray-700'
                      }`}
                  >
                    <div className="relative">
                      {userPhoto ? (
                        <img src={userPhoto} alt="Profile" className={`w-7 h-7 rounded-full object-cover border border-slate-700 transition-all duration-300 ${profileDropdownOpen ? 'ring-2 ring-agri-400/40 ring-offset-1 ring-offset-slate-900' : ''}`} />
                      ) : (
                        <div className={`w-7 h-7 rounded-full bg-gradient-to-br from-agri-500 via-emerald-500 to-emerald-400 flex items-center justify-center text-white text-xs font-bold shadow-sm transition-all duration-300 ${profileDropdownOpen ? 'ring-2 ring-agri-400/40 ring-offset-1 ring-offset-slate-900' : ''
                          }`}>
                          {userInitial}
                        </div>
                      )}
                      {/* Online status dot */}
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
                    </div>
                    <span className="hidden md:block max-w-[90px] truncate text-slate-200 font-medium text-[12px]">
                      {user?.name || 'User'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-all duration-300 ${profileDropdownOpen ? 'rotate-180 text-agri-400' : 'group-hover:text-slate-300'
                      }`} />
                  </button>

                  {/* ───── Profile Dropdown ───── */}
                  {profileDropdownOpen && (
                    <div
                      onMouseEnter={openDropdown}
                      onMouseLeave={scheduleCloseDropdown}
                      className="absolute right-0 top-[calc(100%+6px)] w-72 bg-slate-900/90 backdrop-blur-2xl border border-gray-700/80 shadow-2xl shadow-black/40 rounded-2xl z-50 animate-fade-in-down overflow-hidden"
                    >
                      {/* Dropdown top glow accent */}
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-agri-500/60 to-gray-800/90" />

                      {/* User Info Card */}
                      <div className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/80 border-b border-gray-800/80">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            {userPhoto ? (
                              <img src={userPhoto} alt="Profile" className="w-10 h-10 rounded-full object-cover shadow-lg shadow-agri-900/30 border border-slate-700" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-agri-500 via-emerald-500 to-emerald-400 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-agri-900/30">
                                {userInitial}
                              </div>
                            )}
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-800 rounded-full" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
                              <span className="shrink-0 text-[8px] font-extrabold uppercase px-1.5 py-0.5 bg-agri-500/15 text-agri-400 border border-agri-500/25 rounded-md tracking-wider">
                                {user?.role || 'Farmer'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Links */}
                      <div className="p-1.5 space-y-0.5">
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-3 py-2.5 text-[12px] font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-agri-500/10 border border-agri-500/20 flex items-center justify-center group-hover:bg-agri-500/20 transition-colors">
                            <User className="w-4 h-4 text-agri-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">My Profile</p>
                            <p className="text-[10px] text-slate-500">Account settings & preferences</p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                        </Link>

                        <Link
                          to="/my-farm"
                          className="flex items-center gap-3 px-3 py-2.5 text-[12px] font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                            <Tractor className="w-4 h-4 text-amber-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">Farm Management</p>
                            <p className="text-[10px] text-slate-500">Crops, soil & irrigation data</p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                        </Link>

                        <Link
                          to="/alerts"
                          className="flex items-center gap-3 px-3 py-2.5 text-[12px] font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                            <Bell className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">Smart Alerts</p>
                            <p className="text-[10px] text-slate-500">Pest, weather & market updates</p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                        </Link>
                      </div>

                      {/* Developer & Owner Credit */}
                      <div className="px-3.5 py-2 bg-slate-950/60 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Developer & Owner</span>
                        <a
                          href="https://github.com/GVignesh777"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-agri-400 hover:text-agri-300 transition-colors"
                        >
                          GVignesh
                        </a>
                      </div>

                      {/* Sign Out */}
                      <div className="p-1.5 pt-0 border-t border-slate-800/60 mt-0.5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 mt-1.5 text-[12px] font-semibold text-red-400/90 bg-slate-900/90 hover:text-red-300 hover:bg-red-500/[0.07] rounded-xl transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center group-hover:bg-red-500/15 transition-colors">
                            <LogOut className="w-4 h-4 text-red-400" />
                          </div>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-agri-600 to-emerald-600 hover:from-agri-500 hover:to-emerald-500 text-white rounded-xl shadow-lg shadow-agri-900/30 hover:shadow-agri-500/25 transition-all duration-300 active:scale-95"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger */}
              {isAuthenticated && (
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`xl:hidden p-2 rounded-xl border transition-all duration-200 ${mobileMenuOpen
                      ? 'bg-agri-500/15 text-agri-400 border-agri-500/30'
                      : 'text-slate-400 hover:text-white border-slate-800 hover:bg-white/[0.05]'
                    }`}
                  aria-label="Toggle Menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}

            </div>
          </div>
        </div>
      </header>

      {/* ───── Mobile Full-Screen Overlay Drawer ───── */}
      {isAuthenticated && mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm xl:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer panel */}
          <div className="fixed top-16 right-0 bottom-0 z-50 w-full sm:w-80 bg-slate-950/98 backdrop-blur-2xl border-l border-slate-800/60 xl:hidden overflow-y-auto animate-slide-in-right">

            {/* User Card at top */}
            <div className="p-4 m-3 mb-0 bg-gradient-to-br from-slate-800/50 to-slate-900/80 rounded-2xl border border-slate-800/60">
              <div className="flex items-center gap-3">
                {userPhoto ? (
                  <img src={userPhoto} alt="Profile" className="w-11 h-11 rounded-full object-cover shadow-lg shadow-agri-900/30 border border-slate-700" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-agri-500 via-emerald-500 to-emerald-400 flex items-center justify-center text-white text-base font-bold shadow-lg shadow-agri-900/30">
                    {userInitial}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                </div>
                <span className="text-[8px] font-extrabold uppercase px-2 py-1 bg-agri-500/15 text-agri-400 border border-agri-500/25 rounded-lg tracking-wider">
                  {user?.role || 'Farmer'}
                </span>
              </div>
            </div>

            {/* Language Switcher (Mobile) */}
            <div className="px-4 pt-4 pb-2 sm:hidden">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Language</p>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLangModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-3 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs font-bold text-white hover:border-agri-500/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-agri-400" />
                  <span>{currentLang.name} ({currentLang.native})</span>
                </div>
                <span className="text-[10px] text-agri-400 uppercase tracking-wider font-extrabold">Change</span>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="px-3 py-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-2">Navigation</p>
              <div className="space-y-1">
                {navLinks.map((link, idx) => {
                  if (link.subLinks) {
                    return (
                      <div key={link.label} className="space-y-1 animate-fade-in-down" style={{ animationDelay: `${idx * 40}ms` }}>
                        <button
                          onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[13px] font-medium transition-all duration-200 text-slate-300 hover:bg-white/[0.04] hover:text-white border border-transparent"
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-800/60 border border-slate-800">
                            <link.icon className="w-4 h-4 text-slate-400" />
                          </div>
                          <span className="flex-1 text-left">{link.label}</span>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {mobileServicesOpen && (
                          <div className="pl-12 pr-2 space-y-1 animate-fade-in-down">
                            {link.subLinks.map(subLink => {
                              const isSubActive = location.pathname === subLink.path;
                              const SubIcon = subLink.icon;
                              return (
                                <Link
                                  key={subLink.path}
                                  to={subLink.path}
                                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] font-medium transition-all duration-200 ${isSubActive ? 'bg-agri-500/15 text-agri-300' : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'}`}
                                >
                                  <SubIcon className={`w-3.5 h-3.5 ${isSubActive ? 'text-agri-400' : 'text-slate-500'}`} />
                                  <span className="flex-1">{subLink.label}</span>
                                  {subLink.badge && (
                                    <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${subLink.badge === 'Live' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25' : 'bg-agri-500/15 text-agri-400 border border-agri-500/25'}`}>
                                      {subLink.badge}
                                    </span>
                                  )}
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  }

                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      style={{ animationDelay: `${idx * 40}ms` }}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[13px] font-medium transition-all duration-200 animate-fade-in-down ${isActive
                          ? 'bg-agri-500/15 text-agri-300 border border-agri-500/25 font-bold shadow-sm shadow-agri-900/20'
                          : 'text-slate-300 hover:bg-white/[0.04] hover:text-white border border-transparent'
                        }`}
                    >
                      {Icon && (
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isActive
                            ? 'bg-agri-500/20 border border-agri-500/30'
                            : 'bg-slate-800/60 border border-slate-800'
                          }`}>
                          <Icon className={`w-4 h-4 ${isActive ? 'text-agri-400' : 'text-slate-400'}`} />
                        </div>
                      )}
                      <span className="flex-1">{link.label}</span>
                      {link.badge && (
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${link.badge === 'Live'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                            : 'bg-agri-500/15 text-agri-400 border border-agri-500/25'
                          }`}>
                          {link.badge}
                        </span>
                      )}
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-agri-400" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pt-8 space-y-3">
              <div className="text-center">
                <span className="text-[10px] text-slate-500 block">AgriQura AI System</span>
                <p className="text-xs text-slate-300 font-medium">
                  Developed & Owned by{' '}
                  <a
                    href="https://github.com/GVignesh777"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-agri-400 font-bold hover:underline"
                  >
                    GVignesh
                  </a>
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-red-500/10 hover:bg-red-500/15 border border-red-500/25 hover:border-red-500/40 text-red-400 hover:text-red-300 text-[13px] font-semibold rounded-xl transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>
        </>
      )}
      {/* Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={langModalOpen}
        onClose={() => setLangModalOpen(false)}
      />
    </>
  );
}
