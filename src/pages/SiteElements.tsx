
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

const SiteElements: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 mt-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-white">Site Elements</h1>
          <p className="text-white/80 mb-8">
            This is a visual style guide that summarizes all design components used across the site.
          </p>

          {/* Site background color */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">Site Background Color</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-dark border border-white/10"></div>
              <div>
                <p className="text-white font-mono">#0A0A0A (--background: 0 0% 4%)</p>
                <p className="text-white/70">Site background color</p>
              </div>
            </div>
          </section>
          
          <Separator className="my-8 bg-white/10" />

          {/* Text color */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">Text Color</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white border border-white/10"></div>
              <div>
                <p className="text-white font-mono">#FFFFFF (--foreground: 0 0% 100%)</p>
                <p className="text-white/70">Text color</p>
              </div>
            </div>
          </section>
          
          <Separator className="my-8 bg-white/10" />

          {/* Frames background color */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">Frames Background Color</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#1A1A1A] border border-white/10"></div>
              <div>
                <p className="text-white font-mono">#1A1A1A (--card: 0 0% 10%)</p>
                <p className="text-white/70">Frames background color</p>
              </div>
            </div>
          </section>
          
          <Separator className="my-8 bg-white/10" />

          {/* Frames ring color */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">Frames Ring Color</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#8B0000] border border-white/10"></div>
              <div>
                <p className="text-white font-mono">#8B0000 (--ring: 0 100% 27.1%)</p>
                <p className="text-white/70">Frames ring color</p>
              </div>
            </div>
          </section>
          
          <Separator className="my-8 bg-white/10" />

          {/* Footer background color */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">Footer Background Color</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-dark border border-white/10"></div>
              <div>
                <p className="text-white font-mono">#0A0A0A (--background: 0 0% 4%)</p>
                <p className="text-white/70">Footer background color</p>
              </div>
            </div>
          </section>
          
          <Separator className="my-8 bg-white/10" />

          {/* Button color */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">Button Color</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#8B0000] border border-white/10"></div>
              <div>
                <p className="text-white font-mono">#8B0000 (--primary: 0 100% 27.1%)</p>
                <p className="text-white/70">Button color</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-[#A80000] border border-white/10"></div>
              <div>
                <p className="text-white font-mono">#A80000 (hover state)</p>
                <p className="text-white/70">Button hover color</p>
              </div>
            </div>
          </section>
          
          <Separator className="my-8 bg-white/10" />

          {/* Font name */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">Font Name</h2>
            <div className="space-y-4">
              <div className="p-4 bg-[#1A1A1A] border border-[#8B0000] rounded-lg">
                <p className="text-white mb-2 font-bold">Primary Font: Inter</p>
                <p className="font-inter text-white">
                  The quick brown fox jumps over the lazy dog.
                </p>
                <p className="text-white/70 mt-2 font-mono text-sm">font-family: 'Inter', sans-serif;</p>
              </div>
              
              <div className="p-4 bg-[#1A1A1A] border border-[#8B0000] rounded-lg mt-4">
                <p className="text-white mb-2 font-bold">Secondary Font: Space Grotesk</p>
                <p className="font-space text-white">
                  The quick brown fox jumps over the lazy dog.
                </p>
                <p className="text-white/70 mt-2 font-mono text-sm">font-family: 'Space Grotesk', sans-serif;</p>
              </div>
            </div>
          </section>
          
          <Separator className="my-8 bg-white/10" />

          {/* Font color */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">Font Color</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white border border-white/10"></div>
              <div>
                <p className="text-white font-mono">#FFFFFF (--foreground: 0 0% 100%)</p>
                <p className="text-white/70">Primary font color</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-[#8B0000] border border-white/10"></div>
              <div>
                <p className="text-white font-mono">#8B0000</p>
                <p className="text-white/70">Secondary font color (accents)</p>
              </div>
            </div>
          </section>
          
          <Separator className="my-8 bg-white/10" />

          {/* Frames shadow color */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">Frames Shadow Color</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#A80000] opacity-70 border border-white/10"></div>
              <div>
                <p className="text-white font-mono">rgba(168, 0, 0, 0.7) / #A80000</p>
                <p className="text-white/70">Frame shadow color (on hover effects)</p>
              </div>
            </div>
            <div className="mt-8 p-6 bg-[#1A1A1A] border-2 border-[#8B0000] rounded-lg shadow-[0_0_8px_#A80000] text-center">
              <p className="text-white">Example element with shadow effect</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SiteElements;
