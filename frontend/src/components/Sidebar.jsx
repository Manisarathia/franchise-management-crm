
import { NavLink, useNavigate } from 'react-router-dom';

import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  Settings,
  FileSignature,
  FileText,
  FolderOpen,
  BadgeCheck,
  RefreshCw,
  HelpCircle,
  UserCheck,
  ChevronRight,
  LogOut,
  X,
} from 'lucide-react';

import Logo from './Logo';

const groups = [
  {
    label: 'OVERVIEW',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'SYSTEM ADMINISTRATION',
    items: [
      { to: '/users', label: 'User Management', icon: Users },
      { to: '/roles', label: 'Roles & Permissions', icon: ShieldCheck },
      { to: '/departments', label: 'Department Management', icon: Building2 },
      { to: '/settings', label: 'System Settings', icon: Settings },
    ],
  },
  {
    label: 'ENQUIRIES & APPLICATIONS',
    items: [
      { to: '/enquiries', label: 'Franchise Enquiries', icon: HelpCircle },
      { to: '/leads', label: 'Lead Management', icon: UserCheck },
    ],
  },
  {
    label: 'AGREEMENT & LEGAL',
    items: [
      { to: '/agreements', label: 'Agreement Management', icon: FileSignature },
      { to: '/contracts', label: 'Contract Management', icon: FileText },
      { to: '/documents', label: 'Document Management', icon: FolderOpen },
      { to: '/licenses', label: 'License Management', icon: BadgeCheck },
      { to: '/renewals', label: 'Renewal Management', icon: RefreshCw },
    ],
  },
];

export default function Sidebar({ onLogout, mobileOpen = false, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('franchise-crm-auth');
      localStorage.removeItem('franchise-crm-current-user');
      navigate('/login');
    }
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col
          border-r border-white/10
          bg-gradient-to-b from-[#0D191F] via-[#0B151C] to-[#080F17]
          shadow-2xl shadow-black/30
          transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >

        {/* LOGO */}
        <div className="flex h-[88px] items-center justify-between border-b border-white/10 px-6">
          <Logo />

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-8 overflow-y-auto px-4 py-7">

          {groups.map((group) => (
            <div key={group.label}>

              <p className="mb-3 px-3 text-[10px] font-extrabold tracking-[0.18em] text-slate-500">
                {group.label}
              </p>

              <div className="space-y-1.5">

                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `group relative flex items-center gap-3 overflow-hidden rounded-xl px-3.5 py-3.5 text-[12px] font-semibold transition-all duration-300 ${
                          isActive
                            ? 'border border-amber-400/20 bg-gradient-to-r from-amber-400/20 via-emerald-400/10 to-transparent text-amber-300 shadow-[0_4px_20px_rgba(234,179,8,0.07)]'
                            : 'border border-transparent text-slate-400 hover:border-white/5 hover:bg-white/[0.06] hover:text-white'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {/* ACTIVE INDICATOR */}
                          {isActive && (
                            <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-amber-400" />
                          )}

                          <Icon
                            size={17}
                            strokeWidth={isActive ? 2.3 : 1.8}
                            className={
                              isActive
                                ? 'text-amber-300'
                                : 'text-slate-500 transition group-hover:text-emerald-300'
                            }
                          />

                          <span className="flex-1">{item.label}</span>

                          <ChevronRight
                            size={14}
                            className={`transition-all ${
                              isActive
                                ? 'translate-x-0 text-amber-300 opacity-100'
                                : '-translate-x-1 text-slate-600 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                            }`}
                          />
                        </>
                      )}
                    </NavLink>
                  );
                })}

              </div>
            </div>
          ))}

        </nav>

        {/* BOTTOM PROFILE */}
        <div className="border-t border-white/10 p-4">

          <div className="mb-3 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.035] p-3">

            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-emerald-400 text-sm font-black text-[#101713]">
              A
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">
                Administrator
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                System Admin
              </p>
            </div>

            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />

          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-xs font-semibold text-slate-400 transition hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={16} />
            Sign Out
          </button>

          <p className="mt-4 text-center text-[9px] tracking-wider text-slate-600">
            FRANCHISE CRM · VERSION 1.0
          </p>

        </div>

      </aside>
    </>
  );
}
