

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Globe,
} from 'lucide-react';

import Logo from '../components/Logo';

export default function Login() {

  const [show, setShow] = useState(false);

  const [email, setEmail] = useState('admin@franchisecrm.com');

  const [password, setPassword] = useState('admin123');

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const [remember, setRemember] = useState(true);

  const navigate = useNavigate();


  // LOGIN FUNCTION

  const submit = (e) => {

    e.preventDefault();

    setError('');

    if (!email || !password) {

      setError('Please enter your email and password.');

      return;

    }

    setLoading(true);

    setTimeout(() => {

      localStorage.setItem('franchise-crm-auth', 'true');

      if (remember) {
        localStorage.setItem('franchise-crm-email', email);
      }

      navigate('/dashboard');

    }, 800);

  };


  return (

    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#080F17] via-[#101C24] to-[#102C28] text-white">


      {/* BACKGROUND EFFECTS */}

      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[130px]" />

      <div className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-amber-400/10 blur-[130px]" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />


      {/* MAIN CONTENT */}

      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">


        {/* LEFT BRANDING SECTION */}

        <div className="relative hidden flex-col justify-between overflow-hidden border-r border-white/10 p-10 lg:flex xl:p-16">


          {/* DECORATIVE CIRCLES */}

          <div className="absolute -right-20 top-20 h-[500px] w-[500px] rounded-full border border-amber-300/10" />

          <div className="absolute -right-10 top-32 h-[400px] w-[400px] rounded-full border border-emerald-300/10" />

          <div className="absolute right-10 top-48 h-[300px] w-[300px] rounded-full border border-amber-300/10" />


          {/* LOGO */}

          <div className="relative z-10">

            <Logo />

          </div>


          {/* BRANDING CONTENT */}

          <div className="relative z-10 max-w-xl">


            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2">

              <Sparkles
                size={15}
                className="text-amber-300"
              />

              <span className="text-[10px] font-bold tracking-[.2em] text-amber-300">

                GROW · MANAGE · SUCCEED

              </span>

            </div>


            <h1 className="text-5xl font-black leading-tight xl:text-6xl">

              Build a stronger

              <span className="mt-2 block bg-gradient-to-r from-amber-200 via-yellow-400 to-emerald-300 bg-clip-text text-transparent">

                Franchise Network.

              </span>

            </h1>


            <p className="mt-7 max-w-md text-sm leading-8 text-slate-400">

              One intelligent workspace to manage your people,
              agreements, compliance and business performance.

              Experience smarter franchise management with
              powerful business insights.

            </p>


            {/* FEATURE CARDS */}

            <div className="mt-10 grid grid-cols-3 gap-3">


              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition hover:border-amber-400/30">

                <Building2
                  size={21}
                  className="mb-4 text-amber-300"
                />

                <h3 className="text-2xl font-black text-white">
                  125+
                </h3>

                <p className="mt-1 text-[10px] text-slate-500">
                  Franchises
                </p>

              </div>


              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition hover:border-emerald-400/30">

                <Users
                  size={21}
                  className="mb-4 text-emerald-300"
                />

                <h3 className="text-2xl font-black text-white">
                  18+
                </h3>

                <p className="mt-1 text-[10px] text-slate-500">
                  Regions
                </p>

              </div>


              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition hover:border-sky-400/30">

                <TrendingUp
                  size={21}
                  className="mb-4 text-sky-300"
                />

                <h3 className="text-2xl font-black text-white">
                  98%
                </h3>

                <p className="mt-1 text-[10px] text-slate-500">
                  Performance
                </p>

              </div>

            </div>


            {/* FEATURES */}

            <div className="mt-10 space-y-4">

              {[
                'Smart Franchise Management',
                'Agreement & Legal Document Tracking',
                'Advanced Business Analytics',
              ].map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-3 text-xs text-slate-300"
                >

                  <CheckCircle2
                    size={16}
                    className="text-emerald-400"
                  />

                  {item}

                </div>

              ))}

            </div>

          </div>


          {/* FOOTER */}

          <div className="relative z-10 flex items-center gap-2 text-[10px] text-slate-500">

            <ShieldCheck
              size={15}
              className="text-amber-300"
            />

            Secure · Reliable · Scalable

            <span className="mx-2">|</span>

            <Globe size={13} />

            Enterprise Workspace

          </div>


        </div>


        {/* RIGHT LOGIN SECTION */}

        <div className="flex min-h-screen items-center justify-center p-5 sm:p-10">


          <div className="w-full max-w-md">


            {/* MOBILE LOGO */}

            <div className="mb-12 lg:hidden">

              <Logo />

            </div>


            {/* LOGIN CARD */}

            <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-2xl sm:p-9">


              {/* LOGIN HEADER */}

              <div className="mb-8">


                <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-amber-300/20 bg-gradient-to-br from-amber-400/20 to-emerald-400/10 text-amber-300 shadow-[0_0_35px_rgba(234,179,8,0.12)]">

                  <LockKeyhole size={25} />

                </div>


                <p className="text-[10px] font-bold tracking-[.3em] text-amber-300">

                  WELCOME BACK

                </p>


                <h2 className="mt-3 text-3xl font-black text-white">

                  Sign in to your

                  <span className="block text-emerald-300">

                    Workspace.

                  </span>

                </h2>


                <p className="mt-3 text-xs leading-6 text-slate-400">

                  Enter your credentials to access your
                  Franchise Management CRM portal.

                </p>

              </div>


              {/* LOGIN FORM */}

              <form
                onSubmit={submit}
                className="space-y-5"
              >


                {/* EMAIL */}

                <div>

                  <label className="mb-2 block text-xs font-medium text-slate-300">

                    Email Address

                  </label>


                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0B151C]/80 px-4 py-3.5 transition focus-within:border-amber-400/60 focus-within:shadow-[0_0_20px_rgba(234,179,8,0.08)]">

                    <Mail
                      size={17}
                      className="text-slate-500"
                    />


                    <input

                      type="email"

                      value={email}

                      onChange={(e) => setEmail(e.target.value)}

                      placeholder="name@company.com"

                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"

                      required

                    />

                  </div>

                </div>


                {/* PASSWORD */}

                <div>

                  <label className="mb-2 block text-xs font-medium text-slate-300">

                    Password

                  </label>


                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0B151C]/80 px-4 py-3.5 transition focus-within:border-amber-400/60 focus-within:shadow-[0_0_20px_rgba(234,179,8,0.08)]">

                    <LockKeyhole
                      size={17}
                      className="text-slate-500"
                    />


                    <input

                      type={show ? 'text' : 'password'}

                      value={password}

                      onChange={(e) => setPassword(e.target.value)}

                      placeholder="Enter your password"

                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"

                      required

                    />


                    <button

                      type="button"

                      onClick={() => setShow(!show)}

                      className="text-slate-500 transition hover:text-amber-300"

                    >

                      {show
                        ? <EyeOff size={17} />
                        : <Eye size={17} />
                      }

                    </button>

                  </div>

                </div>


                {/* ERROR */}

                {error && (

                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">

                    {error}

                  </div>

                )}


                {/* REMEMBER PASSWORD */}

                <div className="flex items-center justify-between text-xs">


                  <label className="flex cursor-pointer items-center gap-2 text-slate-400">

                    <input

                      type="checkbox"

                      checked={remember}

                      onChange={(e) => setRemember(e.target.checked)}

                      className="h-4 w-4 accent-yellow-500"

                    />

                    Remember me

                  </label>


                  <button

                    type="button"

                    onClick={() => setError('Please contact your administrator to reset your password.')}

                    className="font-medium text-amber-300 transition hover:text-amber-200"

                  >

                    Forgot Password?

                  </button>

                </div>


                {/* LOGIN BUTTON */}

                <button

                  type="submit"

                  disabled={loading}

                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 py-4 text-sm font-bold text-[#101713] shadow-[0_8px_30px_rgba(214,165,46,0.15)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(214,165,46,0.25)] disabled:cursor-not-allowed disabled:opacity-60"

                >

                  {loading ? 'Signing In...' : 'Sign In'}

                  {!loading && (

                    <ArrowRight
                      size={18}
                      className="transition group-hover:translate-x-1"
                    />

                  )}

                </button>


              </form>


              {/* DEMO CREDENTIALS */}

              <div className="mt-7 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4">


                <div className="flex items-center gap-2">

                  <ShieldCheck
                    size={16}
                    className="text-amber-300"
                  />

                  <p className="text-xs font-bold text-amber-300">

                    Demo Access

                  </p>

                </div>


                <div className="mt-3 space-y-2 text-[11px] text-slate-400">

                  <p>
                    Email:
                    <span className="ml-2 text-white">
                      admin@franchisecrm.com
                    </span>
                  </p>

                  <p>
                    Password:
                    <span className="ml-2 text-white">
                      admin123
                    </span>
                  </p>

                </div>


              </div>


              {/* BOTTOM */}

              <div className="mt-7 flex items-center justify-center gap-2 text-[10px] text-slate-500">

                <ShieldCheck
                  size={13}
                  className="text-emerald-400"
                />

                Secure Franchise Management Portal

              </div>


            </div>


            {/* COPYRIGHT */}

            <p className="mt-7 text-center text-[10px] text-slate-600">

              © 2026 Franchise Management CRM. All rights reserved.

            </p>


          </div>

        </div>

      </div>

    </div>

  );

}
