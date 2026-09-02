import { Children } from 'react';

export function PageHeader({ icon: Icon, title, desc, eyebrow, action, gradient = 'from-blue-600 via-indigo-600 to-blue-700' }) {
    return (
        <div
            className={`relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r ${gradient} p-6 text-white shadow-lg sm:p-8`}
        >
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-12 right-32 h-32 w-32 rounded-full bg-amber-400/20 blur-2xl" />
            <div className="relative flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur sm:flex">
                        <Icon className="h-7 w-7" />
                    </div>
                    <div>
                        {eyebrow && (
                            <div className="text-xs font-bold uppercase tracking-widest text-white/70">
                                {eyebrow}
                            </div>
                        )}
                        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                            {title}
                        </h1>
                        {desc && (
                            <p className="mt-1 max-w-xl text-sm text-white/80">
                                {desc}
                            </p>
                        )}
                    </div>
                </div>
                {action}
            </div>
        </div>
    );
}

export function Card({ children, className = '', padding = true }) {
    return (
        <div
            className={`rounded-2xl border border-slate-200/60 bg-white shadow-soft ${
                padding ? 'p-6' : ''
            } ${className}`}
        >
            {children}
        </div>
    );
}

export function CardHeader({ title, subtitle, action }) {
    return (
        <div className="mb-5 flex items-start justify-between gap-4">
            <div>
                <h3 className="text-base font-bold text-slate-800">{title}</h3>
                {subtitle && (
                    <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
                )}
            </div>
            {action}
        </div>
    );
}

export function StatCard({ icon: Icon, label, value, tone = 'blue', hint }) {
    const tones = {
        blue: 'from-blue-500 to-blue-700',
        sky: 'from-sky-400 to-cyan-600',
        indigo: 'from-indigo-500 to-violet-700',
        yellow: 'from-amber-400 to-orange-500',
        orange: 'from-orange-500 to-red-600',
        green: 'from-emerald-500 to-emerald-700',
        teal: 'from-teal-500 to-emerald-700',
        pink: 'from-pink-500 to-rose-600',
        red: 'from-rose-500 to-red-700',
        navy: 'from-slate-700 to-slate-900',
    };
    // Tone terang yang butuh teks gelap agar kontras terjaga.
    const dark = ['yellow', 'sky', 'orange'].includes(tone);
    const darkTone = {
        yellow: 'text-amber-950',
        sky: 'text-cyan-950',
        orange: 'text-orange-950',
    }[tone];

    return (
        <div
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${tones[tone]} p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
        >
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-6 h-24 w-24 rounded-full bg-black/10" />
            <div className="relative flex items-center justify-between">
                <div>
                    <div
                        className={`text-xs font-bold uppercase tracking-wider ${
                            dark ? `${darkTone}/70` : 'text-white/70'
                        }`}
                    >
                        {label}
                    </div>
                    <div
                        className={`mt-2 text-3xl font-extrabold tracking-tight ${
                            dark ? darkTone : 'text-white'
                        }`}
                    >
                        {value}
                    </div>
                    {hint && (
                        <div
                            className={`mt-1 text-xs ${
                                dark ? `${darkTone}/70` : 'text-white/60'
                            }`}
                        >
                            {hint}
                        </div>
                    )}
                </div>
                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                        dark ? 'bg-black/15 text-white' : 'bg-white/25 text-white'
                    }`}
                >
                    <Icon className="h-6 w-6" strokeWidth={2.2} />
                </div>
            </div>
        </div>
    );
}

export function Badge({ children, tone = 'slate', className = '' }) {
    const tones = {
        slate: 'bg-slate-100 text-slate-600',
        blue: 'bg-blue-100 text-blue-700',
        green: 'bg-emerald-100 text-emerald-700',
        red: 'bg-rose-100 text-rose-700',
        yellow: 'bg-amber-100 text-amber-800',
        navy: 'bg-slate-100 text-slate-700',
        white: 'bg-white/15 text-white',
    };

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]} ${className}`}
        >
            {children}
        </span>
    );
}

export function Button({
    children,
    variant = 'primary',
    className = '',
    ...props
}) {
    const variants = {
        primary:
            'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-md shadow-blue-600/30',
        secondary:
            'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
        yellow:
            'bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 shadow-md shadow-amber-500/30',
        ghost: 'text-slate-600 hover:bg-slate-100',
        danger:
            'bg-gradient-to-r from-rose-600 to-red-500 text-white hover:from-rose-700 hover:to-red-600 shadow-md shadow-rose-600/30',
    };

    return (
        <button
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.97] disabled:opacity-50 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export function Table({ head, children, empty }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
                <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-indigo-50/60">
                        {head.map((h, i) => (
                            <th
                                key={i}
                                className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-blue-800/70"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {children}
                    {empty && Children.count(children) === 0 && (
                        <tr>
                            <td
                                colSpan={head.length}
                                className="px-6 py-14 text-center text-sm text-slate-400"
                            >
                                {empty}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export function Field({ label, children, required }) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                {label}
                {required && <span className="text-rose-500"> *</span>}
            </label>
            {children}
        </div>
    );
}

export const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

export function PageTip({ title = 'Tips', tips = [] }) {
    if (!tips.length) return null;
    return (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                </svg>
                {title}
            </div>
            <ul className="space-y-2">
                {tips.map((t, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-600">
                        <span className="mt-0.5 shrink-0 text-blue-400">›</span>
                        {t}
                    </li>
                ))}
            </ul>
        </div>
    );
}
