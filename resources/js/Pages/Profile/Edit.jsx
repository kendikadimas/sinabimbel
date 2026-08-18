import { Card, PageHeader } from '@/Components/ui';
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { UserRound } from 'lucide-react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AppLayout>
            <Head title="Profile" />

            <PageHeader
                icon={UserRound}
                title="Pengaturan Profil"
                desc="Kelola informasi akun, password, dan keamanan."
                eyebrow="Akun"
            />

            <div className="mx-auto max-w-3xl space-y-6">
                <Card>
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </Card>

                <Card>
                    <UpdatePasswordForm />
                </Card>

                <Card>
                    <DeleteUserForm />
                </Card>
            </div>
        </AppLayout>
    );
}
