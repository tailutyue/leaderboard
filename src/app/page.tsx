'use client';

import { useState } from 'react';
import { Leaderboard } from '@/components/ui/leaderboard';
import Image from 'next/image';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { mockData } from '@/data/mockData';

export default function Home() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFFDF5]">
      <header className="flex justify-between items-center px-4 md:px-6 py-4 bg-white">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Waste Wise"
            width={200}
            height={50}
            priority
            className="h-8 md:h-10 w-auto"
          />
        </div>
        
        <button
          className="md:hidden p-2 hover:bg-gray-100 rounded-md"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <HamburgerMenuIcon className="h-6 w-6" />
        </button>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-[#1B4332] hover:opacity-80">Home</a>
          <a href="#" className="text-[#1B4332] hover:opacity-80">About</a>
          <a href="#" className="text-[#1B4332] hover:opacity-80">Programs</a>
          <a href="#" className="text-[#1B4332] hover:opacity-80">Contact</a>
          <button className="px-4 py-2 bg-[#1B4332] text-white rounded-md hover:bg-[#152C21]">
            Join Program
          </button>
        </nav>

        {isNavOpen && (
          <div className="fixed inset-0 bg-white z-50 md:hidden">
            <div className="p-4">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <Image
                    src="/logo.png"
                    alt="Waste Wise"
                    width={200}
                    height={50}
                    priority
                    className="h-8 md:h-10 w-auto"
                  />
                </div>
                <button
                  className="p-2 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsNavOpen(false)}
                >
                  ✕
                </button>
              </div>
              <nav className="flex flex-col gap-6">
                <a href="#" className="text-[#1B4332] text-lg hover:opacity-80">Home</a>
                <a href="#" className="text-[#1B4332] text-lg hover:opacity-80">About</a>
                <a href="#" className="text-[#1B4332] text-lg hover:opacity-80">Programs</a>
                <a href="#" className="text-[#1B4332] text-lg hover:opacity-80">Contact</a>
                <button className="mt-4 w-full px-4 py-3 bg-[#1B4332] text-white rounded-md hover:bg-[#152C21]">
                  Join Program
                </button>
              </nav>
            </div>
          </div>
        )}
      </header>

      <main>
        <Leaderboard data={mockData} />
      </main>

      <footer className="px-4 md:px-6 py-4 text-sm text-gray-600 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <p>© 2025 Waste Wise Hong Kong. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900">Terms of Service</a>
            <a href="#" className="hover:text-gray-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
