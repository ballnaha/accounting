import { Metadata } from 'next';
import AdminLayout from '@/components/layout/AdminLayout';

export const metadata: Metadata = {
  title: 'ข้อมูลบุคลากรตำรวจ | Police Position',
  description: 'จัดการข้อมูลบุคลากรตำรวจ',
};

export default function PersonnelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
