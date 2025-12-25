'use client';

/* eslint-disable react/no-unescaped-entities */

// Screen 5: Article detail/landing page
// Lenny's Newsletter article content

import Image from "next/image";
import { Header } from "@/components/Header";

export default function Screen5() {
  return (
    <div className="min-h-screen bg-white flex flex-col w-full max-w-md mx-auto relative">
      <Header showPlayButton={true} />
      
      {/* Photo-illustration */}
      <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Image - replace src with actual article image URL */}
        <div className="w-full h-full relative">
          <Image
            src="https://substackcdn.com/image/fetch/w_1200,h_600,c_fill,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fdefault.png"
            alt="A builder's guide to living a long and healthy life"
            fill
            className="object-cover"
            unoptimized
            priority
          />
        </div>
      </div>

      {/* Article metadata and content */}
      <div className="px-3 sm:px-4 py-3 sm:py-4 flex-1">
        <h1 className="text-[24pt] sm:text-[28pt] font-bold mb-2 sm:mb-3 leading-tight text-black break-words font-atlantic-condensed" style={{ fontFamily: 'Atlantic Condensed, Georgia, serif' }}>
          A builder's guide to living a long and healthy life
        </h1>
        
        <p className="text-sm sm:text-base text-gray-700 mb-2 sm:mb-3 leading-relaxed break-words italic" style={{ fontFamily: 'Georgia, serif' }}>
          For something a little different
        </p>
        
        <div className="flex justify-between items-center mb-1.5 sm:mb-2">
          <p className="text-xs sm:text-sm text-gray-600 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            By Justin Mares
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider break-words flex-shrink-0" style={{ fontFamily: 'monospace' }}>
            OCT 28, 2025
          </p>
        </div>
      </div>

      {/* Article content */}
      <div className="flex-1 px-3 sm:px-4 pb-32 sm:pb-28 overflow-y-auto">
        <div className="max-w-none">
          {/* Initial cap paragraph */}
          <p className="text-base sm:text-lg leading-relaxed mb-3 sm:mb-4 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            <span className="text-5xl sm:text-6xl font-serif float-left leading-none mr-2 pt-1">S</span>
            <span className="text-sm sm:text-base leading-relaxed">
              ince turning 40, I've felt a lot less invincible. For the first time in my life, my annual bloodwork results weren't 100% healthy. A few months ago, I broke my pinkie toe on the edge of a wall. Last month, I sprained my wrist trying to adjust an A/C unit. Last week, I banged up my knee after slipping on a staircase.
            </span>
          </p>
          
          <p className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            Then I took a toxins screen and learned I'm half-man, half-plastic. So over the past year I've started getting serious about my health: tracking my nutrition, exercising, experimenting with supplements, focusing on my sleep, etc. Along that journey, I came across Justin Mares.
          </p>
          
          <p className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            Unlike the health folks everyone knows—Andrew Huberman, Rhonda Patrick, Bryan Johnson—Justin is a full-time builder. He co-founded Kettle & Fire, Perfect Keto, Surely, and now Truemed, and he's basically a health nerd who spends hundreds of hours researching what to buy for himself and his family and shares what he learns in blog posts and tweets. When I decide what products to buy and which brands to trust, I've found myself <em className="italic">constantly</em> referencing his recommendations, more than anyone else's.
          </p>
          
          <p className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            But I've always wanted more. So I pitched Justin on putting together a comprehensive and specific list of his favorite products and brands—the safest, least toxic, and highest-quality products he himself buys for clothing, sleep, food, toxin mitigation, and more. This is what you'll find below.
          </p>
          
          <p className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            In 2011, I was working for my first company while also taking a full college course load. As a committed Tim Ferriss acolyte, I read a blog post about polyphasic sleep. For a whole month, I slept 3.5 hours a night and took a 20-minute nap every four hours, even if that meant leaving class or coming late to a fraternity party.
          </p>
          
          <p className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            This was insane. After a month of polyphasic sleep—and two crash-outs where I slept 18 hours in a row to recover—I realized it wasn't for me. But what <em className="italic">was</em> for me, and what I've mostly stuck to in the 14 years since, is the paleo diet, which I decided to do after reading about it in the same blog post.
          </p>
          
          <p className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            I went paleo for two weeks my junior year of college (yes, I was the weird kid who would pass on the pizza and beer). And during this two-week experiment, my acne disappeared, I got leaner, slept better, and just had more energy.
          </p>
          
          <p className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            As it turns out, what you put in your body affects how you feel! If you're not healthy, you're not able to perform at your best, period. This is why so many in Silicon Valley are so obsessed with sleep tracking, diet, and other tools to help improve performance at work.
          </p>
          
          <p className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            Unfortunately, the West is in the throes of a chronic disease crisis. Americans today are the sickest population of humans to ever exist. Nearly 50% of adults have prediabetes or diabetes, 73% are obese or overweight, and the richest American men live 15 years longer than the poorest, almost entirely due to chronic disease burden. Diabetes alone has an economic cost of around $106 billion.
          </p>
          
          <p className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            In this post, I won't cover traditional health tips (exercise, get eight hours of sleep, etc.), though they're crucial. Instead, I want to cover some of the lesser-known health gotchas that consistently sap your health.
          </p>

          <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 mt-4 sm:mt-5 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            Sleep
          </h2>
          
          <p className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            Getting good sleep is among the most critical things you can do to improve your health and set yourself up for peak work performance. There's a ton of literature on why sleep is so important, but for the purposes of this post I'll assume you're already a believer.
          </p>
          
          <p className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            In my view, the 80/20 of sleep health boils down to three things:
          </p>
          
          <ol className="list-decimal list-inside space-y-2 mb-3 sm:mb-4 ml-2" style={{ fontFamily: 'Georgia, serif' }}>
            <li className="text-sm sm:text-base leading-relaxed">Exercise during the day</li>
            <li className="text-sm sm:text-base leading-relaxed">Get morning sunlight</li>
            <li className="text-sm sm:text-base leading-relaxed">Optimize your sleep setup (no external light, quiet, low CO2, cold) as much as possible</li>
          </ol>
          
          <p className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            Beyond the basics, I've found a few products that really help me get my best sleep. I love my Eight Sleep, and have found their pod works <em className="italic">incredibly</em> well to help me both increase my deep sleep and avoid wake-ups. For those who have trouble falling and staying asleep, magnesium has been shown to radically improve sleep quality. I think the Momentous magnesium L-threonate supplement is the best out there.
          </p>
          
          <p className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            Studies have found that mattresses can be a source of harmful chemicals (especially foam ones), as they emit phthalates, benzophenones, and other compounds that have been linked to asthma, developmental issues, and reproductive harm. Sadly, many of these chemicals have not been thoroughly tested (thanks to the insane way we regulate chemicals in the U.S.), but the few studies we do have are concerning.
          </p>

          <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 mt-4 sm:mt-5 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            Supplements
          </h2>
          
          <p className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            Many supplements are a waste of time and money. Much (most?) of what you'll find on Amazon is probably fake, overhyped, or doesn't have enough effective ingredients to do anything. A recent consumer test found that 4 of 6 creatine gummy brands contained no creatine at all!
          </p>
          
          <p className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            For almost everyone, getting core nutrients and amino acids from whole food sources is <em className="italic">far</em> superior to getting them from supplements. That said, many folks are still missing some of the building blocks the body requires to thrive. That's where supplements can come in, to . . . <em className="italic">supplement</em> the diet. Some I like and recommend:
          </p>
          
          <p className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            <strong className="font-semibold">Protein powder:</strong> Protein is key, and most Americans don't get anywhere close to the recommended 0.36 grams per pound of body weight. For those looking to increase protein intake, Equip is probably my favorite protein powder, with the Momentous whey a close second. I would recommend avoiding plant protein powders, as they (1) basically don't work and are not bioavailable, and (2) are often made from pea or soybean protein, which is among the most pesticide-sprayed crops out there.
          </p>
          
          <p className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            <strong className="font-semibold">Creatine:</strong> Creatine is a naturally occurring amino acid stored in muscles and the brain that helps with energy creation. It's been safely used by bodybuilders since time immemorial and is increasingly associated with a host of mental performance benefits. Pretty much the only creatine I would buy is Momentous, as they are one of the only non-Chinese-sourced brands out there.
          </p>
          
          <p className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            <strong className="font-semibold">Nattokinase:</strong> This is a new compound that I am very bullish on. Heart disease is the leading cause of death in the U.S., and 70% to 80% of heart attacks are caused by atherosclerotic plaque. Certain dosages of nattokinase (at least 10,000 fibrinolytic units) were found to be more effective than statins at reducing arterial plaque, a significant contributor to heart disease.
          </p>

          <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 mt-4 sm:mt-5 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            Toxin mitigation
          </h2>
          
          <p className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            In my view, environmental toxins are the trans fats of our generation. PFAS, phthalates, endocrine-disrupting chemicals, pesticides, and heavy metals are everywhere. They're in your clothing, detergents, soap, shampoo, paint, furniture, water, and air. As of this writing, 92% of Americans have measurable phthalates in their body and 97% have PFAS in their blood.
          </p>
          
          <p className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            These chemicals have been shown to affect testosterone levels, anxiety, cancer risk, and even sperm count. Some researchers believe that they even have a role to play in the fact that girls are hitting puberty one to two years sooner than they were 40 years ago.
          </p>
        </div>
      </div>
    </div>
  );
}

