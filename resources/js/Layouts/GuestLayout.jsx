import { Link } from '@inertiajs/react';
import { BookOpenCheck, GraduationCap, Sparkles, Users } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-soft">
            {/* Left brand panel */}
            <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-blue-500 p-12 text-white lg:flex">
                <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-amber-300/20 blur-3xl" />
                <div className="pointer-events-none absolute right-24 top-1/3 h-40 w-40 rounded-full bg-white/5" />

                <Link href="/" className="relative flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-xl font-black backdrop-blur">
                        S
                    </div>
                    <div>
                        <div className="text-xl font-extrabold leading-tight">
                            Sina Bimbel
                        </div>
                        <div className="text-sm text-white/70">
                            Sistem Manajemen Bimbel
                        </div>
                    </div>
                </Link>

                <div className="relative max-w-md">
                    <h1 className="text-4xl font-extrabold leading-tight">
                        Kelola bimbel jadi lebih mudah & transparan.
                    </h1>
                    <p className="mt-4 text-base text-white/80">
                        Presensi tutor, sisa sesi, fee, penggajian, dan
                        penagihan — semua otomatis dalam satu sistem.
                    </p>

                    <div className="mt-10 space-y-4">
                        <Feature
                            icon={Users}
                            title="Presensi real-time"
                            desc="Tutor mulai & selesai mengajar dengan sekali klik"
                        />
                        <Feature
                            icon={GraduationCap}
                            title="Sisa sesi otomatis"
                            desc="Fee & sisa sesi dihitung otomatis oleh backend"
                        />
                        <Feature
                            icon={BookOpenCheck}
                            title="Notifikasi WhatsApp"
                            desc="Pengingat penagihan otomatis ke orang tua"
                        />
                    </div>
                </div>

                <div className="relative flex items-center gap-2 text-sm text-white/70">
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    © 2026 Sina Bimbel. Semua hak dilindungi.
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex w-full flex-col items-center justify-center px-6 py-10 lg:w-1/2">
                <div className="w-full max-w-md">
                    <Link
                        href="/"
                        className="mb-8 flex items-center gap-3 lg:hidden"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-lg font-black text-white">
                            S
                        </div>
                        <span className="text-xl font-extrabold text-slate-800">
                            Sina Bimbel
                        </span>
                    </Link>

                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
                        {children}
                    </div>

                    <div className="mt-6 text-center text-xs text-slate-400 lg:hidden">
                        © 2026 Sina Bimbel
                    </div>
                </div>
            </div>
        </div>
    );
}

function Feature({ icon: Icon, title, desc }) {
    return (
        <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <div className="font-bold">{title}</div>
                <div className="text-sm text-white/70">{desc}</div>
            </div>
        </div>
    );
}
