import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-6">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">
                    Lupa password?
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Masukkan email Anda, kami kirim link untuk mengatur ulang
                    password.
                </p>
            </div>

            {status && (
                <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <InputLabel htmlFor="email" value="Email" />
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    placeholder="nama@contoh.com"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="mt-6">
                    <PrimaryButton className="w-full" disabled={processing}>
                        <Mail className="h-4 w-4" />
                        Kirim Link Reset
                    </PrimaryButton>
                </div>
            </form>

            <Link
                href={route('login')}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600"
            >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke halaman masuk
            </Link>
        </GuestLayout>
    );
}
