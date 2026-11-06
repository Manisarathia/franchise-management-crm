// Franchise Enquiries & Lead Pipeline Data Store

const ENQUIRIES_KEY = 'franchise-crm-task2-enquiries';
const LEADS_KEY = 'franchise-crm-task2-leads';

export const initialEnquiries = [
  {
    id: 'ENQ-2026-001',
    name: 'Suresh Narayanan',
    email: 'suresh.n@gmail.com',
    phone: '+91 98410 23412',
    city: 'Chennai',
    state: 'Tamil Nadu',
    territory: 'OMR - IT Corridor',
    investmentRange: '₹25 - ₹35 Lakhs',
    experience: '12 years in Retail & F&B Operations',
    source: 'Official Website',
    receivedDate: '2026-11-01',
    status: 'New',
    notes: 'Interested in opening a flagship cafe express unit near Sholinganallur. Has commercial space available.'
  },
  {
    id: 'ENQ-2026-002',
    name: 'Kavitha Sundaram',
    email: 'kavitha.sundaram@hotmail.com',
    phone: '+91 94432 87654',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    territory: 'RS Puram & Gandhipuram',
    investmentRange: '₹40 - ₹50 Lakhs',
    experience: 'Owns 2 multi-brand footwear stores',
    source: 'Franchise India Expo',
    receivedDate: '2026-11-03',
    status: 'Under Review',
    notes: 'Looking for exclusive territory rights for Coimbatore West. Financial credentials shared.'
  },
  {
    id: 'ENQ-2026-003',
    name: 'Mohammed Rafi',
    email: 'rafi.business@yahoo.com',
    phone: '+91 97890 11223',
    city: 'Madurai',
    state: 'Tamil Nadu',
    territory: 'KK Nagar Area',
    investmentRange: '₹15 - ₹25 Lakhs',
    experience: 'Supermarket distributor for 8 years',
    source: 'LinkedIn Campaign',
    receivedDate: '2026-11-04',
    status: 'Contacted',
    notes: 'Spoke on call. Sent presentation deck and initial ROI breakdown. Follow-up scheduled.'
  },
  {
    id: 'ENQ-2026-004',
    name: 'Anand Venkatesh',
    email: 'anand.v@techprocorp.com',
    phone: '+91 99620 44556',
    city: 'Bangalore',
    state: 'Karnataka',
    territory: 'Whitefield',
    investmentRange: '₹50+ Lakhs',
    experience: 'Ex-Tech VP looking for full-time business',
    source: 'Direct Referral',
    receivedDate: '2026-10-28',
    status: 'Converted',
    notes: 'Converted to qualified lead after executive discovery call. Looking at Multi-Unit Model.'
  },
  {
    id: 'ENQ-2026-005',
    name: 'Deepak Rajan',
    email: 'deepak.rajan92@gmail.com',
    phone: '+91 90030 99887',
    city: 'Salem',
    state: 'Tamil Nadu',
    territory: 'Fairlands Hub',
    investmentRange: '₹10 - ₹15 Lakhs',
    experience: 'First-time entrepreneur',
    source: 'Instagram Ad',
    receivedDate: '2026-10-29',
    status: 'Dropped',
    notes: 'Budget does not meet minimum capital requirement. Added to nurture list for future kiosk model.'
  },
  {
    id: 'ENQ-2026-006',
    name: 'Revathi Swaminathan',
    email: 'revathi.s@outlook.com',
    phone: '+91 98841 55667',
    city: 'Trichy',
    state: 'Tamil Nadu',
    territory: 'Thillai Nagar',
    investmentRange: '₹25 - ₹35 Lakhs',
    experience: 'Managed family textile retail',
    source: 'Official Website',
    receivedDate: '2026-11-05',
    status: 'New',
    notes: 'Submitted enquiry through landing page form. Requested callback between 4-6 PM.'
  }
];

export const initialLeads = [
  {
    id: 'LED-2026-001',
    name: 'Anand Venkatesh',
    email: 'anand.v@techprocorp.com',
    phone: '+91 99620 44556',
    enquiryId: 'ENQ-2026-004',
    city: 'Bangalore',
    state: 'Karnataka',
    territory: 'Whitefield & Marathahalli',
    tier: 'Multi-Unit Franchise',
    investmentCapacity: '₹60,00,000',
    priority: 'High',
    stage: 'Due Diligence',
    leadScore: 92,
    assignedTo: 'Franchise Sales Director',
    createdDate: '2026-10-29',
    nextFollowUp: '2026-11-09',
    notes: 'Background check complete. Net worth verified. Legal disclosure documents sent for review.'
  },
  {
    id: 'LED-2026-002',
    name: 'Rajesh Subramaniam',
    email: 'rajesh.subra@enterprise.in',
    phone: '+91 98401 77889',
    enquiryId: null,
    city: 'Chennai',
    state: 'Tamil Nadu',
    territory: 'Anna Nagar West',
    tier: 'Flagship Store',
    investmentCapacity: '₹45,00,000',
    priority: 'High',
    stage: 'Application Sent',
    leadScore: 88,
    assignedTo: 'Franchise Sales Director',
    createdDate: '2026-10-22',
    nextFollowUp: '2026-11-08',
    notes: 'Application form dispatched. Prime corner property identified with high footfall.'
  },
  {
    id: 'LED-2026-003',
    name: 'Meenakshi Iyer',
    email: 'meenakshi.iyer@gmail.com',
    phone: '+91 94440 33221',
    enquiryId: null,
    city: 'Kochi',
    state: 'Kerala',
    territory: 'Panampilly Nagar',
    tier: 'Single Unit Express',
    investmentCapacity: '₹25,00,000',
    priority: 'Medium',
    stage: 'Initial Discussion',
    leadScore: 74,
    assignedTo: 'Priya S (Franchise Operations)',
    createdDate: '2026-11-02',
    nextFollowUp: '2026-11-10',
    notes: 'Introductory pitch deck presented. Interested in express takeaway format.'
  },
  {
    id: 'LED-2026-004',
    name: 'Vijay Karthik',
    email: 'vijay.karthik@vkenterprises.com',
    phone: '+91 97909 66554',
    enquiryId: null,
    city: 'Hyderabad',
    state: 'Telangana',
    territory: 'Gachibowli & Madhapur',
    tier: 'Master Franchise',
    investmentCapacity: '₹1,20,00,000',
    priority: 'High',
    stage: 'Presentation / Meeting',
    leadScore: 95,
    assignedTo: 'Franchise Sales Director',
    createdDate: '2026-10-18',
    nextFollowUp: '2026-11-07',
    notes: 'In-person meeting scheduled at headquarters for master territory agreement negotiation.'
  },
  {
    id: 'LED-2026-005',
    name: 'Gopalakrishnan Nair',
    email: 'gk.nair@tradehub.in',
    phone: '+91 98845 22110',
    enquiryId: null,
    city: 'Tirunelveli',
    state: 'Tamil Nadu',
    territory: 'Palayamkottai',
    tier: 'Kiosk Model',
    investmentCapacity: '₹18,00,000',
    priority: 'Low',
    stage: 'New Prospect',
    leadScore: 58,
    assignedTo: 'Arun Kumar (CRM Executive)',
    createdDate: '2026-11-04',
    nextFollowUp: '2026-11-12',
    notes: 'Initial data gathered. Waiting on location feasibility assessment.'
  }
];

export function loadEnquiries() {
  try {
    const saved = localStorage.getItem(ENQUIRIES_KEY);
    return saved ? JSON.parse(saved) : initialEnquiries;
  } catch {
    return initialEnquiries;
  }
}

export function saveEnquiries(data) {
  try {
    localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save enquiries to localStorage', err);
  }
}

export function loadLeads() {
  try {
    const saved = localStorage.getItem(LEADS_KEY);
    return saved ? JSON.parse(saved) : initialLeads;
  } catch {
    return initialLeads;
  }
}

export function saveLeads(data) {
  try {
    localStorage.setItem(LEADS_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save leads to localStorage', err);
  }
}

export function convertEnquiryToLead(enquiry) {
  const currentLeads = loadLeads();
  const currentEnquiries = loadEnquiries();

  // Create new lead
  const newLeadId = `LED-2026-${String(currentLeads.length + 1).padStart(3, '0')}`;
  const newLead = {
    id: newLeadId,
    name: enquiry.name,
    email: enquiry.email,
    phone: enquiry.phone,
    enquiryId: enquiry.id,
    city: enquiry.city,
    state: enquiry.state || 'Tamil Nadu',
    territory: enquiry.territory || enquiry.city,
    tier: 'Single Unit Express',
    investmentCapacity: enquiry.investmentRange,
    priority: 'High',
    stage: 'New Prospect',
    leadScore: 80,
    assignedTo: 'Franchise Sales Director',
    createdDate: new Date().toISOString().split('T')[0],
    nextFollowUp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: `Converted directly from enquiry ${enquiry.id}. ${enquiry.notes || ''}`
  };

  // Update enquiry status to Converted
  const updatedEnquiries = currentEnquiries.map((item) =>
    item.id === enquiry.id ? { ...item, status: 'Converted' } : item
  );

  const updatedLeads = [newLead, ...currentLeads];

  saveEnquiries(updatedEnquiries);
  saveLeads(updatedLeads);

  return { newLead, updatedEnquiries, updatedLeads };
}

export function exportToCsv(data, filename = 'export.csv') {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((key) => `"${String(row[key] ?? '').replaceAll('"', '""')}"`)
        .join(',')
    )
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

