'use client';

/* eslint-disable react/no-unescaped-entities */

// Screen 2: Article reading view with "View More" section
// Matches second screenshot: article content with "Explore the September 2025 Issue" section

import { Header } from "@/components/Header";
import { mockArticle } from "@/mock/article";

export default function Screen2() {
  return (
    <div className="min-h-screen bg-white flex flex-col w-full max-w-md mx-auto">
      <Header />
      
      {/* Article content */}
      <div className="flex-1 px-3 sm:px-4 pb-6 overflow-y-auto">
        <div className="max-w-none pt-2">
          <p className="text-sm sm:text-base leading-relaxed mb-4 break-words">
            Von Braun had always dreamed of venturing deeper into the galaxy. Back in 1949, before he emerged as the godfather of the American space program, he spilled his fantasies onto the page, in a novel titled <em className="italic underline">Project Mars</em>. He described how a new form of government would take hold on the red planet: a technocracy capable of the biggest and boldest things. At the helm of this Martian state would sit a supreme leader, known as the Elon.
          </p>
          
          {/* Divider */}
          <div className="h-px bg-black mb-4 sm:mb-6 my-4 sm:my-6"></div>
          
          {/* Explore Issue Section */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold mb-2 text-black break-words">Explore the September 2025 Issue</h3>
            <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4 leading-relaxed break-words">
              Check out more from this issue and find your next story to read.
            </p>
          </div>
          
          <p className="text-sm sm:text-base leading-relaxed break-words">
            Whatever the truth of this origin story, Elon Musk has seized on von Braun's prophecy as his destiny. Since the founding of SpaceX in 2002, his business decisions and political
          </p>
        </div>
      </div>
    </div>
  );
}

