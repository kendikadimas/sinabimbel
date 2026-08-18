import { Button, Field, inputClass } from '@/Components/ui';
import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { CheckCircle2, KeyRound } from 'lucide-react';
import { useRef } from 'react';

export default function UpdatePasswordForm() {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section>
            <header>
                <div className="flex items-center gap-2 text-blue-700">
                    <KeyRound className="h-5 w-5" />
                    <h2 className="text-lg font-bold text-slate-800">
                        Perbarui Password
                    </h2>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                    Gunakan password panjang dan acak agar akun tetap aman.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-5">
                <Field label="Password Saat Ini" required>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className={inputClass}
                        autoComplete="current-password"
                    />
                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </Field>

                <Field label="Password Baru" required>
                    <input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className={inputClass}
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </Field>

                <Field label="Konfirmasi Password" required>
                    <input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        type="password"
                        className={inputClass}
                        autoComplete="new-password"
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </Field>

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
