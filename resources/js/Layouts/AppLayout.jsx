import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    Check,
    FileSpreadsheet,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    Menu,
    ReceiptText,
    Settings,
    UserRound,
    Users,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';

const adminNav = [
    {
        label: 'Dashboard',
        href: 'admin.dashboard',
        icon: LayoutDashboard,
        active: 'admin.dashboard',
    },
    {
        label: 'Tutor',
        href: 'admin.tutor.index',
        icon: Users,
        active: 'admin.tutor*',
    },
    {
        label: 'Siswa & Paket',
        href: 'admin.siswa.index',
        icon: GraduationCap,
        active: 'admin.siswa*',
    },
    {
        label: 'Penagihan',
        href: 'admin.penagihan',
        icon: ReceiptText,
        active: 'admin.penagihan*',
    },
    {
        label: 'Rekap & Penggajian',
        href: 'admin.rekap',
        icon: Wallet,
        active: 'admin.rekap*',
    },
    {
        label: 'Notifikasi WA',
        href: 'admin.notifikasi',
        icon: Bell,
        active: 'admin.notifikasi',
    },
    {
        label: 'Settings',
        href: 'admin.settings',
        icon: Settings,
        active: 'admin.settings*',
    },
];

const tutorNav = [
    {
        label: 'Dashboard',
        href: 'tutor.dashboard',
        icon: LayoutDashboard,
        active: 'tutor.dashboard',
    },
    {
        label: 'Riwayat Mengajar',
        href: 'tutor.riwayat',
        icon: FileSpreadsheet,
        active: 'tutor.riwayat',
    },
];

export default function AppLayout({ children }) {
    const user = usePage().props.auth.user;
    const [open, setOpen] = useState(false);
    const nav = user.role === 'admin' ? adminNav : tutorNav;

    const Sidebar = (
        <div className="relative flex h-full flex-col overflow-hidden bg-gradient-to-b from-blue-800 via-blue-700 to-indigo-800 text-white">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-400/10 blur-2xl" />
                <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
            </div>

            <div className="relative flex items-center gap-3 px-6 pb-8 pt-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-lg font-black text-white shadow-lg shadow-amber-500/30">
                    S
                </div>
                <div>
                    <div className="text-lg font-extrabold leading-tight text-white">
                        Sina Bimbel
                    </div>
                    <div className="text-xs font-medium text-blue-100/70">
                        Management System
                    </div>
                </div>
            </div>

            <div className="relative px-6 pb-2 text-[11px] font-bold uppercase tracking-widest text-blue-100/50">
                Menu
            </div>
            <nav className="relative flex-1 space-y-1.5 px-4">
                {nav.map((item) => {
                    const isActive = route().current(item.active);
                    return (
                        <Link
                            key={item.href}
                            href={route(item.href)}
                            onClick={() => setOpen(false)}
                            className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                                isActive
                                    ? 'bg-white text-blue-800 shadow-lg shadow-blue-900/30'
                                    : 'bg-white/10 text-white hover:bg-white/20 hover:shadow-md'
                            }`}
                        >
                            <item.icon
                                className={`h-5 w-5 shrink-0 ${
                                    isActive
                                        ? 'text-amber-500'
                                        : 'text-blue-100 group-hover:text-white'
                                }`}
                            />
                            {item.label}
                            {isActive && (
                                <span className="ms-auto h-2 w-2 rounded-full bg-amber-400" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="relative m-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-white">
                        {user.name
                            .split(' ')
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold text-white">
                            {user.name}
                        </div>
                        <div className="text-xs capitalize text-blue-100/70">
                            {user.role}
                        </div>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="rounded-lg p-2 text-blue-100/70 transition hover:bg-rose-500/30 hover:text-white"
                        title="Logout"
                    >
                        <LogOut className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50">
            {/* Sidebar desktop */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 lg:block">
                {Sidebar}
            </aside>

            {/* Sidebar mobile */}
            {open && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />
                    <aside className="absolute inset-y-0 left-0 w-72">
                        {Sidebar}
                    </aside>
                </div>
            )}

            {/* Main */}
            <div className="lg:pl-72">
                {/* Top bar */}
                <div className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-blue-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50/60 px-4 backdrop-blur-md sm:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setOpen(true)}
                            className="rounded-lg p-2 text-blue-700 hover:bg-blue-100 lg:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
                            <UserRound className="h-4 w-4" />
                            <span className="capitalize">{user.role}</span>
                        </div>
                    </div>
                    <Link
                        href={route('profile.edit')}
                        className="hidden items-center gap-2 rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 sm:flex"
                    >
                        <UserRound className="h-4 w-4 text-blue-600" />
                        Profil
                    </Link>
                </div>

                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
                    <Flash />
                    {children}
                </main>
            </div>
        </div>
    );
}

function Flash() {
    const { flash, errors } = usePage().props;

    return (
        <div className="mb-6 space-y-3">
            {flash?.success && (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <Check className="h-4 w-4" />
                    </span>
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white">
                        !
                    </span>
                    {flash.error}
                </div>
            )}
            {errors && Object.values(errors).length > 0 && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    {Object.values(errors).map((e) => (
                        <div key={e}>• {e}</div>
                    ))}
                </div>
            )}
        </div>
    );
}
