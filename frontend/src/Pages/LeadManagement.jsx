import { useState, useEffect, useMemo } from 'react';
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
  FileCheck
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
    assignedTo: 'Roshan (Lead Manager)',
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
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-gold-500/30 bg-ink-900/95 p-4 text-xs shadow-2xl backdrop-blur-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold-500/20 text-gold-300">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="font-semibold text-white">{toast.message}</p>
            <p className="text-[10px] text-slate-400">Task 2: Lead Management Pipeline</p>
          </div>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-gold-500/10 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-gold-400 uppercase border border-gold-500/20">
              Task 2 · Roshan
            </span>
            <span className="text-xs text-slate-400">Franchise Pipeline</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">Lead Management</h1>
          <p className="text-xs text-slate-400">Qualify high-potential franchise partners and drive deal progression.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Switch View Toggle */}
          <div className="flex items-center rounded-xl border border-white/10 bg-black/30 p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === 'table' ? 'bg-gold-500/20 text-gold-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon size={14} /> Table
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === 'kanban' ? 'bg-gold-500/20 text-gold-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Kanban size={14} /> Pipeline Board
            </button>
          </div>

          <button
            onClick={() => exportToCsv(leads, 'franchise_leads.csv')}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs font-medium text-slate-300 hover:border-gold-500/40 hover:text-gold-300 transition-all"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={() => {
              setFormData(initialForm);
              setFormErrors({});
              setIsAddOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-300 px-4 py-2.5 text-xs font-bold text-black shadow-lg shadow-gold-500/10 hover:brightness-110 transition-all"
          >
            <Plus size={15} /> Add Franchise Lead
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-ink-850 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-400">Total Qualified Leads</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-gold-300">
              <UserCheck size={18} />
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-extrabold text-white">{stats.total}</h3>
          <p className="mt-1 text-[11px] text-slate-500">Active in sales qualification</p>
        </div>

        <div className="rounded-2xl border border-rose-500/20 bg-ink-850 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-rose-300">High Priority Leads</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-300">
              <Star size={18} />
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-extrabold text-white">{stats.highPriority}</h3>
          <p className="mt-1 text-[11px] text-slate-500">Ready for closing & presentation</p>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-ink-850 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-amber-300">In Due Diligence</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300">
              <FileCheck size={18} />
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-extrabold text-white">{stats.inDiligence}</h3>
          <p className="mt-1 text-[11px] text-slate-500">Financials & territory vetting</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-ink-850 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-emerald-300">Application Sent</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
              <TrendingUp size={18} />
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-extrabold text-white">{stats.appSent}</h3>
          <p className="mt-1 text-[11px] text-slate-500">Awaiting applicant form submission</p>
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
          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/20 px-3 py-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-500">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-[11px] font-medium text-slate-300 outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-ink-900 text-white">All Priorities</option>
              <option value="High" className="bg-ink-900 text-white">High Priority</option>
              <option value="Medium" className="bg-ink-900 text-white">Medium Priority</option>
              <option value="Low" className="bg-ink-900 text-white">Low Priority</option>
            </select>
          </div>

          {/* Franchise Tier Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/20 px-3 py-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-500">Tier:</span>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="bg-transparent text-[11px] font-medium text-slate-300 outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-ink-900 text-white">All Tiers</option>
              {FRANCHISE_TIERS.map((t) => (
                <option key={t} value={t} className="bg-ink-900 text-white">{t}</option>
              ))}
            </select>
          </div>

          {/* Stage Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/20 px-3 py-1.5">
            <Filter size={13} className="text-slate-400" />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="bg-transparent text-[11px] font-medium text-slate-300 outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-ink-900 text-white">All Stages</option>
              {PIPELINE_STAGES.map((s) => (
                <option key={s} value={s} className="bg-ink-900 text-white">{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* VIEW 1: TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-850 shadow-xl">
          <div className="overflow-x-auto">
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
                    <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
                      {/* ID & Score */}
                      <td className="px-5 py-4 font-mono font-semibold text-gold-300">
                        <div className="flex items-center gap-1.5">
                          <span>{item.id}</span>
                          {item.leadScore && (
                            <span className="rounded bg-gold-500/10 px-1.5 py-0.5 text-[10px] font-bold text-gold-400" title="Lead Quality Score">
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
                        <p className="font-semibold text-white">{item.name}</p>
                        <div className="mt-1 flex flex-col gap-0.5 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Mail size={11} className="text-slate-500" /> {item.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={11} className="text-slate-500" /> {item.phone}
                          </span>
                        </div>
                      </td>

                      {/* Model / Tier */}
                      <td className="px-5 py-4">
                        <span className="font-medium text-slate-200">{item.tier}</span>
                      </td>

                      {/* Territory */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 text-white">
                          <MapPin size={12} className="text-gold-400 shrink-0" />
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
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${getPriorityBadge(item.priority)}`}>
                          {item.priority}
                        </span>
                      </td>

                      {/* Stage */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${getStageBadge(item.stage)}`}>
                          {item.stage}
                        </span>
                      </td>

                      {/* Next follow up */}
                      <td className="px-5 py-4 text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Calendar size={12} className="text-gold-400" />
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
                              className="flex items-center gap-1 rounded-lg border border-gold-500/20 bg-gold-500/10 px-2 py-1 text-[11px] font-medium text-gold-300 hover:bg-gold-500/20"
                            >
                              <ArrowRight size={13} />
                              <span className="hidden xl:inline">Next Stage</span>
                            </button>
                          )}

                          <button
                            onClick={() => openDetail(item)}
                            title="View Lead Profile"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            onClick={() => openEdit(item)}
                            title="Edit Lead"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-gold-300"
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            onClick={() => openDelete(item)}
                            title="Delete Lead"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
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
            <span className="mt-1 sm:mt-0 text-slate-400">Task 2 Lead Management Engine</span>
          </div>
        </div>
      ) : (
        /* VIEW 2: PIPELINE KANBAN VIEW */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {PIPELINE_STAGES.filter((s) => s !== 'Disqualified').map((stage) => {
            const stageLeads = filtered.filter((l) => l.stage === stage);
            return (
              <div key={stage} className="flex flex-col rounded-2xl border border-white/10 bg-ink-850 p-4 min-h-[480px]">
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gold-400"></span>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">{stage}</h4>
                  </div>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="mt-3 flex-1 space-y-3 overflow-y-auto">
                  {stageLeads.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => openDetail(item)}
                      className="group cursor-pointer rounded-xl border border-white/5 bg-ink-900/90 p-3.5 hover:border-gold-500/40 hover:bg-white/[0.04] transition-all shadow"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-gold-400">{item.id}</span>
                        <span className={`rounded-full border px-2 py-0.2 text-[9px] font-semibold ${getPriorityBadge(item.priority)}`}>
                          {item.priority}
                        </span>
                      </div>

                      <h5 className="mt-1.5 font-bold text-white text-xs group-hover:text-gold-300 transition-colors">
                        {item.name}
                      </h5>

                      <p className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin size={11} className="text-gold-400" /> {item.city}
                      </p>

                      <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-2 text-[10px]">
                        <span className="text-slate-400">{item.tier}</span>
                        <span className="font-semibold text-gold-300">{item.investmentCapacity}</span>
                      </div>

                      <div className="mt-2 flex items-center justify-between pt-1 text-[9px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {item.nextFollowUp}
                        </span>
                        <span className="font-medium text-slate-400">{item.assignedTo.split(' ')[0]}</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-2xl">
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
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-850 px-3.5 py-2 text-xs text-white outline-none focus:border-gold-500"
                  >
                    {FRANCHISE_TIERS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
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
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-850 px-3.5 py-2 text-xs text-white outline-none focus:border-gold-500"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Initial Pipeline Stage</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-850 px-3.5 py-2 text-xs text-white outline-none focus:border-gold-500"
                  >
                    {PIPELINE_STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-2xl">
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
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-850 px-3.5 py-2 text-xs text-white outline-none focus:border-gold-500"
                  >
                    {PIPELINE_STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Lead Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-850 px-3.5 py-2 text-xs text-white outline-none focus:border-gold-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Franchise Model Tier</label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-850 px-3.5 py-2 text-xs text-white outline-none focus:border-gold-500"
                  >
                    {FRANCHISE_TIERS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-2xl">
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

