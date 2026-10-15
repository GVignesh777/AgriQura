import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  Sparkles,
  Building2,
  CheckCircle2,
  ExternalLink,
  Search,
} from 'lucide-react';

export default function NearbyServices({
  services = [],
  loading = false,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null);

  const categories = [
    { key: 'all', label: 'All Centers' },
    { key: 'krishi vigyan kendra', label: 'Krishi Vigyan Kendras (KVK)' },
    { key: 'government agriculture center', label: 'Govt Agriculture Offices' },
    { key: 'seed/fertilizer center', label: 'Seed & Fertilizer Outlets' },
    { key: 'agricultural office', label: 'Soil Testing Labs' },
  ];

  const filteredServices = services.filter((srv) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      srv.category.toLowerCase() === selectedCategory;

    const matchesSearch =
      !searchQuery.trim() ||
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.servicesOffered?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleGetDirections = (srv) => {
    if (srv.coordinates) {
      const url = `https://www.google.com/maps/search/?api=1&query=${srv.coordinates.lat},${srv.coordinates.lng}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        srv.name + ' ' + srv.address
      )}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-agri-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Local Agricultural Directory</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Nearby Agricultural Centers & KVKs
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md">
          Locate nearest Krishi Vigyan Kendras, official seed distribution centers, and government testing laboratories.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? 'bg-agri-600 text-white shadow-md'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter centers or services..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-agri-500"
          />
        </div>
      </div>

      {/* Services List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all duration-200 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Title & Distance */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 uppercase tracking-wider">
                    {srv.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5 leading-snug">
                    {srv.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-agri-400 bg-agri-500/10 border border-agri-500/20 px-2.5 py-1 rounded-xl shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{srv.distanceKm} km</span>
                </div>
              </div>

              {/* Address */}
              <p className="text-xs text-slate-400 flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{srv.address}</span>
              </p>

              {/* Phone & Timings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 pt-1">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{srv.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{srv.timings}</span>
                </div>
              </div>

              {/* Services Offered Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {srv.servicesOffered?.map((item) => (
                  <span
                    key={item}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 truncate">
                Contact: {srv.officerInCharge}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleGetDirections(srv)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-agri-600/20 hover:bg-agri-600/30 border border-agri-500/30 text-agri-300 hover:text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-agri-400" />
                  <span>Directions</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Note about Sample Data */}
      <p className="text-[11px] text-slate-500 text-center mt-6">
        * Displayed agricultural center coordinates and contact details are representative sample data for demonstration.
      </p>
    </section>
  );
}
