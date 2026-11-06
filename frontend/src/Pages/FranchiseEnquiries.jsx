import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle,
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
  Check
} from 'lucide-react';
import {
  loadEnquiries,
  saveEnquiries,
  convertEnquiryToLead,
  exportToCsv
} from '../utils/task2Storage';

export default function FranchiseEnquiries() {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState(loadEnquiries);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  
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
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-gold-500/30 bg-ink-900/95 p-4 text-xs shadow-2xl backdrop-blur-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold-500/20 text-gold-300">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="font-semibold text-white">{toast.message}</p>
            <p className="text-[10px] text-slate-400">Task 2: Franchise Enquiries Management</p>
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
            <span className="text-xs text-slate-400">Inbound Pipeline</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">Franchise Enquiries</h1>
          <p className="text-xs text-slate-400">Capture, qualify, and triage prospective franchise candidate inquiries.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportToCsv(enquiries, 'franchise_enquiries.csv')}
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
            <Plus size={15} /> Capture Enquiry
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-ink-850 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-400">Total Enquiries</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-gold-300">
              <HelpCircle size={18} />
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-extrabold text-white">{stats.total}</h3>
          <p className="mt-1 text-[11px] text-slate-500">All registered franchise prospects</p>
        </div>

        <div className="rounded-2xl border border-sky-500/20 bg-ink-850 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-sky-400">New Inbound</p>
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
            </span>
          </div>
          <h3 className="mt-2 text-2xl font-extrabold text-white">{stats.newCount}</h3>
          <p className="mt-1 text-[11px] text-slate-500">Pending initial contact & screening</p>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-ink-850 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-amber-300">Under Review / Contacted</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300">
              <Clock size={18} />
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-extrabold text-white">{stats.contactedCount}</h3>
          <p className="mt-1 text-[11px] text-slate-500">In evaluation or preliminary call</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-ink-850 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-emerald-400">Converted to Leads</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
              <TrendingUp size={18} />
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-extrabold text-white">{stats.convertedCount}</h3>
          <p className="mt-1 text-[11px] text-slate-500">Promoted into sales pipeline</p>
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
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-gold-500/20 text-gold-300 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Source Dropdown */}
          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/20 px-3 py-1.5">
            <Filter size={13} className="text-slate-400" />
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-transparent text-[11px] font-medium text-slate-300 outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-ink-900 text-white">All Sources</option>
              <option value="Official Website" className="bg-ink-900 text-white">Official Website</option>
              <option value="Franchise India Expo" className="bg-ink-900 text-white">Franchise India Expo</option>
              <option value="LinkedIn Campaign" className="bg-ink-900 text-white">LinkedIn Campaign</option>
              <option value="Direct Referral" className="bg-ink-900 text-white">Direct Referral</option>
              <option value="Instagram Ad" className="bg-ink-900 text-white">Instagram Ad</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-850 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                <th className="px-5 py-4">Enquiry ID</th>
                <th className="px-5 py-4">Prospect / Contact</th>
                <th className="px-5 py-4">Preferred Location</th>
                <th className="px-5 py-4">Budget Range</th>
                <th className="px-5 py-4">Lead Source</th>
                <th className="px-5 py-4">Received Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
                    {/* ID */}
                    <td className="px-5 py-4 font-mono font-semibold text-gold-300">
                      <div className="flex items-center gap-1.5">
                        <span>{item.id}</span>
                        <button
                          onClick={() => copyToClipboard(item.id, item.id)}
                          title="Copy ID"
                          className="text-slate-500 hover:text-white"
                        >
                          {copiedId === item.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </td>

                    {/* Prospect Info */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <div className="mt-1 flex flex-col gap-0.5 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Mail size={11} className="text-slate-500" /> {item.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={11} className="text-slate-500" /> {item.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-white">
                        <MapPin size={13} className="text-gold-400 shrink-0" />
                        <span>{item.city}, {item.state}</span>
                      </div>
                      {item.territory && (
                        <p className="mt-0.5 text-[11px] text-slate-500 pl-4">{item.territory}</p>
                      )}
                    </td>

                    {/* Investment Range */}
                    <td className="px-5 py-4">
                      <span className="inline-block rounded-md bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-200 border border-white/5">
                        {item.investmentRange}
                      </span>
                    </td>

                    {/* Source */}
                    <td className="px-5 py-4 text-[11px] text-slate-400">
                      {item.source}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-[11px] text-slate-500">
                      {item.receivedDate}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick Convert */}
                        {item.status !== 'Converted' && (
                          <button
                            onClick={() => handleConvertToLead(item)}
                            title="Convert to Qualified Lead"
                            className="flex items-center gap-1 rounded-lg border border-gold-500/20 bg-gold-500/10 px-2 py-1 text-[11px] font-medium text-gold-300 hover:bg-gold-500/20"
                          >
                            <UserPlus size={13} />
                            <span className="hidden xl:inline">To Lead</span>
                          </button>
                        )}

                        <button
                          onClick={() => openDetail(item)}
                          title="View Details"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={() => openEdit(item)}
                          title="Edit Enquiry"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-gold-300"
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          onClick={() => openDelete(item)}
                          title="Delete"
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
            Task 2 Franchise Pipeline · Synced to Local Storage
          </span>
        </div>
      </div>

      {/* MODAL: ADD NEW ENQUIRY */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-2xl">
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
                  <select
                    value={formData.investmentRange}
                    onChange={(e) => setFormData({ ...formData, investmentRange: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-850 px-3.5 py-2 text-xs text-white outline-none focus:border-gold-500"
                  >
                    <option value="₹10 - ₹15 Lakhs">₹10 - ₹15 Lakhs (Kiosk)</option>
                    <option value="₹15 - ₹25 Lakhs">₹15 - ₹25 Lakhs (Express Unit)</option>
                    <option value="₹25 - ₹35 Lakhs">₹25 - ₹35 Lakhs (Standard Store)</option>
                    <option value="₹40 - ₹50 Lakhs">₹40 - ₹50 Lakhs (Flagship Store)</option>
                    <option value="₹50+ Lakhs">₹50+ Lakhs (Multi-Unit / Master)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">Enquiry Source</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-850 px-3.5 py-2 text-xs text-white outline-none focus:border-gold-500"
                  >
                    <option value="Official Website">Official Website</option>
                    <option value="Franchise India Expo">Franchise India Expo</option>
                    <option value="LinkedIn Campaign">LinkedIn Campaign</option>
                    <option value="Direct Referral">Direct Referral</option>
                    <option value="Instagram Ad">Instagram Ad</option>
                  </select>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-2xl">
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
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-850 px-3.5 py-2 text-xs text-white outline-none focus:border-gold-500"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Converted">Converted</option>
                    <option value="Dropped">Dropped</option>
                  </select>
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
                  <select
                    value={formData.investmentRange}
                    onChange={(e) => setFormData({ ...formData, investmentRange: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-850 px-3.5 py-2 text-xs text-white outline-none focus:border-gold-500"
                  >
                    <option value="₹10 - ₹15 Lakhs">₹10 - ₹15 Lakhs</option>
                    <option value="₹15 - ₹25 Lakhs">₹15 - ₹25 Lakhs</option>
                    <option value="₹25 - ₹35 Lakhs">₹25 - ₹35 Lakhs</option>
                    <option value="₹40 - ₹50 Lakhs">₹40 - ₹50 Lakhs</option>
                    <option value="₹50+ Lakhs">₹50+ Lakhs</option>
                  </select>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-2xl">
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

