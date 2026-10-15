import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Headset,
  Sprout,
  Handshake,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import contactConfig from '../../config/contactConfig';

export default function ContactMethods({ onSelectPartnership }) {
  const methods = [
    {
      id: 'email',
      icon: Mail,
      iconColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
      title: 'Email Support',
      desc: 'For general questions, feedback, or advisory inquiries.',
      actionText: contactConfig.supportEmail,
      actionType: 'mailto',
      href: `mailto:${contactConfig.supportEmail}`
    },
    {
      id: 'help-desk',
      icon: Headset,
      iconColor: 'text-agri-400 bg-agri-500/15 border-agri-500/30',
      title: 'Digital Help Desk',
      desc: 'Instant answers to common queries, troubleshooting, and direct support reports.',
      actionText: 'Visit Help Desk',
      actionType: 'link',
      href: '/help-desk'
    },
    {
      id: 'farmer-support',
      icon: Sprout,
      iconColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
      title: 'Farmer Advisory Hub',
      desc: 'Get personalized AI crop guidance, disease detection, and mandi rate forecasts.',
      actionText: 'Get Farmer Support',
      actionType: 'link',
      href: '/assistant'
    },
    {
      id: 'partnerships',
      icon: Handshake,
      iconColor: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
      title: 'Partnerships & KVKs',
      desc: 'For agricultural universities, Krishi Vigyan Kendras, FPOs, and institutions.',
      actionText: 'Contact Partnerships',
      actionType: 'callback',
      onClick: onSelectPartnership
    }
  ];

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight">Direct Contact Channels</h2>
        <p className="text-xs text-slate-400">Choose the fastest way to connect with our team.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {methods.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="glass-card p-5 flex flex-col justify-between border-slate-800 hover:border-slate-700 transition-all space-y-4 rounded-2xl group shadow-lg"
            >
              <div className="space-y-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${item.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white group-hover:text-agri-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                {item.actionType === 'mailto' && (
                  <a
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    <span>Send Email</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                {item.actionType === 'link' && (
                  <Link
                    to={item.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-agri-400 hover:text-agri-300 transition-colors"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}

                {item.actionType === 'callback' && (
                  <button
                    onClick={item.onClick}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors text-left"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
