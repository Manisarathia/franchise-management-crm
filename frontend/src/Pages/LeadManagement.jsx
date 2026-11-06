import { useState, useEffect, useMemo, useRef } from 'react';
import {
  UserCheck,
  Search,
  Plus,
  Download,
  Filter,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Mail,
  Phone,
  TrendingUp,
  X,
  AlertCircle,
  ArrowRight,
  Kanban,
  Table as TableIcon,
  Star,
  FileCheck,
  Check,
  ChevronDown
} from 'lucide-react';
import {
  loadLeads,
  saveLeads,
  exportToCsv
} from '../utils/task2Storage';

const PIPELINE_STAGES = [
  'New Prospect',
  'Initial Discussion',
  'Presentation / Meeting',
  'Due Diligence',
  'Application Sent',
  'Disqualified'
];

const FRANCHISE_TIERS = [
  'Single Unit Express',
  'Standard Store',
  'Flagship Store',
  'Multi-Unit Franchise',
  'Master Franchise',
  'Kiosk Model'
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

export default function LeadManagement() {
  const [leads, setLeads] = useState(loadLeads);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'kanban'

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // Notification Toast
  const [toast, setToast] = useState(null);

  // Auto-sync with storage
  useEffect(() => {
    saveLeads(leads);
  }, [leads]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Form State
  const initialForm = {
    name: '',
    email: '',
    phone: '',
    city: '',
    state: 'Tamil Nadu',
    territory: '',
    tier: 'Single Unit Express',
    investmentCapacity: '₹25,00,000',
    priority: 'High',
    stage: 'New Prospect',
    leadScore: 80,
    assignedTo: 'Franchise Sales Director',
    nextFollowUp: '2026-11-10',
    notes: ''
  };
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});

  // Filtered Leads
  const filtered = useMemo(() => {
    return leads.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.city.toLowerCase().includes(search.toLowerCase()) ||
        item.phone.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        (item.assignedTo && item.assignedTo.toLowerCase().includes(search.toLowerCase()));

      const matchStage = stageFilter === 'ALL' || item.stage === stageFilter;
      const matchPriority = priorityFilter === 'ALL' || item.priority === priorityFilter;
      const matchTier = tierFilter === 'ALL' || item.tier === tierFilter;

      return matchSearch && matchStage && matchPriority && matchTier;
    });
  }, [leads, search, stageFilter, priorityFilter, tierFilter]);

  // KPIs
  const stats = useMemo(() => {
    const total = leads.length;
    const highPriority = leads.filter((l) => l.priority === 'High' && l.stage !== 'Disqualified').length;
    const inDiligence = leads.filter((l) => l.stage === 'Due Diligence').length;
    const appSent = leads.filter((l) => l.stage === 'Application Sent').length;
    return { total, highPriority, inDiligence, appSent };
  }, [leads]);

  // Form Validation
  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Lead candidate name is required';
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

  // Create Lead
  const handleCreate = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newId = `LED-2026-${String(leads.length + 1).padStart(3, '0')}`;
    const newEntry = {
      ...formData,
      id: newId,
      createdDate: new Date().toISOString().split('T')[0]
    };

    setLeads([newEntry, ...leads]);
    setIsAddOpen(false);
    setFormData(initialForm);
    setToast({ type: 'success', message: `Lead ${newId} created successfully!` });
  };

  // Edit Lead
  const openEdit = (item) => {
    setSelectedLead(item);
    setFormData({ ...item });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLeads(leads.map((item) => (item.id === selectedLead.id ? { ...formData, id: item.id, createdDate: item.createdDate } : item)));
    setIsEditOpen(false);
    setToast({ type: 'success', message: `Lead ${selectedLead.id} updated successfully!` });
  };

  // Details
  const openDetail = (item) => {
    setSelectedLead(item);
    setIsDetailOpen(true);
  };

  // Delete
  const openDelete = (item) => {
    setSelectedLead(item);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    setLeads(leads.filter((item) => item.id !== selectedLead.id));
    setIsDeleteOpen(false);
    setToast({ type: 'info', message: `Lead ${selectedLead.id} was removed.` });
  };

  // Fast Advance Stage
  const advanceStage = (lead) => {
    const currentIndex = PIPELINE_STAGES.indexOf(lead.stage);
    if (currentIndex >= 0 && currentIndex < PIPELINE_STAGES.length - 2) {
      const nextStage = PIPELINE_STAGES[currentIndex + 1];
      const updated = leads.map((l) => (l.id === lead.id ? { ...l, stage: nextStage } : l));
      setLeads(updated);
      if (selectedLead && selectedLead.id === lead.id) {
        setSelectedLead({ ...selectedLead, stage: nextStage });
      }
      setToast({ type: 'success', message: `${lead.id} promoted to "${nextStage}"` });
    }
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'High':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'Low':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
    }
  };

  const getStageBadge = (stage) => {
    switch (stage) {
      case 'New Prospect':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'Initial Discussion':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
      case 'Presentation / Meeting':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
      case 'Due Diligence':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'Application Sent':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      case 'Disqualified':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 scroll-smooth">
      {/* Toast Alert */}
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
          <p className="text-xs font-medium text-slate-500">Pipeline / Leads</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">Lead Management</h1>
          <p className="mt-1 text-xs text-slate-400">Qualify high-potential franchise partners and drive deal progression.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Switch View Toggle */}
          <div className="flex items-center rounded-xl border border-white/10 bg-black/30 p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-gold-500/25 to-gold-400/10 text-gold-300 border border-gold-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <TableIcon size={14} /> Table
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-gradient-to-r from-gold-500/25 to-gold-400/10 text-gold-300 border border-gold-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Kanban size={14} /> Pipeline Board
            </button>
          </div>

          <button
            onClick={() => exportToCsv(leads, 'franchise_leads.csv')}
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
            <Plus size={15} /> Add Franchise Lead
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Card 1: Total Qualified Leads */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-850 p-5 shadow-sm transition-all duration-300 hover:border-gold-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold-500/10 cursor-pointer">
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gold-500/0 blur-2xl transition-all duration-500 group-hover:bg-gold-500/15" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">Total Qualified Leads</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-gold-500/20 bg-gold-500/10 text-gold-400 transition-all duration-300 group-hover:scale-110 group-hover:border-gold-500/40 group-hover:bg-gold-500/20 group-hover:rotate-3">
              <UserCheck size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-white group-hover:text-gold-200 transition-colors">{stats.total}</p>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-300 transition-all group-hover:border-gold-500/30 group-hover:bg-gold-500/10 group-hover:text-gold-300">
              Active
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500 truncate group-hover:text-slate-400 transition-colors">Active in sales qualification</p>
        </div>

        {/* Card 2: High Priority Leads */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-850 p-5 shadow-sm transition-all duration-300 hover:border-rose-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-500/10 cursor-pointer">
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-rose-500/0 blur-2xl transition-all duration-500 group-hover:bg-rose-500/15" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">High Priority Leads</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 transition-all duration-300 group-hover:scale-110 group-hover:border-rose-500/40 group-hover:bg-rose-500/20 group-hover:rotate-3">
              <Star size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-white group-hover:text-rose-200 transition-colors">{stats.highPriority}</p>
            <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-300 transition-all group-hover:border-rose-500/40 group-hover:bg-rose-500/20">
              Priority
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500 truncate group-hover:text-slate-400 transition-colors">Ready for closing & presentation</p>
        </div>

        {/* Card 3: In Due Diligence */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-850 p-5 shadow-sm transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer">
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-amber-500/0 blur-2xl transition-all duration-500 group-hover:bg-amber-500/15" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">In Due Diligence</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400 transition-all duration-300 group-hover:scale-110 group-hover:border-amber-500/40 group-hover:bg-amber-500/20 group-hover:rotate-3">
              <FileCheck size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-white group-hover:text-amber-200 transition-colors">{stats.inDiligence}</p>
            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300 transition-all group-hover:border-amber-500/40 group-hover:bg-amber-500/20">
              Vetting
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500 truncate group-hover:text-slate-400 transition-colors">Financials & territory vetting</p>
        </div>

        {/* Card 4: Application Sent */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-850 p-5 shadow-sm transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer">
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-emerald-500/0 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/15" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">Application Sent</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 transition-all duration-300 group-hover:scale-110 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/20 group-hover:rotate-3">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-white group-hover:text-emerald-200 transition-colors">{stats.appSent}</p>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 transition-all group-hover:border-emerald-500/40 group-hover:bg-emerald-500/20">
              Contract Ready
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500 truncate group-hover:text-slate-400 transition-colors">Awaiting applicant submission</p>
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
            placeholder="Search leads by name, ID, phone, city, or sales owner..."
            className="w-full bg-transparent text-xs text-white placeholder:text-slate-600 outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-slate-500 hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Priority filter */}
          <CustomSelect
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={[
              { value: 'ALL', label: 'All Priorities' },
              { value: 'High', label: 'High Priority' },
              { value: 'Medium', label: 'Medium Priority' },
              { value: 'Low', label: 'Low Priority' }
            ]}
            align="right"
            buttonClassName="px-3 py-1.5 bg-black/20"
          />

          {/* Franchise Tier Filter */}
          <CustomSelect
            value={tierFilter}
            onChange={setTierFilter}
            options={[{ value: 'ALL', label: 'All Tiers' }, ...FRANCHISE_TIERS.map((t) => ({ value: t, label: t }))]}
            align="right"
            buttonClassName="px-3 py-1.5 bg-black/20"
          />

          {/* Stage Filter */}
          <CustomSelect
            value={stageFilter}
            onChange={setStageFilter}
            options={[{ value: 'ALL', label: 'All Stages' }, ...PIPELINE_STAGES.map((s) => ({ value: s, label: s }))]}
            icon={Filter}
            align="right"
            buttonClassName="px-3 py-1.5 bg-black/20"
          />
        </div>
      </div>

      {/* VIEW 1: TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-850 shadow-xl">
          <div className="overflow-x-auto scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(214,165,46,0.3)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gold-500/40">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  <th className="px-5 py-4">Lead ID</th>
                  <th className="px-5 py-4">Lead Candidate</th>
                  <th className="px-5 py-4">Franchise Model / Tier</th>
                  <th className="px-5 py-4">Territory / Location</th>
                  <th className="px-5 py-4">Capacity</th>
                  <th className="px-5 py-4">Priority</th>
                  <th className="px-5 py-4">Pipeline Stage</th>
                  <th className="px-5 py-4">Next Follow-Up</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filtered.length > 0 ? (
                  filtered.map((item) => (
                    <tr key={item.id} className="group/row hover:bg-white/[0.04] transition-all duration-200">
                      {/* ID & Score */}
                      <td className="px-5 py-4 font-mono font-semibold text-gold-300">
                        <div className="flex items-center gap-1.5">
                          <span className="group-hover/row:text-gold-400 group-hover/row:translate-x-0.5 transition-all">{item.id}</span>
                          {item.leadScore && (
                            <span className="rounded bg-gold-500/10 px-1.5 py-0.5 text-[10px] font-bold text-gold-400 group-hover/row:border group-hover/row:border-gold-500/30 transition-all" title="Lead Quality Score">
                              {item.leadScore}%
                            </span>
                          )}
                        </div>
                        {item.enquiryId && (
                          <p className="mt-0.5 text-[10px] text-slate-500 font-sans">
                            via {item.enquiryId}
                          </p>
                        )}
                      </td>

                      {/* Candidate info */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-white group-hover/row:text-gold-200 transition-colors">{item.name}</p>
                        <div className="mt-1 flex flex-col gap-0.5 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Mail size={11} className="text-slate-500 group-hover/row:text-slate-400 transition-colors" /> {item.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={11} className="text-slate-500 group-hover/row:text-slate-400 transition-colors" /> {item.phone}
                          </span>
                        </div>
                      </td>

                      {/* Model / Tier */}
                      <td className="px-5 py-4">
                        <span className="font-medium text-slate-200 group-hover/row:text-white transition-colors">{item.tier}</span>
                      </td>

                      {/* Territory */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 text-white">
                          <MapPin size={12} className="text-gold-400 shrink-0 group-hover/row:scale-110 transition-transform" />
                          <span>{item.city}, {item.state}</span>
                        </div>
                        {item.territory && (
                          <p className="mt-0.5 text-[11px] text-slate-500 pl-4">{item.territory}</p>
                        )}
                      </td>

                      {/* Capacity */}
                      <td className="px-5 py-4 font-semibold text-gold-300">
                        {item.investmentCapacity}
                      </td>

                      {/* Priority */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold transition-transform duration-200 hover:scale-105 cursor-default ${getPriorityBadge(item.priority)}`}>
                          {item.priority}
                        </span>
                      </td>

                      {/* Stage */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold transition-transform duration-200 hover:scale-105 cursor-default ${getStageBadge(item.stage)}`}>
                          {item.stage}
                        </span>
                      </td>

                      {/* Next follow up */}
                      <td className="px-5 py-4 text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Calendar size={12} className="text-gold-400 group-hover/row:scale-110 transition-transform" />
                          <span>{item.nextFollowUp || 'Not scheduled'}</span>
                        </div>
                        <p className="mt-0.5 text-[10px] text-slate-500 truncate max-w-[130px]">
                          {item.assignedTo}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Advance Stage button */}
                          {item.stage !== 'Application Sent' && item.stage !== 'Disqualified' && (
                            <button
                              onClick={() => advanceStage(item)}
                              title="Advance Pipeline Stage"
                              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-gold-500/30 bg-gold-500/10 px-2.5 py-1 text-[11px] font-medium text-gold-300 shadow-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-gold-500 hover:via-gold-400 hover:to-gold-300 hover:text-black hover:font-bold hover:shadow-md hover:shadow-gold-500/20 hover:scale-105 active:scale-95 cursor-pointer"
                            >
                              <ArrowRight size={13} />
                              <span className="hidden xl:inline">Next Stage</span>
                            </button>
                          )}

                          <button
                            onClick={() => openDetail(item)}
                            title="View Lead Profile"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white hover:scale-115 active:scale-95 transition-all duration-150 cursor-pointer"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            onClick={() => openEdit(item)}
                            title="Edit Lead"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-gold-500/15 hover:text-gold-300 hover:scale-115 active:scale-95 transition-all duration-150 cursor-pointer"
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            onClick={() => openDelete(item)}
                            title="Delete Lead"
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
                    <td colSpan={9} className="px-5 py-12 text-center text-slate-500">
                      <p className="text-sm font-medium">No leads match the selected criteria</p>
                      <p className="mt-1 text-xs">Try clearing search filters or add a new franchise lead.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/10 px-5 py-3 text-[11px] text-slate-500">
            <span>Showing {filtered.length} of {leads.length} qualified leads</span>
            <span className="mt-1 sm:mt-0 text-slate-400">Lead Qualification Pipeline · Real-time Sync</span>
          </div>
        </div>
      ) : (
        /* VIEW 2: PIPELINE KANBAN VIEW */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {PIPELINE_STAGES.filter((s) => s !== 'Disqualified').map((stage) => {
            const stageLeads = filtered.filter((l) => l.stage === stage);
            return (
              <div key={stage} className="flex flex-col rounded-2xl border border-white/10 bg-ink-850 p-4 min-h-[480px] transition-all duration-300 hover:border-white/20 hover:shadow-lg">
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gold-400 shadow-sm shadow-gold-500/50"></span>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">{stage}</h4>
                  </div>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="mt-3 flex-1 space-y-3 overflow-y-auto scroll-smooth max-h-[620px] pr-1.5 [scrollbar-width:thin] [scrollbar-color:rgba(214,165,46,0.3)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gold-500/40">
                  {stageLeads.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => openDetail(item)}
                      className="group/card relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900/95 p-4 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/50 hover:bg-ink-850 hover:shadow-xl hover:shadow-gold-500/10 cursor-pointer"
                    >
                      {/* Top Golden Accent Line on hover */}
                      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400/0 to-transparent transition-all duration-500 group-hover/card:via-gold-400" />

                      {/* Ambient background bloom on card hover */}
                      <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-gold-500/0 blur-xl transition-all duration-500 group-hover/card:bg-gold-500/10" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-gold-400 group-hover/card:text-gold-300 transition-colors">{item.id}</span>
                          {item.leadScore && (
                            <span className="rounded bg-gold-500/10 px-1 py-0.2 text-[9px] font-bold text-gold-400 transition-all group-hover/card:border group-hover/card:border-gold-500/30">
                              {item.leadScore}%
                            </span>
                          )}
                        </div>
                        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold transition-transform duration-200 group-hover/card:scale-105 ${getPriorityBadge(item.priority)}`}>
                          {item.priority}
                        </span>
                      </div>

                      <h5 className="mt-2 font-bold text-white text-xs group-hover/card:text-gold-200 transition-colors">
                        {item.name}
                      </h5>

                      <p className="mt-1 text-[11px] text-slate-400 flex items-center gap-1 group-hover/card:text-slate-300 transition-colors">
                        <MapPin size={11} className="text-gold-400 shrink-0 group-hover/card:scale-110 transition-transform" /> {item.city}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between border-t border-white/5 pt-2 text-[10px]">
                        <span className="text-slate-400 group-hover/card:text-slate-300 transition-colors">{item.tier}</span>
                        <span className="font-semibold text-gold-300 group-hover/card:text-gold-200 transition-colors">{item.investmentCapacity}</span>
                      </div>

                      <div className="mt-2 flex items-center justify-between pt-1 text-[9px] text-slate-500">
                        <span className="flex items-center gap-1 group-hover/card:text-slate-400 transition-colors">
                          <Clock size={10} className="text-slate-400" /> {item.nextFollowUp}
                        </span>

                        {stage !== 'Application Sent' ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              advanceStage(item);
                            }}
                            title="Advance to next pipeline stage"
                            className="opacity-0 group-hover/card:opacity-100 flex items-center gap-1 rounded-md border border-gold-500/30 bg-gold-500/10 px-2 py-0.5 text-[9px] font-semibold text-gold-300 hover:bg-gradient-to-r hover:from-gold-500 hover:via-gold-400 hover:to-gold-300 hover:text-black hover:font-bold hover:scale-105 transition-all duration-200 cursor-pointer shadow-sm"
                          >
                            <span>Advance</span>
                            <ArrowRight size={10} />
                          </button>
                        ) : (
                          <span className="font-medium text-emerald-400">Ready</span>
                        )}
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-slate-600 text-xs">
                      No leads in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: ADD LEAD */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity duration-200">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-2xl max-h-[92vh] overflow-y-auto scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(214,165,46,0.3)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gold-500/40">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Add New Qualified Franchise Lead</h3>
                <p className="text-xs text-slate-400">Initialize a vetted franchise partner in the pipeline.</p>
              </div>
              <button onClick={() => setIsAddOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Lead Candidate Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Anand Venkatesh"
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
                    placeholder="e.g. anand@company.com"
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
                    placeholder="e.g. +91 99620 44556"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-gold-500"
                  />
                  {formErrors.phone && <p className="mt-1 text-[10px] text-rose-400">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">
                    City / Target Region <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Bangalore"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-gold-500"
                  />
                  {formErrors.city && <p className="mt-1 text-[10px] text-rose-400">{formErrors.city}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Franchise Model Tier</label>
                  <CustomSelect
                    value={formData.tier}
                    onChange={(val) => setFormData({ ...formData, tier: val })}
                    options={FRANCHISE_TIERS}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Investment Capital Capacity</label>
                  <input
                    type="text"
                    value={formData.investmentCapacity}
                    onChange={(e) => setFormData({ ...formData, investmentCapacity: e.target.value })}
                    placeholder="e.g. ₹40,00,000"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Lead Priority</label>
                  <CustomSelect
                    value={formData.priority}
                    onChange={(val) => setFormData({ ...formData, priority: val })}
                    options={[
                      { value: 'High', label: 'High Priority' },
                      { value: 'Medium', label: 'Medium Priority' },
                      { value: 'Low', label: 'Low Priority' }
                    ]}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Initial Pipeline Stage</label>
                  <CustomSelect
                    value={formData.stage}
                    onChange={(val) => setFormData({ ...formData, stage: val })}
                    options={PIPELINE_STAGES}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Assigned Sales Owner</label>
                  <input
                    type="text"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Next Scheduled Follow-Up Date</label>
                  <input
                    type="date"
                    value={formData.nextFollowUp}
                    onChange={(e) => setFormData({ ...formData, nextFollowUp: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300">Assessment Notes & Requirements</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Details on financial capability, location readiness, or discussion points..."
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
                  Add Lead to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT LEAD */}
      {isEditOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity duration-200">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-2xl max-h-[92vh] overflow-y-auto scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(214,165,46,0.3)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gold-500/40">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Edit Lead #{selectedLead.id}</h3>
                <p className="text-xs text-slate-400">Update pipeline status, priority, or follow-up schedule.</p>
              </div>
              <button onClick={() => setIsEditOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Lead Candidate Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white outline-none focus:border-gold-500"
                  />
                  {formErrors.name && <p className="mt-1 text-[10px] text-rose-400">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Pipeline Stage</label>
                  <CustomSelect
                    value={formData.stage}
                    onChange={(val) => setFormData({ ...formData, stage: val })}
                    options={PIPELINE_STAGES}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Lead Priority</label>
                  <CustomSelect
                    value={formData.priority}
                    onChange={(val) => setFormData({ ...formData, priority: val })}
                    options={[
                      { value: 'High', label: 'High' },
                      { value: 'Medium', label: 'Medium' },
                      { value: 'Low', label: 'Low' }
                    ]}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Franchise Model Tier</label>
                  <CustomSelect
                    value={formData.tier}
                    onChange={(val) => setFormData({ ...formData, tier: val })}
                    options={FRANCHISE_TIERS}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Investment Capital Capacity</label>
                  <input
                    type="text"
                    value={formData.investmentCapacity}
                    onChange={(e) => setFormData({ ...formData, investmentCapacity: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Next Follow-Up Date</label>
                  <input
                    type="date"
                    value={formData.nextFollowUp}
                    onChange={(e) => setFormData({ ...formData, nextFollowUp: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300">Follow-Up Notes & Action Items</label>
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

      {/* MODAL: VIEW LEAD PROFILE */}
      {isDetailOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity duration-200">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-2xl max-h-[92vh] overflow-y-auto scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(214,165,46,0.3)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gold-500/40">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/20 text-gold-300 font-extrabold text-base">
                  {selectedLead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedLead.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-xs text-gold-400">{selectedLead.id}</span>
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold ${getPriorityBadge(selectedLead.priority)}`}>
                      {selectedLead.priority} Priority
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              {/* Pipeline Progression Indicator */}
              <div className="rounded-xl border border-white/5 bg-black/30 p-3.5">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Pipeline Stage</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${getStageBadge(selectedLead.stage)}`}>
                    <CheckCircle2 size={13} /> {selectedLead.stage}
                  </span>
                  {selectedLead.stage !== 'Application Sent' && selectedLead.stage !== 'Disqualified' && (
                    <button
                      onClick={() => advanceStage(selectedLead)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold-400 hover:text-gold-300"
                    >
                      Advance to next stage <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Dossier Grid */}
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-white/5 bg-black/20 p-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Franchise Model</p>
                  <p className="mt-1 font-semibold text-white">{selectedLead.tier}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Capital Capacity</p>
                  <p className="mt-1 font-semibold text-gold-300">{selectedLead.investmentCapacity}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Email</p>
                  <p className="mt-1 text-slate-300 flex items-center gap-1">
                    <Mail size={12} className="text-gold-400" /> {selectedLead.email}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Phone</p>
                  <p className="mt-1 text-slate-300 flex items-center gap-1">
                    <Phone size={12} className="text-gold-400" /> {selectedLead.phone}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Target Territory</p>
                  <p className="mt-1 font-medium text-white">{selectedLead.city}, {selectedLead.state}</p>
                  {selectedLead.territory && <p className="text-[11px] text-slate-400">{selectedLead.territory}</p>}
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Next Follow-Up</p>
                  <p className="mt-1 font-medium text-amber-300 flex items-center gap-1">
                    <Calendar size={12} /> {selectedLead.nextFollowUp || 'None'}
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Lead Notes & Evaluation</p>
                <p className="mt-1 rounded-xl border border-white/5 bg-black/20 p-3 text-slate-300">
                  {selectedLead.notes || 'No notes available.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-white/10 mt-5">
              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  openEdit(selectedLead);
                }}
                className="text-xs text-slate-400 hover:text-white"
              >
                Edit Lead Data
              </button>

              <button
                onClick={() => setIsDetailOpen(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRM */}
      {isDeleteOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-ink-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
                <AlertCircle size={22} />
              </div>
              <h3 className="text-base font-bold text-white">Delete Franchise Lead</h3>
            </div>
            <p className="mt-3 text-xs text-slate-300">
              Are you sure you want to delete lead <strong className="text-white">{selectedLead.id} ({selectedLead.name})</strong>? This action cannot be undone.
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

