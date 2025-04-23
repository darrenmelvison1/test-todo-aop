import Todo from '../components/Todo';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <Todo />
      <div className="mt-4">
        <Link href="/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Go to Dashboard (Bad Practices Demo)
        </Link>
      </div>
    </main>
  );
}
