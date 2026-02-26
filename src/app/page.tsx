import GardenDashboard from '@/components/GardenDashboard';
import users from '@/data/users.json';

export default function Home() {
  // Demo với dữ liệu của anh Vinh
  const demoData = users["tienvinh0108@gmail.com"];

  return (
    <main className="min-h-screen">
      <GardenDashboard initialData={demoData} />
    </main>
  );
}
