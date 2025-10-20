import ImportPersonnelClient from './ImportPersonnelClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'นำเข้าข้อมูลบุคลากร | Police Position',
  description: 'นำเข้าข้อมูลบุคลากรตำรวจจากไฟล์ Excel',
};

export default function ImportPersonnelPage() {
  return <ImportPersonnelClient />;
}
