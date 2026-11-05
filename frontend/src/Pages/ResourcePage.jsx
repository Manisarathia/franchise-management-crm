
import { useMemo, useState } from 'react';

import {
  FileText,
  Users,
  ShieldCheck,
  Building2,
  FileSignature,
  FolderOpen,
  BadgeCheck,
  RefreshCw,
  CheckCircle2,
  UploadCloud,
} from 'lucide-react';

import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { exportCsv } from '../utils/storage';

const configs = {
  users: {
    title: 'User Management',
    desc: 'Create, update and manage access for your CRM team.',
    add: 'Add User',
    icon: Users,
    fields: [
      ['name', 'Full Name'],
      ['email', 'Email Address'],
      ['role', 'Role'],
      ['department', 'Department'],
      ['status', 'Status'],
    ],
    columns: [
      ['name', 'Name'],
      ['email', 'Email'],
      ['role', 'Role'],
      ['department', 'Department'],
      ['status', 'Status'],
    ],
  },

  roles: {
    title: 'Roles & Permissions',
    desc: 'Control access across different CRM modules.',
    add: 'Create Role',
    icon: ShieldCheck,
    fields: [
      ['name', 'Role Name'],
      ['description', 'Description'],
      ['users', 'Assigned Users'],
      ['permissions', 'Permissions'],
    ],
    columns: [
      ['name', 'Role'],
      ['description', 'Description'],
      ['users', 'Users'],
      ['permissions', 'Permissions'],
    ],
  },

  departments: {
    title: 'Department Management',
    desc: 'Manage departments and team members.',
    add: 'Add Department',
    icon: Building2,
    fields: [
      ['name', 'Department Name'],
      ['head', 'Department Head'],
      ['members', 'Members'],
      ['status', 'Status'],
    ],
    columns: [
      ['name', 'Department'],
      ['head', 'Department Head'],
      ['members', 'Members'],
      ['status', 'Status'],
    ],
  },

  agreements: {
    title: 'Agreement Management',
    desc: 'Manage franchise agreements and expiry dates.',
    add: 'New Agreement',
    icon: FileSignature,
    fields: [
      ['id', 'Agreement ID'],
      ['franchise', 'Franchise'],
      ['type', 'Agreement Type'],
      ['start', 'Start Date'],
      ['expiry', 'Expiry Date'],
      ['owner', 'Legal Owner'],
      ['status', 'Status'],
    ],
    columns: [
      ['id', 'Agreement ID'],
      ['franchise', 'Franchise'],
      ['type', 'Type'],
      ['start', 'Start Date'],
      ['expiry', 'Expiry Date'],
      ['owner', 'Owner'],
      ['status', 'Status'],
    ],
  },

  contracts: {
    title: 'Contract Management',
    desc: 'Store contracts and monitor signature progress.',
    add: 'Add Contract',
    icon: FileText,
    fields: [
      ['id', 'Contract ID'],
      ['title', 'Contract Title'],
      ['party', 'Franchise / Party'],
      ['value', 'Contract Value'],
      ['signed', 'Signed Date'],
      ['status', 'Status'],
    ],
    columns: [
      ['id', 'Contract ID'],
      ['title', 'Contract'],
      ['party', 'Party'],
      ['value', 'Value'],
      ['signed', 'Date'],
      ['status', 'Status'],
    ],
  },

  documents: {
    title: 'Document Management',
    desc: 'Manage and organize legal documents.',
    add: 'Add Document',
    icon: FolderOpen,
    fields: [
      ['id', 'Document ID'],
      ['name', 'Document Name'],
      ['category', 'Category'],
      ['linkedTo', 'Linked Record'],
      ['uploaded', 'Upload Date'],
      ['size', 'File Size'],
    ],
    columns: [
      ['id', 'Document ID'],
      ['name', 'Document'],
      ['category', 'Category'],
      ['linkedTo', 'Linked To'],
      ['uploaded', 'Uploaded'],
      ['size', 'Size'],
    ],
  },

  licenses: {
    title: 'License Management',
    desc: 'Track licenses and validity information.',
    add: 'Add License',
    icon: BadgeCheck,
    fields: [
      ['id', 'License ID'],
      ['franchise', 'Franchise'],
      ['license', 'License Type'],
      ['number', 'License Number'],
      ['expiry', 'Expiry Date'],
      ['status', 'Status'],
    ],
    columns: [
      ['id', 'License ID'],
      ['franchise', 'Franchise'],
      ['license', 'License'],
      ['number', 'License Number'],
      ['expiry', 'Expiry Date'],
      ['status', 'Status'],
    ],
  },

  renewals: {
    title: 'Renewal Management',
    desc: 'Track renewal requests and upcoming expiry dates.',
    add: 'Create Renewal',
    icon: RefreshCw,
    fields: [
      ['id', 'Renewal ID'],
      ['franchise', 'Franchise'],
      ['item', 'Renewal Item'],
      ['due', 'Due Date'],
      ['assigned', 'Assigned To'],
      ['status', 'Status'],
    ],
    columns: [
      ['id', 'Renewal ID'],
      ['franchise', 'Franchise'],
      ['item', 'Renewal Item'],
      ['due', 'Due Date'],
      ['assigned', 'Assigned To'],
      ['status', 'Status'],
    ],
  },
};

const statusOptions = [
  'Active',
  'Inactive',
  'Pending',
  'Pending Signature',
  'Signed',
  'Expiring Soon',
  'Expired',
  'Valid',
  'In Review',
  'Upcoming',
  'Overdue',
];

export default function ResourcePage({
  type,
  data = {},
  setData,
}) {
  const cfg = configs[type];

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState({});

  const rows = Array.isArray(data?.[type]) ? data[type] : [];

  const getEmptyForm = () => {
    if (!cfg) return {};

    return Object.fromEntries(
      cfg.fields.map(([key]) => [key, ''])
    );
  };

  const filtered = useMemo(() => {
    return rows.filter((row) =>
      Object.values(row)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [rows, search]);

  const showNotice = (message) => {
    setNotice(message);

    setTimeout(() => {
      setNotice('');
    }, 2500);
  };

  const close = () => {
    setOpen(false);
    setEditing(null);
    setForm(getEmptyForm());
  };

  const handleAdd = () => {
    setEditing(null);
    setForm(getEmptyForm());
    setOpen(true);
  };

  const handleEdit = (row) => {
    setEditing(row);
    setForm({ ...row });
    setOpen(true);
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!setData) {
      showNotice('Data update function is not connected.');
      return;
    }

    let updatedData;

    if (editing) {
      updatedData = rows.map((row) =>
        row.id === editing.id
          ? { ...form, id: editing.id }
          : row
      );

      showNotice('Record updated successfully!');
    } else {
      const newId =
        form.id ||
        `${type.slice(0, 3).toUpperCase()}-${Date.now()
          .toString()
          .slice(-5)}`;

      updatedData = [
        {
          ...form,
          id: newId,
        },
        ...rows,
      ];

      showNotice('Record created successfully!');
    }

    setData((prev) => ({
      ...prev,
      [type]: updatedData,
    }));

    close();
  };

  const handleDelete = () => {
    if (!editing || !setData) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${editing.id}?`
    );

    if (!confirmDelete) return;

    const updatedData = rows.filter(
      (row) => row.id !== editing.id
    );

    setData((prev) => ({
      ...prev,
      [type]: updatedData,
    }));

    close();
    showNotice('Record deleted successfully!');
  };

  const handleExport = () => {
    if (filtered.length === 0) {
      showNotice('No records available to export.');
      return;
    }

    exportCsv(filtered, `${type}-export.csv`);
  };

  if (!cfg) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
        Module configuration not found.
      </div>
    );
  }

  const columns = cfg.columns.map(([key, label]) => ({
    key,
    label,
  }));

  const Icon = cfg.icon;

  return (
    <div className="min-h-full space-y-6">

      {/* PAGE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-5">

        <div className="flex items-center gap-4">

          <div className="grid h-14 w-14 place-items-center rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/20 to-emerald-400/10 text-amber-300">
            <Icon size={25} />
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Workspace / {cfg.title}
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              {cfg.title}
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              {cfg.desc}
            </p>
          </div>

        </div>

        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3">
          <p className="text-[10px] font-bold tracking-wider text-emerald-300">
            TOTAL RECORDS
          </p>

          <h3 className="mt-1 text-xl font-black text-white">
            {rows.length}
          </h3>
        </div>

      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-white/10 bg-[#141D20] p-5">
          <p className="text-xs text-slate-400">
            Total Records
          </p>

          <h3 className="mt-3 text-3xl font-black text-white">
            {rows.length}
          </h3>

          <p className="mt-2 text-[10px] text-emerald-400">
            Available records
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#141D20] p-5">
          <p className="text-xs text-slate-400">
            Active Records
          </p>

          <h3 className="mt-3 text-3xl font-black text-emerald-300">
            {rows.filter((row) => row.status === 'Active' || row.status === 'Valid').length}
          </h3>

          <p className="mt-2 text-[10px] text-slate-500">
            Currently active
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#141D20] p-5">
          <p className="text-xs text-slate-400">
            Pending Records
          </p>

          <h3 className="mt-3 text-3xl font-black text-amber-300">
            {rows.filter((row) => row.status === 'Pending' || row.status === 'In Review').length}
          </h3>

          <p className="mt-2 text-[10px] text-slate-500">
            Awaiting action
          </p>
        </div>

      </div>

      {/* SUCCESS MESSAGE */}
      {notice && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300">
          <CheckCircle2 size={17} />
          {notice}
        </div>
      )}

      {/* DOCUMENT INFORMATION */}
      {type === 'documents' && (
        <div className="rounded-2xl border border-dashed border-amber-400/30 bg-gradient-to-r from-amber-400/[0.06] to-emerald-400/[0.04] p-6">

          <div className="flex flex-wrap items-center gap-4">

            <div className="grid h-14 w-14 place-items-center rounded-xl bg-amber-400/10 text-amber-300">
              <UploadCloud size={28} />
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-bold text-white">
                Document Repository
              </h3>

              <p className="mt-2 text-xs text-slate-400">
                Manage and organize franchise agreements,
                legal documents and compliance records.
              </p>
            </div>

          </div>

          <p className="mt-4 text-[10px] text-amber-300">
            Secure server-side file upload requires backend integration.
          </p>

        </div>
      )}

      {/* DATA TABLE */}
      <DataTable
        title={`${cfg.title} Records`}
        subtitle="Search, export and manage your records"
        columns={columns}
        rows={filtered}
        onAdd={handleAdd}
        addLabel={cfg.add}
        onExport={handleExport}
        search={search}
        setSearch={setSearch}
        onRowAction={handleEdit}
      />

      {/* ADD / EDIT MODAL */}
      <Modal
        open={open}
        title={editing ? `Edit ${cfg.title}` : cfg.add}
        onClose={close}
      >

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {cfg.fields.map(([key, label]) => (

              <label key={key} className="block">

                <span className="mb-2 block text-[11px] font-semibold text-slate-400">
                  {label}
                </span>

                {key === 'status' ? (

                  <select
                    value={form[key] || ''}
                    onChange={(e) =>
                      handleChange(key, e.target.value)
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0B151C] px-3 py-3 text-xs text-white outline-none focus:border-amber-400"
                    required
                  >
                    <option value="">Select Status</option>

                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}

                  </select>

                ) : (

                  <input
                    type={
                      ['start', 'expiry', 'signed', 'uploaded', 'due'].includes(key)
                        ? 'date'
                        : key === 'email'
                          ? 'email'
                          : 'text'
                    }
                    value={form[key] ?? ''}
                    onChange={(e) =>
                      handleChange(key, e.target.value)
                    }
                    placeholder={`Enter ${label}`}
                    required={!['id', 'users', 'members'].includes(key)}
                    className="w-full rounded-xl border border-white/10 bg-[#0B151C] px-3 py-3 text-xs text-white outline-none placeholder:text-slate-600 transition focus:border-amber-400"
                  />

                )}

              </label>

            ))}

          </div>

          {/* MODAL FOOTER */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">

            <div>
              {editing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/20"
                >
                  Delete Record
                </button>
              )}
            </div>

            <div className="flex gap-2">

              <button
                type="button"
                onClick={close}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-amber-500 to-yellow-300 px-5 py-2.5 text-xs font-bold text-[#101713] transition hover:-translate-y-0.5 hover:brightness-110"
              >
                {editing ? 'Save Changes' : 'Create Record'}
              </button>

            </div>

          </div>

        </form>

      </Modal>

    </div>
  );
}
