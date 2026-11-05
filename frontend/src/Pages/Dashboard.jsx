
import {
  Building2,
  Users,
  FileClock,
  IndianRupee,
  Activity,
  CalendarDays,
//   ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Clock,
  Sparkles,
  Wallet,
  Target,
  ChevronRight,
} from 'lucide-react';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
//   Cell,
} from 'recharts';

import StatCard from '../components/StatCard';

// REVENUE DATA

const revenue = [
  { m: 'Jan', v: 18 },
  { m: 'Feb', v: 22 },
  { m: 'Mar', v: 20 },
  { m: 'Apr', v: 28 },
  { m: 'May', v: 31 },
  { m: 'Jun', v: 35 },
  { m: 'Jul', v: 33 },
  { m: 'Aug', v: 41 },
  { m: 'Sep', v: 45 },
  { m: 'Oct', v: 49 },
  { m: 'Nov', v: 54 },
  { m: 'Dec', v: 62 },
];

// FRANCHISE PERFORMANCE

const mix = [
  { name: 'On Track', value: 86, color: '#D6AE50' },
  { name: 'At Risk', value: 8, color: '#F59E0B' },
  { name: 'Needs Attention', value: 6, color: '#64748B' },
];

// MAIN DASHBOARD

export default function Dashboard({ data = {} }) {

  const users = data.users || [];
  const agreements = data.agreements || [];
  const licenses = data.licenses || [];

  const active = users.filter(
    (u) => u.status === 'Active'
  ).length;

  const expiring =
    agreements.filter(
      (a) => a.status === 'Expiring Soon'
    ).length +
    licenses.filter(
      (a) => a.status === 'Expiring Soon'
    ).length;

  return (

    <div className="relative min-h-screen overflow-hidden rounded-3xl bg-gradient-to-br from-[#080F17] via-[#101C24] to-[#102C28] p-4 text-white md:p-7">

      {/* BACKGROUND GLOW EFFECTS */}

      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="pointer-events-none absolute -right-40 top-40 h-96 w-96 rounded-full bg-amber-400/10 blur-[120px]" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />


      <div className="relative z-10 space-y-7">

        {/* HEADER */}

        <div className="flex flex-wrap items-center justify-between gap-5">

          <div>

            <div className="mb-3 flex items-center gap-2">

              <Sparkles
                size={16}
                className="text-amber-400"
              />

              <span className="text-[10px] font-bold uppercase tracking-[.25em] text-amber-300">
                Franchise Management System
              </span>

            </div>

            <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">

              Dashboard

              <span className="ml-2 bg-gradient-to-r from-amber-300 to-yellow-600 bg-clip-text text-transparent">
                Overview
              </span>

            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Welcome back, Admin. Here's your business performance.
            </p>

          </div>


          <div className="flex items-center gap-3">

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-xl">

              <div className="flex items-center gap-2 text-xs text-slate-300">

                <CalendarDays
                  size={16}
                  className="text-amber-400"
                />

                November 2026

              </div>

            </div>

            <div className="hidden rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 sm:block">

              <div className="flex items-center gap-2 text-xs text-emerald-300">

                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                System Online

              </div>

            </div>

          </div>

        </div>


        {/* WELCOME BANNER */}

        <div className="relative overflow-hidden rounded-3xl border border-amber-400/20 bg-gradient-to-r from-[#253A32] via-[#24352D] to-[#172B35] p-6 shadow-2xl md:p-8">

          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border border-amber-300/10" />

          <div className="absolute -right-2 -top-12 h-48 w-48 rounded-full border border-amber-300/10" />

          <div className="relative flex flex-wrap items-center justify-between gap-5">

            <div>

              <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-[10px] font-bold tracking-widest text-amber-300">

                BUSINESS PERFORMANCE

              </span>

              <h2 className="mt-5 text-2xl font-bold text-white md:text-3xl">

                Grow Your Franchise Network

              </h2>

              <p className="mt-3 max-w-lg text-xs leading-6 text-slate-300 md:text-sm">

                Monitor your franchises, manage legal agreements,
                track revenue and keep your entire business connected
                from one powerful workspace.

              </p>

            </div>

            <div className="grid h-24 w-24 place-items-center rounded-3xl border border-amber-300/20 bg-amber-300/10 shadow-[0_0_50px_rgba(234,179,8,0.12)]">

              <Building2
                size={46}
                className="text-amber-300"
              />

            </div>

          </div>

        </div>


        {/* STATISTICS */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            label="Total Franchises"
            value="125"
            change="+12%"
            icon={Building2}
          />

          <StatCard
            label="Active Users"
            value={active + 104}
            change="+10%"
            icon={Users}
            tone="green"
          />

          <StatCard
            label="Pending Applications"
            value="17"
            change="+5%"
            icon={FileClock}
            tone="purple"
          />

          <StatCard
            label="Total Revenue"
            value="₹2.50 Cr"
            change="+18%"
            icon={IndianRupee}
            tone="blue"
          />

        </div>


        {/* REVENUE + PERFORMANCE */}

        <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">


          {/* REVENUE CHART */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-xl backdrop-blur-xl transition duration-300 hover:border-amber-400/30 md:p-6">

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

              <div>

                <div className="flex items-center gap-2">

                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-400/10 text-amber-300">

                    <Wallet size={18} />

                  </div>

                  <h3 className="font-bold text-white">
                    Revenue Analytics
                  </h3>

                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Monthly revenue performance
                </p>

              </div>

              <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">
                2026
              </span>

            </div>


            <div className="mb-5 flex items-end gap-3">

              <h2 className="text-3xl font-black text-white">
                ₹2.50 Cr
              </h2>

              <span className="mb-1 flex items-center gap-1 text-xs font-semibold text-emerald-400">

                <TrendingUp size={15} />

                +18.5%

              </span>

            </div>


            <div className="h-[280px] w-full">

              <ResponsiveContainer width="100%" height="100%">

                <AreaChart data={revenue}>

                  <defs>

                    <linearGradient
                      id="premiumGold"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#EBC04F"
                        stopOpacity={0.35}
                      />

                      <stop
                        offset="100%"
                        stopColor="#EBC04F"
                        stopOpacity={0}
                      />

                    </linearGradient>

                  </defs>


                  <CartesianGrid
                    stroke="#ffffff12"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="m"
                    stroke="#94A3B8"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10 }}
                  />

                  <YAxis
                    stroke="#94A3B8"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10 }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#14221F',
                      border: '1px solid #D6AE5040',
                      borderRadius: '14px',
                      color: '#fff',
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#EBC04F"
                    strokeWidth={3}
                    fill="url(#premiumGold)"
                    activeDot={{
                      r: 6,
                      fill: '#EBC04F',
                      stroke: '#fff',
                    }}
                  />

                </AreaChart>

              </ResponsiveContainer>

            </div>

          </div>


          {/* PERFORMANCE CHART */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-xl backdrop-blur-xl transition duration-300 hover:border-emerald-400/30 md:p-6">

            <div className="flex items-center gap-2">

              <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">

                <Target size={18} />

              </div>

              <h3 className="font-bold text-white">
                Franchise Performance
              </h3>

            </div>

            <p className="mt-2 text-xs text-slate-400">
              Network health distribution
            </p>


            <div className="relative mx-auto mt-7 h-[220px] w-[220px]">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={mix}
                    dataKey="value"
                    innerRadius={72}
                    outerRadius={100}
                    paddingAngle={5}
                    stroke="none"
                  >

                    {mix.map((item) => (

                      <Cell
                        key={item.name}
                        fill={item.color}
                      />

                    ))}

                  </Pie>

                </PieChart>

              </ResponsiveContainer>


              <div className="absolute inset-0 flex flex-col items-center justify-center">

                <span className="text-4xl font-black text-white">
                  86%
                </span>

                <span className="mt-1 text-[10px] uppercase tracking-widest text-slate-400">
                  On Track
                </span>

              </div>

            </div>


            <div className="mt-5 space-y-4">

              {mix.map((item) => (

                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >

                  <div className="flex items-center gap-3">

                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: item.color }}
                    />

                    <span className="text-xs text-slate-300">
                      {item.name}
                    </span>

                  </div>

                  <span className="text-xs font-bold text-white">
                    {item.value}%
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>


        {/* BOTTOM SECTION */}

        <div className="grid gap-5 lg:grid-cols-2">


          {/* RECENT ACTIVITIES */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-xl backdrop-blur-xl md:p-6">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <Activity
                    size={19}
                    className="text-amber-300"
                  />

                  <h3 className="font-bold text-white">
                    Recent Activities
                  </h3>

                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Latest business updates
                </p>

              </div>

              <button className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200">

                View All

                <ChevronRight size={14} />

              </button>

            </div>


            {[
              {
                title: 'New Franchise Approved',
                desc: 'Delhi Region',
                time: '2 hours ago',
                icon: Building2,
                color: 'text-emerald-300 bg-emerald-400/10',
              },
              {
                title: 'Payment Received',
                desc: '₹50,000 Payment',
                time: '3 hours ago',
                icon: IndianRupee,
                color: 'text-amber-300 bg-amber-400/10',
              },
              {
                title: 'Agreement Uploaded',
                desc: 'Chennai Central',
                time: '5 hours ago',
                icon: FileClock,
                color: 'text-sky-300 bg-sky-400/10',
              },
              {
                title: 'User Account Created',
                desc: 'Operations Department',
                time: 'Yesterday',
                icon: Users,
                color: 'text-violet-300 bg-violet-400/10',
              },
            ].map((item, index) => (

              <div
                key={index}
                className="group flex items-center gap-4 border-t border-white/5 py-4 first:border-0"
              >

                <div className={`grid h-11 w-11 place-items-center rounded-2xl ${item.color}`}>

                  <item.icon size={19} />

                </div>

                <div className="min-w-0 flex-1">

                  <h4 className="text-xs font-semibold text-white">
                    {item.title}
                  </h4>

                  <p className="mt-1 text-[11px] text-slate-500">
                    {item.desc}
                  </p>

                </div>

                <div className="flex items-center gap-1 text-[10px] text-slate-500">

                  <Clock size={12} />

                  {item.time}

                </div>

              </div>

            ))}

          </div>


          {/* LEGAL REMINDERS */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-xl backdrop-blur-xl md:p-6">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <ShieldCheck
                    size={19}
                    className="text-amber-300"
                  />

                  <h3 className="font-bold text-white">
                    Legal Reminders
                  </h3>

                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Agreement and license expiry alerts
                </p>

              </div>

              <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-[10px] font-semibold text-amber-300">

                {expiring} Alerts

              </span>

            </div>


            {[
              {
                title: 'Coimbatore North',
                desc: 'Franchise Agreement',
                date: '01 Dec 2026',
                status: 'Expiring Soon',
              },
              {
                title: 'Coimbatore North',
                desc: 'FSSAI License',
                date: '28 Nov 2026',
                status: 'Urgent',
              },
              {
                title: 'Chennai Central',
                desc: 'Trade License',
                date: '20 Feb 2027',
                status: 'Upcoming',
              },
            ].map((item, index) => (

              <div
                key={index}
                className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/[0.035] p-4 transition duration-300 hover:border-amber-400/30 hover:bg-white/[0.07]"
              >

                <div className="flex items-center gap-3">

                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400/10 text-amber-300">

                    <CalendarDays size={18} />

                  </div>

                  <div>

                    <h4 className="text-xs font-semibold text-white">
                      {item.title}
                    </h4>

                    <p className="mt-1 text-[10px] text-slate-500">
                      {item.desc}
                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <p className="text-[11px] font-bold text-amber-300">
                    {item.date}
                  </p>

                  <p className="mt-1 text-[9px] text-slate-500">
                    {item.status}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>


        {/* FOOTER */}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">

          <p className="text-[10px] text-slate-500">
            © 2026 Franchise Management CRM
          </p>

          <p className="flex items-center gap-2 text-[10px] text-slate-500">

            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            All systems operational

          </p>

        </div>

      </div>

    </div>

  );

}
