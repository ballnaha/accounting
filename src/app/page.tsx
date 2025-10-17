import AdminLayout from '@/components/layout/AdminLayout';
import ProfessionalDashboard from '@/components/dashboard/ProfessionalDashboard';
import RoleGuard from '@/components/common/RoleGuard';

export default function Home() {
  return (
    <RoleGuard requiredRole="admin">
      <AdminLayout>
        <ProfessionalDashboard />
      </AdminLayout>
    </RoleGuard>
  );
}
