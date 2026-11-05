export const seedData = {
  users: [
    { id: 1, name: 'Arun Kumar', email: 'arun@franchisecrm.com', role: 'Admin', department: 'Operations', status: 'Active' },
    { id: 2, name: 'Priya S', email: 'priya@franchisecrm.com', role: 'Manager', department: 'Franchise', status: 'Active' },
    { id: 3, name: 'Rahul M', email: 'rahul@franchisecrm.com', role: 'Legal Executive', department: 'Legal', status: 'Active' },
    { id: 4, name: 'Divya R', email: 'divya@franchisecrm.com', role: 'Finance', department: 'Finance', status: 'Inactive' }
  ],
  roles: [
    { id: 1, name: 'Admin', description: 'Full system access', users: 2, permissions: 'All modules' },
    { id: 2, name: 'Manager', description: 'Manage franchise operations', users: 5, permissions: 'Dashboard, Franchise, Reports' },
    { id: 3, name: 'Legal Executive', description: 'Manage agreements and licenses', users: 3, permissions: 'Agreements, Documents, Licenses' },
    { id: 4, name: 'Finance', description: 'Revenue and settlements', users: 2, permissions: 'Finance, Reports' }
  ],
  departments: [
    { id: 1, name: 'Operations', head: 'Arun Kumar', members: 8, status: 'Active' },
    { id: 2, name: 'Franchise', head: 'Priya S', members: 12, status: 'Active' },
    { id: 3, name: 'Legal', head: 'Rahul M', members: 4, status: 'Active' },
    { id: 4, name: 'Finance', head: 'Divya R', members: 5, status: 'Active' }
  ],
  agreements: [
    { id: 'AGR-2026-014', franchise: 'Chennai Central', type: 'Franchise Agreement', start: '2026-01-15', expiry: '2027-01-14', owner: 'Rahul M', status: 'Active' },
    { id: 'AGR-2026-013', franchise: 'Coimbatore North', type: 'Renewal Agreement', start: '2025-12-01', expiry: '2026-12-01', owner: 'Rahul M', status: 'Expiring Soon' },
    { id: 'AGR-2026-012', franchise: 'Madurai East', type: 'Addendum', start: '2025-07-10', expiry: '2027-07-09', owner: 'Anitha K', status: 'Active' },
    { id: 'AGR-2026-011', franchise: 'Salem Hub', type: 'Franchise Agreement', start: '2024-10-01', expiry: '2026-10-01', owner: 'Rahul M', status: 'Expired' }
  ],
  contracts: [
    { id: 'CON-26018', title: 'Chennai Central Master Contract', party: 'Chennai Central', value: '₹18,00,000', signed: '2026-01-15', status: 'Signed' },
    { id: 'CON-26017', title: 'Coimbatore North Contract', party: 'Coimbatore North', value: '₹12,50,000', signed: '2025-12-01', status: 'Pending Signature' },
    { id: 'CON-26016', title: 'Madurai East Addendum', party: 'Madurai East', value: '₹8,00,000', signed: '2025-07-10', status: 'Signed' }
  ],
  documents: [
    { id: 'DOC-001', name: 'Chennai_Central_Agreement.pdf', category: 'Agreement', linkedTo: 'AGR-2026-014', uploaded: '2026-01-15', size: '2.4 MB' },
    { id: 'DOC-002', name: 'Brand_Guidelines_v3.pdf', category: 'Brand', linkedTo: 'All franchises', uploaded: '2026-02-02', size: '5.1 MB' },
    { id: 'DOC-003', name: 'Coimbatore_Trade_License.pdf', category: 'License', linkedTo: 'Coimbatore North', uploaded: '2026-03-12', size: '1.2 MB' }
  ],
  licenses: [
    { id: 'LIC-1001', franchise: 'Chennai Central', license: 'Trade License', number: 'TN-CH-88291', expiry: '2027-02-20', status: 'Valid' },
    { id: 'LIC-1002', franchise: 'Coimbatore North', license: 'FSSAI License', number: 'FSSAI-220019', expiry: '2026-11-28', status: 'Expiring Soon' },
    { id: 'LIC-1003', franchise: 'Salem Hub', license: 'Trade License', number: 'TN-SA-12008', expiry: '2026-08-10', status: 'Expired' }
  ],
  renewals: [
    { id: 'REN-001', franchise: 'Coimbatore North', item: 'Franchise Agreement', due: '2026-12-01', assigned: 'Rahul M', status: 'In Review' },
    { id: 'REN-002', franchise: 'Chennai Central', item: 'Trade License', due: '2027-02-20', assigned: 'Anitha K', status: 'Upcoming' },
    { id: 'REN-003', franchise: 'Salem Hub', item: 'Trade License', due: '2026-08-10', assigned: 'Rahul M', status: 'Overdue' }
  ]
}
