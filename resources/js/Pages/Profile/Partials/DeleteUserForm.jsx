import { Button, inputClass } from '@/Components/ui';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { ShieldAlert, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className="space-y-6">
            <header>
                <div className="flex items-center gap-2 text-rose-600">
                    <ShieldAlert className="h-5 w-5" />
                    <h2 className="text-lg font-bold text-slate-800">
                        Hapus Akun
                    </h2>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                    Setelah akun dihapus, seluruh data terkait akan terhapus
                    permanen dan tidak bisa dikembalikan.
                </p>
            </header>

            <Button variant="danger" onClick={confirmUserDeletion}>
                <Trash2 className="h-4 w-4" /> Hapus Akun
            </Button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-bold text-slate-800">
                        Yakin ingin menghapus akun?
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Setelah akun dihapus, seluruh data terkait akan terhapus
                        permanen. Masukkan password Anda untuk konfirmasi.
                    </p>

                    <div className="mt-6">
                        <input
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className={inputClass}
                            placeholder="Password"
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={closeModal}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="danger"
                            disabled={processing}
                        >
                            Hapus Akun
                        </Button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
