import ThreeDotLoader from '@/components/ThreeDotLoader';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none select-none">
      <ThreeDotLoader size="md" />
    </div>
  );
}
