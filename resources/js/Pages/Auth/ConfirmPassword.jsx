import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="mb-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                    <ShieldCheck className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">
                    Konfirmasi password
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Ini area aman aplikasi. Konfirmasi password Anda untuk
                    melanjutkan.
                </p>
            </div>

            <form onSubmit={submit}>
                <InputLabel htmlFor="password" value="Password" />

                <TextInput
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    placeholder="••••••••"
                    isFocused={true}
                    onChange={(e) => setData('password', e.target.value)}
                />

                <InputError message={errors.password} className="mt-2" />

                <div className="mt-6">
                    <PrimaryButton className="w-full" disabled={processing}>
                        Konfirmasi
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
