import { Card, PageHeader, Table } from '@/Components/ui';
import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';

const actionColor = {
    create: 'bg-green-100 text-green-700',
    update: 'bg-blue-100 text-blue-700',
    delete: 'bg-red-100 text-red-700',
    sent:   'bg-emerald-100 text-emerald-700',
};

export default function ActivityLog({ logs }) {
    return (
        <AppLayout>
            <PageHeader
                icon={ClipboardList}
                title="Log Aktivitas"
                desc="Rekam jejak semua operasi CRUD — siapa, apa, kapan."
                eyebrow="Audit"
                gradient="from-slate-600 via-slate-700 to-slate-800"
            />

            <Card padding={false}>
                <Table
                    head={['Waktu', 'Oleh', 'Aksi', 'Keterangan']}
                    empty="Belum ada log aktivitas."
                >
                    {logs.data.map((l) => (
                        <tr key={l.id} className="transition hover:bg-slate-50/70">
                            <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                                {new Date(l.created_at).toLocaleString('id-ID')}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                                {l.user?.name ?? <span className="text-slate-300">sistem</span>}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${actionColor[l.action] ?? 'bg-slate-100 text-slate-600'}`}>
                                    {l.action}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-700">
                                {l.description}
                            </td>
                        </tr>
                    ))}
                </Table>
            </Card>

            {logs.last_page > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    {Array.from({ length: logs.last_page }, (_, i) => i + 1).map((p) => (
                        <Link
                            key={p}
                            href={route('admin.log', { page: p })}
                            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                                p === logs.current_page
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            {p}
                        </Link>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
