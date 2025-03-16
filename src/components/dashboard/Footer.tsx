"use client";
import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-[#13111b] text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">BlockViz</h3>
            <p className="text-sm">
              Empowering blockchain analysis with powerful visualization tools and real-time analysis
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <div className="space-y-2 text-sm">
              <div>
                <Link href="/search" className="hover:text-white">
                  Search Address
                </Link>
              </div>
              <div>
                <Link href="/visualization" className="hover:text-white">
                  Visualization
                </Link>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <div className="space-y-2 text-sm">
              <div>
                <Link href="https://github.com/Arlphuongy/blockviz" className="hover:text-white">
                  Documentation
                </Link>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <div className="space-y-2 text-sm">
              <div>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-8 pt-8 border-t border-gray-800">
          <p className="text-sm">©2025 BlockViz. All rights reserved</p>
        </div>
      </footer>
  );
}