import TrackBus from '@/components/bus-map';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <TrackBus />
    </main>
  );
}