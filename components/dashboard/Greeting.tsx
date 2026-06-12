export default function Greeting({ name }: { name: string }) {
  return (
    <div className="py-2 mb-4">
      <h1 className="text-4xl font-extrabold text-[#1a2332] mb-2 tracking-tight">
        Hello, {name}!
      </h1>
      <p className="text-gray-500 font-medium text-sm">
        Ready to crush your goals today?
      </p>
    </div>
  );
}
