import { Button, Field, inputClass } from '@/Components/ui';
import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, UserRound } from 'lucide-react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section>
            <header>
                <div className="flex items-center gap-2 text-blue-700">
                    <UserRound className="h-5 w-5" />
                    <h2 className="text-lg font-bold text-slate-800">
                        Informasi Profil
                    </h2>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                    Perbarui informasi akun dan alamat email Anda.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-5">
                <Field label="Nama" required>
                    <input
                        id="name"
                        className={inputClass}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </Field>

                <Field label="Email" required>
                    <input
                        id="email"
                        type="email"
                        className={inputClass}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </Field>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        Alamat email Anda belum diverifikasi.
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="ms-1 font-semibold text-amber-700 underline hover:text-amber-800"
                        >
                            Klik di sini untuk kirim ulang email verifikasi.
                        </Link>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-emerald-700">
                                Link verifikasi baru telah dikirim ke email Anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={processing}>
                        Simpan
                    </Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="flex items-center gap-1.5 text-sm text-emerald-600">
                            <CheckCircle2 className="h-4 w-4" /> Tersimpan.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
