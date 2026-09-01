import { Badge, Button, Card, Field, inputClass, PageHeader, PageTip, Table } from '@/Components/ui';
import Modal from '@/Components/Modal';
import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';
import { BookOpen, DollarSign, GraduationCap, Pencil, Plus, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function SettingsIndex({ mataPelajaran, kurikulum, rateKelas }) {
    const [mapelModal, setMapelModal] = useState(false);
    const [editingMapel, setEditingMapel] = useState(null);
    const [kurikulumModal, setKurikulumModal] = useState(false);
    const [editingKurikulum, setEditingKurikulum] = useState(null);
    const [rateModal, setRateModal] = useState(false);
    const [editingRate, setEditingRate] = useState(null);

    const mapelForm = useForm({ nama: '' });
    const kurikulumForm = useForm({ nama: '' });
    const rateForm = useForm({ kelas: '', nominal_per_sesi: '' });

    function openMapelCreate() { setEditingMapel(null); mapelForm.reset(); setMapelModal(true); }
    function openMapelEdit(m) { setEditingMapel(m); mapelForm.setData({ nama: m.nama }); setMapelModal(true); }
    function submitMapel(e) {
        e.preventDefault();
        if (editingMapel) {
            mapelForm.patch(route('admin.mapel.update', editingMapel.id), { onSuccess: () => setMapelModal(false) });
        } else {
            mapelForm.post(route('admin.mapel.store'), { onSuccess: () => setMapelModal(false) });
        }
    }
    function destroyMapel(m) {
        if (confirm(`Hapus mata pelajaran "${m.nama}"?`)) {
            mapelForm.delete(route('admin.mapel.destroy', m.id));
        }
    }

    function openKurikulumCreate() { setEditingKurikulum(null); kurikulumForm.reset(); setKurikulumModal(true); }
    function openKurikulumEdit(k) { setEditingKurikulum(k); kurikulumForm.setData({ nama: k.nama }); setKurikulumModal(true); }
    function submitKurikulum(e) {
        e.preventDefault();
        if (editingKurikulum) {
            kurikulumForm.patch(route('admin.kurikulum.update', editingKurikulum.id), { onSuccess: () => setKurikulumModal(false) });
        } else {
            kurikulumForm.post(route('admin.kurikulum.store'), { onSuccess: () => setKurikulumModal(false) });
        }
    }
    function destroyKurikulum(k) {
        if (confirm(`Hapus kurikulum "${k.nama}"?`)) {
            kurikulumForm.delete(route('admin.kurikulum.destroy', k.id));
        }
    }

    function openRateCreate() { setEditingRate(null); rateForm.reset(); setRateModal(true); }
    function openRateEdit(r) { setEditingRate(r); rateForm.setData({ kelas: r.kelas, nominal_per_sesi: r.nominal_per_sesi }); setRateModal(true); }
    function submitRate(e) {
        e.preventDefault();
        if (editingRate) {
            rateForm.patch(route('admin.rate-kelas.update', editingRate.id), { onSuccess: () => setRateModal(false) });
        } else {
            rateForm.post(route('admin.rate-kelas.store'), { onSuccess: () => setRateModal(false) });
        }
    }
    function destroyRate(r) {
        if (confirm(`Hapus rate kelas "${r.kelas}"?`)) {
            rateForm.delete(route('admin.rate-kelas.destroy', r.id));
        }
    }

    return (
        <AppLayout>
            <PageHeader
                icon={Settings}
                title="Settings"
                desc="Kelola master data mata pelajaran dan kurikulum."
                eyebrow="Konfigurasi"
                gradient="from-slate-600 via-slate-700 to-slate-800"
            />

            {/* Mata Pelajaran */}
            <Card className="mb-6">
                <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-800">Mata Pelajaran</h3>
                            <p className="text-sm text-slate-500">Daftar mapel yang tersedia di form siswa</p>
                        </div>
                    </div>
                    <Button onClick={openMapelCreate}>
                        <Plus className="h-4 w-4" /> Tambah
                    </Button>
                </div>

                {mataPelajaran.length === 0 ? (
                    <div className="rounded-xl border-2 border-dashed border-amber-200 bg-amber-50 p-6 text-center">
                        <p className="text-sm font-medium text-amber-700">Belum ada mata pelajaran. Tambahkan dulu agar form siswa bisa diisi.</p>
                    </div>
                ) : (
                    <Table head={['Nama', 'Aksi']} empty="Belum ada data.">
                        {mataPelajaran.map((m) => (
                            <tr key={m.id} className="transition hover:bg-slate-50/70">
                                <td className="px-6 py-4 font-medium text-slate-800">{m.nama}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => openMapelEdit(m)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => destroyMapel(m)}>
                                            <Trash2 className="h-4 w-4 text-rose-500" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </Table>
                )}
            </Card>

            {/* Kurikulum */}
            <Card>
                <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-800">Kurikulum</h3>
                            <p className="text-sm text-slate-500">Daftar kurikulum yang tersedia di form siswa</p>
                        </div>
                    </div>
                    <Button onClick={openKurikulumCreate}>
                        <Plus className="h-4 w-4" /> Tambah
                    </Button>
                </div>

                {kurikulum.length === 0 ? (
                    <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                        <p className="text-sm text-slate-500">Belum ada kurikulum. Kurikulum bersifat opsional.</p>
                    </div>
                ) : (
                    <Table head={['Nama', 'Aksi']} empty="Belum ada data.">
                        {kurikulum.map((k) => (
                            <tr key={k.id} className="transition hover:bg-slate-50/70">
                                <td className="px-6 py-4 font-medium text-slate-800">{k.nama}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => openKurikulumEdit(k)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => destroyKurikulum(k)}>
                                            <Trash2 className="h-4 w-4 text-rose-500" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </Table>
                )}
            </Card>

            {/* Modal Mata Pelajaran */}
            <Modal show={mapelModal} onClose={() => setMapelModal(false)} title={editingMapel ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}>
                <form onSubmit={submitMapel}>
                    <Field label="Nama Mata Pelajaran" required error={mapelForm.errors.nama}>
                        <input
                            className={inputClass}
                            value={mapelForm.data.nama}
                            onChange={(e) => mapelForm.setData('nama', e.target.value)}
                            placeholder="mis. Bahasa Inggris"
                            autoFocus
                        />
                    </Field>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={() => setMapelModal(false)}>Batal</Button>
                        <Button type="submit" disabled={mapelForm.processing}>{editingMapel ? 'Simpan' : 'Tambah'}</Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Kurikulum */}
            <Modal show={kurikulumModal} onClose={() => setKurikulumModal(false)} title={editingKurikulum ? 'Edit Kurikulum' : 'Tambah Kurikulum'}>
                <form onSubmit={submitKurikulum}>
                    <Field label="Nama Kurikulum" required error={kurikulumForm.errors.nama}>
                        <input
                            className={inputClass}
                            value={kurikulumForm.data.nama}
                            onChange={(e) => kurikulumForm.setData('nama', e.target.value)}
                            placeholder="mis. Merdeka Belajar"
                            autoFocus
                        />
                    </Field>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={() => setKurikulumModal(false)}>Batal</Button>
                        <Button type="submit" disabled={kurikulumForm.processing}>{editingKurikulum ? 'Simpan' : 'Tambah'}</Button>
                    </div>
                </form>
            </Modal>
            {/* Rate Kelas */}
            <Card className="mb-6">
                <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
                            <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-800">Rate Kelas</h3>
                            <p className="text-sm text-slate-500">Nominal fee per sesi berdasarkan kelas</p>
                        </div>
                    </div>
                    <Button onClick={openRateCreate}>
                        <Plus className="h-4 w-4" /> Tambah
                    </Button>
                </div>

                {rateKelas.length === 0 ? (
                    <div className="rounded-xl border-2 border-dashed border-amber-200 bg-amber-50 p-6 text-center">
                        <p className="text-sm font-medium text-amber-700">Belum ada rate kelas. Tambahkan agar fee presensi bisa dihitung.</p>
                    </div>
                ) : (
                    <Table head={['Kelas', 'Nominal per Sesi', 'Aksi']} empty="Belum ada data.">
                        {rateKelas.map((r) => (
                            <tr key={r.id} className="transition hover:bg-slate-50/70">
                                <td className="px-6 py-4 font-medium text-slate-800">{r.kelas}</td>
                                <td className="px-6 py-4 text-slate-600">
                                    Rp {Number(r.nominal_per_sesi).toLocaleString('id-ID')}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => openRateEdit(r)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => destroyRate(r)}>
                                            <Trash2 className="h-4 w-4 text-rose-500" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </Table>
                )}
            </Card>

            {/* Modal Rate Kelas */}
            <Modal show={rateModal} onClose={() => setRateModal(false)} title={editingRate ? 'Edit Rate Kelas' : 'Tambah Rate Kelas'}>
                <form onSubmit={submitRate}>
                    <Field label="Nama Kelas" required error={rateForm.errors.kelas}>
                        <input
                            className={inputClass}
                            value={rateForm.data.kelas}
                            onChange={(e) => rateForm.setData('kelas', e.target.value)}
                            placeholder="mis. 8 SMP"
                            autoFocus
                        />
                    </Field>
                    <Field label="Nominal per Sesi (Rp)" required error={rateForm.errors.nominal_per_sesi}>
                        <input
                            type="number"
                            className={inputClass}
                            value={rateForm.data.nominal_per_sesi}
                            onChange={(e) => rateForm.setData('nominal_per_sesi', e.target.value)}
                            placeholder="mis. 35000"
                            min="0"
                        />
                    </Field>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={() => setRateModal(false)}>Batal</Button>
                        <Button type="submit" disabled={rateForm.processing}>{editingRate ? 'Simpan' : 'Tambah'}</Button>
                    </div>
                </form>
            </Modal>

            <PageTip title="Tips Settings" tips={[
                'Isi dulu Mata Pelajaran dan Kurikulum sebelum daftarkan siswa — keduanya dipakai di dropdown form siswa.',
                'Rate Kelas menjadi nilai default saat buat paket sesi baru — set sebelum mulai operasional.',
                'Perubahan rate kelas tidak mempengaruhi paket sesi yang sudah ada.',
                'Hapus mata pelajaran/kurikulum hanya jika belum dipakai di data siswa manapun.',
            ]} />
        </AppLayout>
    );
}
