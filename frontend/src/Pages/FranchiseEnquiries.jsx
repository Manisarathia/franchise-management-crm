import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Inbox,
  Sparkles,
  Search,
  Plus,
  Download,
  Filter,
  Eye,
  Edit3,
  Trash2,
  UserPlus,
  ArrowRight,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  X,
  AlertCircle,
  Copy,
  Check,
  ChevronDown
} from 'lucide-react';
import {
  loadEnquiries,
  saveEnquiries,
  convertEnquiryToLead,
  exportToCsv
} from '../utils/task2Storage';

const BUDGET_OPTIONS = [
  { value: '₹10 - ₹15 Lakhs', label: '₹10 - ₹15 Lakhs (Kiosk)' },
  { value: '₹15 - ₹25 Lakhs', label: '₹15 - ₹25 Lakhs (Express Unit)' },
  { value: '₹25 - ₹35 Lakhs', label: '₹25 - ₹35 Lakhs (Standard Store)' },
  { value: '₹40 - ₹50 Lakhs', label: '₹40 - ₹50 Lakhs (Flagship Store)' },
  { value: '₹50+ Lakhs', label: '₹50+ Lakhs (Multi-Unit / Master)' }
];

const SOURCE_OPTIONS = [
  'Official Website',
  'Franchise India Expo',
  'LinkedIn Campaign',
  'Direct Referral',
  'Instagram Ad'
];

const STATUS_OPTIONS = [
  'New',
  'Contacted',
  'Under Review',
  'Converted',
  'Dropped'
];

function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select option',
  icon: Icon,
  className = '',
  align = 'full',
  buttonClassName = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizedOptions = useMemo(() => {
    return options.map((opt) => (typeof opt === 'string' ? { value: opt, label: opt } : opt));
  }, [options]);

  const selectedOption = normalizedOptions.find(
    (opt) =>
      opt.value === value ||
      opt.label === value ||
      (typeof value === 'string' && opt.value.length > 3 && value.startsWith(opt.value))
  );

  const menuPositionClass =
    align === 'right'
      ? 'absolute right-0 top-full mt-1.5 w-56'
      : align === 'left'
      ? 'absolute left-0 top-full mt-1.5 w-56'
      : 'absolute left-0 right-0 top-full mt-1.5';

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between rounded-xl border text-xs font-medium transition-all duration-200 outline-none cursor-pointer ${
          buttonClassName || 'px-3.5 py-2.5 bg-black/40'
        } ${
          isOpen
            ? 'border-gold-500 bg-gold-500/10 text-gold-300 shadow-sm shadow-gold-500/10 ring-1 ring-gold-500/30'
            : 'border-white/10 text-white hover:border-gold-500/50 hover:bg-gold-500/5 hover:text-gold-300'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && (
            <Icon
              size={13}
              className={`shrink-0 transition-colors ${
                isOpen || (value && value !== 'ALL') ? 'text-gold-400' : 'text-slate-400'
              }`}
            />
          )}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? 'rotate-180 text-gold-400' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`${menuPositionClass} max-h-56 overflow-y-auto scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(214,165,46,0.3)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gold-500/40 rounded-2xl border border-gold-500/30 bg-ink-900/98 p-1.5 shadow-2xl backdrop-blur-2xl z-50`}
        >
          <div className="space-y-0.5">
            {normalizedOptions.map((opt) => {
              const isSelected = selectedOption?.value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`group w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-all duration-150 text-left cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-gold-500 via-gold-400 to-gold-300 text-black font-bold shadow-md shadow-gold-500/10'
                      : 'text-slate-300 hover:bg-gradient-to-r hover:from-gold-500 hover:via-gold-400 hover:to-gold-300 hover:text-black hover:font-bold'
                  }`}
                >
                  <span className="font-medium group-hover:font-bold transition-all truncate">{opt.label}</span>
                  {isSelected && <Check size={14} className="stroke-[2.5] text-black shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FranchiseEnquiries() {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState(loadEnquiries);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const sourceDropdownRef = useRef(null);

  const sourcesList = [
    { value: 'ALL', label: 'All Sources' },
    { value: 'Official Website', label: 'Official Website' },
    { value: 'Franchise India Expo', label: 'Franchise India Expo' },
    { value: 'LinkedIn Campaign', label: 'LinkedIn Campaign' },
    { value: 'Direct Referral', label: 'Direct Referral' },
    { value: 'Instagram Ad', label: 'Instagram Ad' }
  ];

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Notification Toast
  const [toast, setToast] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Sync with local storage
  useEffect(() => {
    saveEnquiries(enquiries);
  }, [enquiries]);

  // Auto hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Click outside to close source dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sourceDropdownRef.current && !sourceDropdownRef.current.contains(e.target)) {
        setIsSourceOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Form State
  const initialForm = {
    name: '',
    email: '',
    phone: '',
    city: '',
    state: 'Tamil Nadu',
    territory: '',
    investmentRange: '₹25 - ₹35 Lakhs',
    experience: '',
    source: 'Official Website',
    status: 'New',
    notes: ''
  };
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});

  // Filtered enquiries
  const filtered = useMemo(() => {
    return enquiries.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.city.toLowerCase().includes(search.toLowerCase()) ||
        item.phone.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || item.status.toUpperCase() === statusFilter;
      const matchSource = sourceFilter === 'ALL' || item.source === sourceFilter;

      return matchSearch && matchStatus && matchSource;
    });
  }, [enquiries, search, statusFilter, sourceFilter]);

  // KPI Metrics
  const stats = useMemo(() => {
    const total = enquiries.length;
    const newCount = enquiries.filter((e) => e.status === 'New').length;
    const contactedCount = enquiries.filter((e) => e.status === 'Contacted' || e.status === 'Under Review').length;
    const convertedCount = enquiries.filter((e) => e.status === 'Converted').length;
    return { total, newCount, contactedCount, convertedCount };
  }, [enquiries]);

  // Form Validation
  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Applicant name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Valid email is required';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      errs.phone = 'Minimum 10 digits required';
    }
    if (!formData.city.trim()) errs.city = 'City / Location is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Create Enquiry
  const handleCreate = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newId = `ENQ-2026-${String(enquiries.length + 1).padStart(3, '0')}`;
    const newEntry = {
      ...formData,
      id: newId,
      receivedDate: new Date().toISOString().split('T')[0]
    };

    setEnquiries([newEntry, ...enquiries]);
    setIsAddOpen(false);
    setFormData(initialForm);
    setToast({ type: 'success', message: `Enquiry ${newId} created successfully!` });
  };

  // Open Edit
  const openEdit = (item) => {
    setSelectedEnquiry(item);
    setFormData({ ...item });
    setFormErrors({});
    setIsEditOpen(true);
  };

  // Save Edit
  const handleUpdate = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setEnquiries(enquiries.map((item) => (item.id === selectedEnquiry.id ? { ...formData, id: item.id, receivedDate: item.receivedDate } : item)));
    setIsEditOpen(false);
    setToast({ type: 'success', message: `Enquiry ${selectedEnquiry.id} updated successfully!` });
  };

  // Open Details
  const openDetail = (item) => {
    setSelectedEnquiry(item);
    setIsDetailOpen(true);
  };

  // Open Delete
  const openDelete = (item) => {
    setSelectedEnquiry(item);
    setIsDeleteOpen(true);
  };

  // Confirm Delete
  const handleDelete = () => {
    setEnquiries(enquiries.filter((item) => item.id !== selectedEnquiry.id));
    setIsDeleteOpen(false);
    setToast({ type: 'info', message: `Enquiry ${selectedEnquiry.id} was removed.` });
  };

  // Convert to Lead
  const handleConvertToLead = (enquiry) => {
    const { newLead } = convertEnquiryToLead(enquiry);
    setEnquiries(loadEnquiries());
    setIsDetailOpen(false);
    setToast({
      type: 'success',
      message: `Enquiry converted! New Lead created with ID: ${newLead.id}`
    });
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'Contacted':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Under Review':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'Converted':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Dropped':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 scroll-smooth">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-gold-500/30 bg-ink-900/95 p-4 text-xs shadow-2xl backdrop-blur-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold-500/20 text-gold-300">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="font-semibold text-white">{toast.message}</p>
            <p className="text-[10px] text-slate-400">Franchise CRM System</p>
          </div>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Pipeline / Enquiries</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">Franchise Enquiries</h1>
          <p className="mt-1 text-xs text-slate-400">Capture, qualify, and triage prospective franchise candidate inquiries.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportToCsv(enquiries, 'franchise_enquiries.csv')}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs font-medium text-slate-300 hover:border-gold-500/40 hover:text-gold-300 hover:bg-white/[0.06] hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={() => {
              setFormData(initialForm);
              setFormErrors({});
              setIsAddOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-300 px-4 py-2.5 text-xs font-bold text-black shadow-lg shadow-gold-500/10 hover:brightness-110 hover:shadow-xl hover:shadow-gold-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Plus size={15} /> Capture Enquiry
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Card 1: Total Enquiries */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-850 p-5 shadow-sm transition-all duration-300 hover:border-gold-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold-500/10 cursor-pointer">
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gold-500/0 blur-2xl transition-all duration-500 group-hover:bg-gold-500/15" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">Total Enquiries</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-gold-500/20 bg-gold-500/10 text-gold-400 transition-all duration-300 group-hover:scale-110 group-hover:border-gold-500/40 group-hover:bg-gold-500/20 group-hover:rotate-3">
              <Inbox size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-white group-hover:text-gold-200 transition-colors">{stats.total}</p>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-300 transition-all group-hover:border-gold-500/30 group-hover:bg-gold-500/10 group-hover:text-gold-300">
              All Records
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500 truncate group-hover:text-slate-400 transition-colors">Total registered prospects</p>
        </div>

        {/* Card 2: New Inbound */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-850 p-5 shadow-sm transition-all duration-300 hover:border-sky-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/10 cursor-pointer">
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-sky-500/0 blur-2xl transition-all duration-500 group-hover:bg-sky-500/15" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">New Inbound</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-400 transition-all duration-300 group-hover:scale-110 group-hover:border-sky-500/40 group-hover:bg-sky-500/20 group-hover:rotate-3">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-white group-hover:text-sky-200 transition-colors">{stats.newCount}</p>
            <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-300 transition-all group-hover:border-sky-500/40 group-hover:bg-sky-500/20">
              Pending Review
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500 truncate group-hover:text-slate-400 transition-colors">Needs first contact screening</p>
        </div>

        {/* Card 3: Under Review */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-850 p-5 shadow-sm transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer">
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-amber-500/0 blur-2xl transition-all duration-500 group-hover:bg-amber-500/15" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">Under Review / Contacted</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400 transition-all duration-300 group-hover:scale-110 group-hover:border-amber-500/40 group-hover:bg-amber-500/20 group-hover:rotate-3">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-white group-hover:text-amber-200 transition-colors">{stats.contactedCount}</p>
            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300 transition-all group-hover:border-amber-500/40 group-hover:bg-amber-500/20">
              In Discussion
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500 truncate group-hover:text-slate-400 transition-colors">Active discovery & screening</p>
        </div>

        {/* Card 4: Converted to Leads */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-850 p-5 shadow-sm transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer">
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-emerald-500/0 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/15" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">Converted to Leads</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 transition-all duration-300 group-hover:scale-110 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/20 group-hover:rotate-3">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-white group-hover:text-emerald-200 transition-colors">{stats.convertedCount}</p>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 transition-all group-hover:border-emerald-500/40 group-hover:bg-emerald-500/20">
              Qualified
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500 truncate group-hover:text-slate-400 transition-colors">Promoted into sales pipeline</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-ink-850 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-xs text-white">
          <Search size={15} className="text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by prospect name, ID, city, email or phone..."
            className="w-full bg-transparent text-xs text-white placeholder:text-slate-600 outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-slate-500 hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center rounded-xl border border-white/10 bg-black/20 p-1">
            {['ALL', 'NEW', 'CONTACTED', 'UNDER REVIEW', 'CONVERTED', 'DROPPED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${statusFilter === st
                  ? 'bg-gold-500/20 text-gold-300 shadow'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Custom Styled Source Dropdown */}
          <div className="relative" ref={sourceDropdownRef}>
            <button
              type="button"
              onClick={() => setIsSourceOpen((prev) => !prev)}
              className={`flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 outline-none cursor-pointer ${
                isSourceOpen || sourceFilter !== 'ALL'
                  ? 'border-gold-500 bg-gold-500/10 text-gold-300 shadow-sm shadow-gold-500/10'
                  : 'border-white/10 bg-black/30 text-slate-300 hover:border-gold-500/50 hover:bg-gold-500/5 hover:text-gold-300'
              }`}
            >
              <Filter
                size={13}
                className={sourceFilter !== 'ALL' || isSourceOpen ? 'text-gold-400' : 'text-slate-400'}
              />
              <span className="text-[11px] font-semibold">
                {sourcesList.find((s) => s.value === sourceFilter)?.label || 'All Sources'}
              </span>
              <ChevronDown
                size={13}
                className={`text-slate-400 transition-transform duration-200 ${
                  isSourceOpen ? 'rotate-180 text-gold-400' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isSourceOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-gold-500/30 bg-ink-900/98 p-1.5 shadow-2xl backdrop-blur-2xl z-50">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-white/5 mb-1">
                  Filter by Source
                </div>
                <div className="space-y-0.5">
                  {sourcesList.map((opt) => {
                    const isSelected = sourceFilter === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setSourceFilter(opt.value);
                          setIsSourceOpen(false);
                        }}
                        className={`group w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-all duration-150 text-left cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-gold-500 via-gold-400 to-gold-300 text-black font-bold shadow-md shadow-gold-500/10'
                            : 'text-slate-300 hover:bg-gradient-to-r hover:from-gold-500 hover:via-gold-400 hover:to-gold-300 hover:text-black hover:font-bold'
                        }`}
                      >
                        <span className="font-medium group-hover:font-bold transition-all">{opt.label}</span>
                        {isSelected && <Check size={14} className="stroke-[2.5] text-black shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-850 shadow-xl">
        <div className="overflow-x-auto scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(214,165,46,0.3)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gold-500/40">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                <th className="px-5 py-4 whitespace-nowrap">Enquiry ID</th>
                <th className="px-5 py-4 whitespace-nowrap">Prospect / Contact</th>
                <th className="px-5 py-4 whitespace-nowrap">Preferred Location</th>
                <th className="px-5 py-4 whitespace-nowrap">Budget Range</th>
                <th className="px-5 py-4 whitespace-nowrap">Lead Source</th>
                <th className="px-5 py-4 whitespace-nowrap">Received Date</th>
                <th className="px-5 py-4 whitespace-nowrap">Status</th>
                <th className="px-5 py-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr key={item.id} className="group/row hover:bg-white/[0.04] transition-all duration-200">
                    {/* ID */}
                    <td className="px-5 py-4 font-mono font-semibold text-gold-300 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="group-hover/row:text-gold-400 group-hover/row:translate-x-0.5 transition-all">{item.id}</span>
                        <button
                          onClick={() => copyToClipboard(item.id, item.id)}
                          title="Copy ID"
                          className="opacity-60 group-hover/row:opacity-100 text-slate-500 hover:text-gold-300 hover:scale-125 transition-all cursor-pointer"
                        >
                          {copiedId === item.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </td>

                    {/* Prospect Info */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-white whitespace-nowrap group-hover/row:text-gold-200 transition-colors">{item.name}</p>
                        <div className="mt-1 flex flex-col gap-0.5 text-[11px] text-slate-400 whitespace-nowrap">
                          <span className="flex items-center gap-1">
                            <Mail size={11} className="text-slate-500 group-hover/row:text-slate-400 transition-colors" /> {item.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={11} className="text-slate-500 group-hover/row:text-slate-400 transition-colors" /> {item.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-white">
                        <MapPin size={13} className="text-gold-400 shrink-0 group-hover/row:scale-110 transition-transform" />
                        <span>{item.city}, {item.state}</span>
                      </div>
                      {item.territory && (
                        <p className="mt-0.5 text-[11px] text-slate-500 pl-4">{item.territory}</p>
                      )}
                    </td>

                    {/* Investment Range */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="inline-block rounded-md bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-200 border border-white/5 group-hover/row:border-gold-500/20 transition-colors">
                        {item.investmentRange}
                      </span>
                    </td>

                    {/* Source */}
                    <td className="px-5 py-4 text-[11px] text-slate-400 whitespace-nowrap">
                      {item.source}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-[11px] text-slate-500 whitespace-nowrap">
                      {item.receivedDate}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold transition-transform duration-200 hover:scale-105 cursor-default ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick Convert */}
                        {item.status !== 'Converted' && (
                          <button
                            onClick={() => handleConvertToLead(item)}
                            title="Convert to Qualified Lead"
                            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-gold-500/30 bg-gold-500/10 px-2.5 py-1 text-[11px] font-medium text-gold-300 shadow-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-gold-500 hover:via-gold-400 hover:to-gold-300 hover:text-black hover:font-bold hover:shadow-md hover:shadow-gold-500/20 hover:scale-105 active:scale-95 cursor-pointer"
                          >
                            <UserPlus size={13} />
                            <span>To Lead</span>
                          </button>
                        )}

                        <button
                          onClick={() => openDetail(item)}
                          title="View Details"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white hover:scale-115 active:scale-95 transition-all duration-150 cursor-pointer"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={() => openEdit(item)}
                          title="Edit Enquiry"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-gold-500/15 hover:text-gold-300 hover:scale-115 active:scale-95 transition-all duration-150 cursor-pointer"
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          onClick={() => openDelete(item)}
                          title="Delete"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/15 hover:text-rose-400 hover:scale-115 active:scale-95 transition-all duration-150 cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                    <p className="text-sm font-medium">No enquiries matching your criteria</p>
                    <p className="mt-1 text-xs">Try adjusting your filters or search keywords.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/10 px-5 py-3 text-[11px] text-slate-500">
          <span>Showing {filtered.length} of {enquiries.length} enquiries</span>
          <span className="mt-1 sm:mt-0 text-slate-400">
            Franchise Network Operations · Real-time Sync
          </span>
        </div>
      </div>

      {/* MODAL: ADD NEW ENQUIRY */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity duration-200">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-2xl max-h-[92vh] overflow-y-auto scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(214,165,46,0.3)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gold-500/40">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Capture New Franchise Enquiry</h3>
                <p className="text-xs text-slate-400">Register inbound interest from a prospective partner.</p>
              </div>
              <button onClick={() => setIsAddOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Applicant Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Chandran"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-gold-500"
                  />
                  {formErrors.name && <p className="mt-1 text-[10px] text-rose-400">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. ramesh@example.com"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-gold-500"
                  />
                  {formErrors.email && <p className="mt-1 text-[10px] text-rose-400">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-gold-500"
                  />
                  {formErrors.phone && <p className="mt-1 text-[10px] text-rose-400">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Preferred City / Town <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Coimbatore"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-gold-500"
                  />
                  {formErrors.city && <p className="mt-1 text-[10px] text-rose-400">{formErrors.city}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Target Territory / Micro-Market</label>
                  <input
                    type="text"
                    value={formData.territory}
                    onChange={(e) => setFormData({ ...formData, territory: e.target.value })}
                    placeholder="e.g. RS Puram or Airport Road"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Investment Budget Range</label>
                  <CustomSelect
                    value={formData.investmentRange}
                    onChange={(val) => setFormData({ ...formData, investmentRange: val })}
                    options={BUDGET_OPTIONS}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Enquiry Source</label>
                  <CustomSelect
                    value={formData.source}
                    onChange={(val) => setFormData({ ...formData, source: val })}
                    options={SOURCE_OPTIONS}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300">Prior Business / Retail Experience</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="e.g. 5 years running electronics distribution"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300">Internal Evaluation Notes</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add initial notes or specific requests..."
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-gold-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-gold-500 to-gold-300 px-5 py-2 text-xs font-bold text-black hover:brightness-110"
                >
                  Register Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ENQUIRY */}
      {isEditOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity duration-200">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-2xl max-h-[92vh] overflow-y-auto scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(214,165,46,0.3)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gold-500/40">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Edit Enquiry #{selectedEnquiry.id}</h3>
                <p className="text-xs text-slate-400">Update status, contact details, or notes.</p>
              </div>
              <button onClick={() => setIsEditOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Applicant Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white outline-none focus:border-gold-500"
                  />
                  {formErrors.name && <p className="mt-1 text-[10px] text-rose-400">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Enquiry Status</label>
                  <CustomSelect
                    value={formData.status}
                    onChange={(val) => setFormData({ ...formData, status: val })}
                    options={STATUS_OPTIONS}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Budget Range</label>
                  <CustomSelect
                    value={formData.investmentRange}
                    onChange={(val) => setFormData({ ...formData, investmentRange: val })}
                    options={BUDGET_OPTIONS}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300">Notes & Assessment</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white outline-none focus:border-gold-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-gold-500 to-gold-300 px-5 py-2 text-xs font-bold text-black hover:brightness-110"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW DETAILS */}
      {isDetailOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity duration-200">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-2xl max-h-[92vh] overflow-y-auto scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(214,165,46,0.3)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gold-500/40">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/20 text-gold-300 font-bold">
                  {selectedEnquiry.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedEnquiry.name}</h3>
                  <p className="text-xs font-mono text-gold-400">{selectedEnquiry.id}</p>
                </div>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-white/5 bg-black/30 p-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Status</p>
                  <p className="mt-1">
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getStatusBadge(selectedEnquiry.status)}`}>
                      {selectedEnquiry.status}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Received Date</p>
                  <p className="mt-1 font-medium text-white">{selectedEnquiry.receivedDate}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Email</p>
                  <p className="mt-1 text-slate-300 flex items-center gap-1">
                    <Mail size={12} className="text-gold-400" /> {selectedEnquiry.email}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Phone</p>
                  <p className="mt-1 text-slate-300 flex items-center gap-1">
                    <Phone size={12} className="text-gold-400" /> {selectedEnquiry.phone}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Location & Territory</p>
                  <p className="mt-1 font-medium text-white">
                    {selectedEnquiry.city}, {selectedEnquiry.state}
                  </p>
                  {selectedEnquiry.territory && <p className="text-[11px] text-slate-400">{selectedEnquiry.territory}</p>}
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Investment Budget</p>
                  <p className="mt-1 font-semibold text-gold-300">{selectedEnquiry.investmentRange}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Candidate Background & Experience</p>
                <p className="mt-1 rounded-xl border border-white/5 bg-black/20 p-3 text-slate-300">
                  {selectedEnquiry.experience || 'Not specified'}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Internal Notes</p>
                <p className="mt-1 rounded-xl border border-white/5 bg-black/20 p-3 text-slate-300">
                  {selectedEnquiry.notes || 'No notes added.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-white/10 mt-5">
              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  openEdit(selectedEnquiry);
                }}
                className="text-xs text-slate-400 hover:text-white"
              >
                Edit Enquiry
              </button>

              <div className="flex items-center gap-2">
                {selectedEnquiry.status !== 'Converted' ? (
                  <button
                    onClick={() => handleConvertToLead(selectedEnquiry)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-300 px-4 py-2 text-xs font-bold text-black hover:brightness-110"
                  >
                    <UserPlus size={14} /> Convert to Qualified Lead
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/leads')}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20"
                  >
                    <CheckCircle2 size={14} /> Converted (View in Leads) <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {isDeleteOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-ink-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
                <AlertCircle size={22} />
              </div>
              <h3 className="text-base font-bold text-white">Delete Franchise Enquiry</h3>
            </div>
            <p className="mt-3 text-xs text-slate-300">
              Are you sure you want to remove enquiry <strong className="text-white">{selectedEnquiry.id} ({selectedEnquiry.name})</strong>? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-bold text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

