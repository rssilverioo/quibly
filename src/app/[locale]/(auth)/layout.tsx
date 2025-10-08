"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0D12]">
      <div className="w-full max-w-md bg-[#11141A] rounded-2xl shadow-lg p-8 border border-[#1E212A]">
        {children}
      </div>
    </div>
  );
}
