import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { MailCheck, Send } from 'lucide-react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="mb-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                    <MailCheck className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">
                    Verifikasi email Anda
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Sebelum lanjut, konfirmasi alamat email Anda melalui link
                    yang telah dikirim ke email Anda. Jika tidak menerima email,
                    kami kirimkan lagi.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    Link verifikasi baru telah dikirim ke email Anda.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        <Send className="h-4 w-4" />
                        Kirim Ulang Email
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-sm font-medium text-slate-500 underline hover:text-slate-700"
                    >
                        Log Out
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
