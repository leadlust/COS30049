"use client";
import Navbar from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Wallet Transaction Visualizer
          </h1>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}