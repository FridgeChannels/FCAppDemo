'use client';

// Screen 1: Article reading view with playback controls at bottom
// Matches first screenshot: article content with "NOW PLAYING" button and playback controls

import { useState, useEffect, useRef } from 'react';
import { Header } from "@/components/Header";
import { articles } from "@/mock/articles";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AudioPlayerModal } from "@/components/AudioPlayerModal";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { SUMMARY_PROMPT } from "@/lib/articleConfig";
import { slugify } from '@/lib/slug';

export default function Screen1() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false); // Mock: 订阅状态
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [screenHeight, setScreenHeight] = useState(0);
  const [titleFontSizes, setTitleFontSizes] = useState<{ [key: number]: number }>({});
  const [isGeneratingNewsletter, setIsGeneratingNewsletter] = useState(false);
  const [ttsText, setTtsText] = useState<string>('');
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [ttsTitle, setTtsTitle] = useState<string>('');
  const [ttsProgress, setTtsProgress] = useState(0);
  const [ttsCurrentTime, setTtsCurrentTime] = useState(0); // Current time in seconds
  const [ttsDuration, setTtsDuration] = useState(0); // Total duration in seconds
  const [articleSummaries, setArticleSummaries] = useState<{ [key: number]: string }>({});
  const [newsletterTitle, setNewsletterTitle] = useState<string>('');
  const [showPlaybackControls, setShowPlaybackControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRefs = useRef<{ [key: number]: HTMLHeadingElement | null }>({});
  const isScrollingRef = useRef(false);
  const touchStartYRef = useRef(0);
  const touchEndYRef = useRef(0);
  const isTouchingRef = useRef(false);
  const currentIndexRef = useRef(currentIndex);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentArticle = articles[currentIndex];

  // Keep currentIndexRef in sync with currentIndex
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Calculate actual screen height dynamically
  useEffect(() => {
    const updateHeight = () => {
      // Use window.innerHeight for actual viewport height (excluding browser UI)
      const height = window.innerHeight;
      setScreenHeight(height);
    };

    // Set initial height
    updateHeight();

    // Listen for resize events
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  // Reset font sizes on window resize
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      // Reset font sizes to recalculate
      setTitleFontSizes({});
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Adjust title font size to fit within 4 lines (hidden during calculation)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const adjustTitleFontSize = (articleId: number) => {
      const titleElement = titleRefs.current[articleId];
      if (!titleElement) return;

      // Check if title has content before adjusting
      const hasContent = titleElement.textContent && titleElement.textContent.trim().length > 0;
      if (!hasContent) {
        // If no content, wait a bit and try again
        setTimeout(() => {
          adjustTitleFontSize(articleId);
        }, 100);
        return;
      }

      // Hide element during calculation
      titleElement.style.visibility = 'hidden';
      titleElement.style.opacity = '0';

      // Reset to initial size
      const baseSize = window.innerWidth >= 640 ? 40 : 35;
      let fontSize = baseSize;
      titleElement.style.fontSize = `${fontSize}pt`;

      // Check if title exceeds 4 lines - calculate synchronously
      const calculateOptimalSize = () => {
        // Force reflow
        titleElement.offsetHeight;
        
        // Get computed line height
        const computedStyle = window.getComputedStyle(titleElement);
        const lineHeightValue = computedStyle.lineHeight;
        const lineHeight = lineHeightValue === 'normal' 
          ? fontSize * 1.2 
          : parseFloat(lineHeightValue);
        
        const maxHeight = lineHeight * 4;
        let actualHeight = titleElement.scrollHeight;

        // Quickly find optimal size
        while (actualHeight > maxHeight && fontSize > 20) {
          fontSize -= 1;
          titleElement.style.fontSize = `${fontSize}pt`;
          // Force reflow
          titleElement.offsetHeight;
          actualHeight = titleElement.scrollHeight;
        }

        // Set final size and show element
        setTitleFontSizes(prev => ({ ...prev, [articleId]: fontSize }));
        titleElement.style.visibility = 'visible';
        titleElement.style.opacity = '1';
      };

      // Wait for DOM to render, then calculate and show
      setTimeout(() => {
        calculateOptimalSize();
      }, 50);
    };

    // Adjust font size for current article and next one (for smooth transition)
    const currentArticle = articles[currentIndex];
    if (currentArticle) {
      // Wait for newsletter title to load if it's the first article
      if (currentIndex === 0 && !newsletterTitle) {
        // Wait a bit longer for newsletter title to load
        setTimeout(() => {
          adjustTitleFontSize(currentArticle.id);
        }, 200);
      } else {
        adjustTitleFontSize(currentArticle.id);
      }
      if (currentIndex < articles.length - 1) {
        setTimeout(() => {
          adjustTitleFontSize(articles[currentIndex + 1].id);
        }, 200);
      }
    }
  }, [currentIndex, screenHeight, newsletterTitle]);

  const handleViewFullIssue = () => {
    if (isSubscribed) {
      // 已付费用户，直接跳转
      router.push('/screen5');
    } else {
      // 未付费用户，显示订阅弹窗
      setShowSubscriptionModal(true);
    }
  };

  const handleSubscribe = () => {
    // Mock: 付费成功
    setIsSubscribed(true);
    setShowSubscriptionModal(false);
    // 跳转到screen5
    router.push('/screen5');
  };

  const handleCloseModal = () => {
    setShowSubscriptionModal(false);
  };

  const handlePlaybackClick = () => {
    setShowAudioPlayer(true);
  };

  const handleCloseAudioPlayer = () => {
    setShowAudioPlayer(false);
  };

  // Generate AI text from newsletter URL using the provided prompt
  const generateNewsletterContent = async (url: string, articleTitle?: string): Promise<{ summary: string; title: string }> => {
    // In production, this would:
    // 1. Fetch newsletter content from URL
    // 2. Extract title from newsletter
    // 3. Use LLM API (like OpenAI) with SUMMARY_PROMPT to generate summary
    // 4. Return the generated 2-minute summary text and title
    
    // Mock implementation - replace with actual API call
    const prompt = SUMMARY_PROMPT.replace('{ARTICLE_URL}', url);
    
    // TODO: Replace with actual API call
    // const response = await fetch('/api/generate-summary', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ url, prompt })
    // });
    // const data = await response.json();
    // return { summary: data.summary, title: data.title };
    
    // Mock response matching the prompt format and actual article content
    // Based on "A builder's guide to living a long and healthy life" by Justin Mares
    if (url.includes('builders-guide-to-living-a-long')) {
      return {
        title: "A BUILDER'S GUIDE\nTO LIVING A LONG\nAND HEALTHY LIFE",
        summary: `What if the secret to peak performance wasn't in your code, but in what you put in your body? Justin Mares, a serial entrepreneur who's built multiple successful companies, shares his decade-long journey of discovering that health is the foundation of everything. After learning he was "half-man, half-plastic" from a toxins screen, he dove deep into finding the safest, highest-quality products for sleep, supplements, food, and toxin mitigation. This isn't generic health advice—it's a curated list of specific brands and products that a builder actually uses, from Eight Sleep mattresses to Momentous supplements. You'll discover why 92% of Americans have phthalates in their body, how to avoid the toxins hiding in everyday products, and which brands you can actually trust. But here's what makes this different: these aren't recommendations from health gurus, but from someone who's spent thousands of hours researching products for his own family. So the question is: are you unknowingly sabotaging your health with the products you use every day?`
      };
    }
    
    // Default mock response for other articles - use article title for consistency
    const title = articleTitle || '';
    return {
      title: title,
      summary: `What if you could unlock insights that transform how you think about this topic? This article explores key concepts and practical applications that could change your perspective. Through real-world examples and expert analysis, you'll discover actionable strategies and thought-provoking ideas. The content breaks down complex topics into digestible insights that anyone can understand and apply. But here's what makes it compelling: it doesn't just tell you what to think—it shows you how to think differently. So the real question is: are you ready to challenge your assumptions and see things in a new light?`
    };
  };

  // Handle newsletter URL submission (can be called programmatically)
  const handleNewsletterGenerate = async (url: string, articleId?: number) => {
    setIsGeneratingNewsletter(true);
    try {
      const result = await generateNewsletterContent(url);
      
      // Store summary for the article if articleId is provided
      if (articleId !== undefined) {
        setArticleSummaries(prev => ({ ...prev, [articleId]: result.summary }));
        // Store newsletter title for first article (id: 1)
        if (articleId === 1 && result.title) {
          setNewsletterTitle(result.title);
        }
      }
      
      setTtsText(result.summary);
      // Use newsletter title if available, otherwise use hostname
      if (result.title) {
        setTtsTitle(result.title.split('\n')[0]);
      } else {
        const hostname = url.startsWith('http') ? new URL(url).hostname : url;
        setTtsTitle(`Newsletter Summary: ${hostname}`);
      }
      
      // Start TTS playback automatically
      setTimeout(() => {
        startTTSPlayback(result.summary);
      }, 500);
    } catch (error) {
      console.error('Error generating newsletter content:', error);
      alert('Failed to generate newsletter summary. Please try again.');
    } finally {
      setIsGeneratingNewsletter(false);
    }
  };

  // Generate and play summary for current article when page changes
  useEffect(() => {
    const currentArticle = articles[currentIndex];
    if (!currentArticle) return;

    // Use newsletter URL for first article, mock URL for others (same logic for all)
    const newsletterUrl = currentIndex === 0 
      ? 'https://www.lennysnewsletter.com/p/a-builders-guide-to-living-a-long'
      : 'https://example.com/newsletter'; // Mock URL for other articles
    const isFirstArticle = currentIndex === 0;
    
    // Stop any current playback first
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlayingTTS(false);
      setTtsProgress(0);
      setTtsCurrentTime(0);
      setTtsDuration(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
    
    // All articles use the same logic: generate/use summary and play TTS
    if (articleSummaries[currentArticle.id]) {
      // Use cached summary
      const cachedSummary = articleSummaries[currentArticle.id];
      setTtsText(cachedSummary);
      const displayTitle = isFirstArticle && newsletterTitle 
        ? newsletterTitle.split('\n')[0] 
        : currentArticle.audioTitle;
      setTtsTitle(displayTitle);
      
      // Start TTS playback automatically
      setTimeout(() => {
        startTTSPlayback(cachedSummary);
      }, 300);
    } else {
      // Generate new summary - all articles use same logic
      setIsGeneratingNewsletter(true);
      generateNewsletterContent(newsletterUrl, currentArticle.title)
        .then((result) => {
          setArticleSummaries(prev => ({ ...prev, [currentArticle.id]: result.summary }));
          if (isFirstArticle && result.title) {
            setNewsletterTitle(result.title);
          }
          setTtsText(result.summary);
          // Use newsletter title for first article, audioTitle for others
          const displayTitle = isFirstArticle && result.title 
            ? result.title.split('\n')[0] 
            : currentArticle.audioTitle;
          setTtsTitle(displayTitle);
          
          // Start TTS playback automatically
          setTimeout(() => {
            startTTSPlayback(result.summary);
          }, 300);
        })
        .catch((error) => {
          console.error('Error generating newsletter content:', error);
        })
        .finally(() => {
          setIsGeneratingNewsletter(false);
        });
    }
  }, [currentIndex, articleSummaries, newsletterTitle]);

  // Auto-generate summary for the first article on mount
  useEffect(() => {
    if (articles.length === 0) return;
    const newsletterUrl = 'https://www.lennysnewsletter.com/p/a-builders-guide-to-living-a-long';
    const firstArticle = articles[0];
    
    setIsGeneratingNewsletter(true);
    generateNewsletterContent(newsletterUrl)
      .then((result) => {
        setArticleSummaries(prev => ({ ...prev, [firstArticle.id]: result.summary }));
        if (result.title) {
          setNewsletterTitle(result.title);
        }
        setTtsText(result.summary);
        setTtsTitle(result.title ? result.title.split('\n')[0] : firstArticle.title.split('\n')[0]);
        
        // Start TTS playback automatically
        setTimeout(() => {
          startTTSPlayback(result.summary);
        }, 500);
      })
      .catch((error) => {
        console.error('Error generating newsletter content:', error);
      })
      .finally(() => {
        setIsGeneratingNewsletter(false);
      });
  }, []);

  // Export function for external use (e.g., from conversation)
  useEffect(() => {
    // Make function available globally for conversation interface
    if (typeof window !== 'undefined') {
      (window as any).generateNewsletterAudio = handleNewsletterGenerate;
    }
  }, []);

  // Start TTS playback
  const startTTSPlayback = (text: string, startTime: number = 0) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Stop any existing speech
    if (synthRef.current) {
      synthRef.current.cancel();
    }

    synthRef.current = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsPlayingTTS(true);
      setShowPlaybackControls(true);
      
      // Update progress
      const fullDuration = ttsText.length / 10; // Full text duration
      const remainingDuration = text.length / 10; // Remaining text duration
      setTtsDuration(fullDuration);
      
      const interval = 100; // Update every 100ms
      let elapsed = startTime;
      
      progressIntervalRef.current = setInterval(() => {
        elapsed += interval / 1000;
        const progress = Math.min((elapsed / fullDuration) * 100, 100);
        setTtsProgress(progress);
        setTtsCurrentTime(elapsed);
      }, interval);
    };

    utterance.onend = () => {
      setIsPlayingTTS(false);
      setTtsProgress(100);
      setTtsCurrentTime(ttsDuration);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };

    utterance.onerror = (error) => {
      console.error('TTS error:', error);
      setIsPlayingTTS(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  // Toggle TTS playback
  const toggleTTSPlayback = () => {
    if (!synthRef.current || !utteranceRef.current) return;

    if (isPlayingTTS) {
      synthRef.current.pause();
      setIsPlayingTTS(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    } else {
      synthRef.current.resume();
      setIsPlayingTTS(true);
      setShowPlaybackControls(true);
    }
  };

  // Stop TTS playback
  const stopTTSPlayback = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlayingTTS(false);
      setTtsProgress(0);
      setTtsCurrentTime(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  };

  // Seek forward 15 seconds
  const seekForward15 = () => {
    if (!ttsText || !synthRef.current) return;
    
    const wasPlaying = isPlayingTTS;
    const currentTime = ttsCurrentTime;
    const duration = ttsDuration || (ttsText.length / 10);
    const newTime = Math.min(currentTime + 15, duration);
    
    // Calculate new progress
    const newProgress = (newTime / duration) * 100;
    setTtsCurrentTime(newTime);
    setTtsProgress(newProgress);
    
    // If playing, restart from new position
    if (wasPlaying && newTime < duration) {
      // Calculate text position (rough estimate: 10 chars per second)
      const charsPerSecond = ttsText.length / duration;
      const startChar = Math.floor(newTime * charsPerSecond);
      const remainingText = ttsText.substring(startChar);
      
      // Stop current playback
      synthRef.current.cancel();
      setIsPlayingTTS(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      // Start from new position
      setTimeout(() => {
        startTTSPlayback(remainingText, newTime);
      }, 100);
    }
  };

  // Seek backward 15 seconds
  const seekBackward15 = () => {
    if (!ttsText || !synthRef.current) return;
    
    const wasPlaying = isPlayingTTS;
    const currentTime = ttsCurrentTime;
    const duration = ttsDuration || (ttsText.length / 10);
    const newTime = Math.max(currentTime - 15, 0);
    
    // Calculate new progress
    const newProgress = (newTime / duration) * 100;
    setTtsCurrentTime(newTime);
    setTtsProgress(newProgress);
    
    // If playing, restart from new position
    if (wasPlaying && newTime >= 0) {
      // Calculate text position (rough estimate: 10 chars per second)
      const charsPerSecond = ttsText.length / duration;
      const startChar = Math.floor(newTime * charsPerSecond);
      const remainingText = ttsText.substring(startChar);
      
      // Stop current playback
      synthRef.current.cancel();
      setIsPlayingTTS(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      // Start from new position
      setTimeout(() => {
        startTTSPlayback(remainingText, newTime);
      }, 100);
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    // Prevent touch on playback controls
    const target = e.target as HTMLElement;
    if (target.closest('.fixed.bottom-0')) return;
    
    if (isTouchingRef.current || isScrollingRef.current) return;
    isTouchingRef.current = true;
    touchStartYRef.current = e.targetTouches[0].clientY;
    touchEndYRef.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouchingRef.current) return;
    touchEndYRef.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!isTouchingRef.current || isScrollingRef.current) {
      isTouchingRef.current = false;
      return;
    }
    
    const startY = touchStartYRef.current;
    const endY = touchEndYRef.current;
    
    // Reset touching state immediately
    isTouchingRef.current = false;
    
    if (!startY || !endY || startY === endY) {
      touchStartYRef.current = 0;
      touchEndYRef.current = 0;
      return;
    }
    
    const distance = startY - endY;
    const minSwipeDistance = 50;

    // Prevent multiple triggers
    if (isScrollingRef.current) return;
    
    if (distance > minSwipeDistance && currentIndex < articles.length - 1) {
      // Swipe up - next article
      isScrollingRef.current = true;
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 600);
    } else if (distance < -minSwipeDistance && currentIndex > 0) {
      // Swipe down - previous article
      isScrollingRef.current = true;
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 600);
    }
    
    touchStartYRef.current = 0;
    touchEndYRef.current = 0;
  };

  // Wheel handler for web two-finger scroll (trackpad)
  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout;
    let lastWheelTime = 0;
    let wheelDeltaSum = 0;
    
    const handleWheel = (e: WheelEvent) => {
      // Prevent wheel events during touch interactions
      if (isTouchingRef.current || isScrollingRef.current) {
        wheelDeltaSum = 0;
        return;
      }

      // Detect two-finger scroll on trackpad (smaller deltaY, no ctrl key)
      // Regular mouse wheel has larger deltaY values
      const isTwoFingerScroll = Math.abs(e.deltaY) < 50 && !e.ctrlKey;
      
      if (isTwoFingerScroll) {
        e.preventDefault();
        
        const now = Date.now();
        wheelDeltaSum += e.deltaY;
        
        // Reset if too much time has passed
        if (now - lastWheelTime > 300) {
          wheelDeltaSum = e.deltaY;
        }
        lastWheelTime = now;
        
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          if (isScrollingRef.current) {
            wheelDeltaSum = 0;
            return;
          }
          
          // Use ref to get latest currentIndex
          const currentIdx = currentIndexRef.current;
          
          // Determine direction based on accumulated delta
          if (wheelDeltaSum > 30 && currentIdx < articles.length - 1) {
            // Scroll down - next article
            isScrollingRef.current = true;
            const nextIndex = currentIdx + 1;
            setCurrentIndex(nextIndex);
            wheelDeltaSum = 0;
            setTimeout(() => {
              isScrollingRef.current = false;
            }, 600);
          } else if (wheelDeltaSum < -30 && currentIdx > 0) {
            // Scroll up - previous article
            isScrollingRef.current = true;
            const prevIndex = currentIdx - 1;
            setCurrentIndex(prevIndex);
            wheelDeltaSum = 0;
            setTimeout(() => {
              isScrollingRef.current = false;
            }, 600);
          } else {
            wheelDeltaSum = 0;
          }
        }, 150);
      } else {
        wheelDeltaSum = 0;
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        container.removeEventListener('wheel', handleWheel);
        clearTimeout(wheelTimeout);
        wheelDeltaSum = 0;
      };
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="bg-white flex flex-col w-full max-w-md mx-auto overflow-hidden relative"
      style={{ height: screenHeight || '100vh' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Header />

      {/* Article content with transition */}
      <div className="flex-1 overflow-hidden relative">
        <div 
          className="h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateY(-${currentIndex * 100}%)` }}
        >
          {articles.map((article, index) => {
            const isFirstArticle = index === 0;
            return (
            <div 
              key={article.id}
              className="h-full flex flex-col overflow-hidden"
            >
              {/* Content area: Title + CTA + You'll get - scrollable */}
              <div className="flex-1 overflow-y-auto px-3 sm:px-4">
                <div className="max-w-none w-full pt-4 sm:pt-6 pb-4">
                  {/* Main headline - centered, multi-line */}
                  <h1 
                    ref={(el) => { titleRefs.current[article.id] = el; }}
                    className="font-bold mb-6 sm:mb-8 leading-tight text-black text-center font-atlantic-condensed"
                    style={{ 
                      fontFamily: 'Atlantic Condensed, Georgia, serif',
                      fontSize: titleFontSizes[article.id] 
                        ? `${titleFontSizes[article.id]}pt` 
                        : '35pt',
                      visibility: titleFontSizes[article.id] ? 'visible' : 'visible',
                      opacity: titleFontSizes[article.id] ? '1' : '1'
                    }}
                  >
                    {(isFirstArticle && newsletterTitle) ? newsletterTitle.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < newsletterTitle.split('\n').length - 1 && <br />}
                      </span>
                    )) : article.title.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < article.title.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </h1>
                  
                  {/* Author and date */}
                  <div className="flex flex-col items-center mb-2 gap-2">
                    <Link
                      href={`/channel/${slugify(isFirstArticle ? 'Justin Mares' : article.author)}`}
                      className="text-sm sm:text-base text-gray-600 break-words text-center hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-900 focus-visible:outline-offset-2"
                      style={{ fontFamily: 'Georgia, serif' }}
                      aria-label={`View channel for ${isFirstArticle ? 'Justin Mares' : article.author}`}
                    >
                      By {isFirstArticle ? 'Justin Mares' : article.author}
                    </Link>
                    <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider text-center">
                      {isFirstArticle ? 'OCT 28, 2025' : article.date}
                    </p>
                  </div>
                  
                  {/* Button */}
                  <div className="flex justify-end mb-8 sm:mb-10 mt-[70px] -mx-3 sm:-mx-4">
                    <button 
                      onClick={handleViewFullIssue}
                      className="bg-red-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-none font-bold text-lg sm:text-xl hover:bg-red-700 transition-colors touch-manipulation w-full h-[82px] font-atlantic-condensed flex items-center justify-center gap-2"
                      style={{ fontFamily: 'Atlantic Condensed, Georgia, serif' }}
                    >
                      <span>View Full Issue</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="sm:w-6 sm:h-6">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  
                  {/* You'll get section */}
                  <div className="mt-[100px] grid">
                    <h2 className="text-lg sm:text-xl font-bold text-black mb-3 sm:mb-4 break-words font-atlantic-condensed text-center" style={{ fontFamily: 'Atlantic Condensed, Georgia, serif' }}>
                      You’ll get:
                    </h2>
                    
                    <ul className="space-y-2 sm:space-y-2.5 flex flex-col items-center">
                      {article.benefits.map((benefit, i) => (
                        <li key={i} className="text-lg sm:text-xl text-black leading-relaxed break-words font-atlantic-condensed text-center" style={{ fontFamily: 'Atlantic Condensed, Georgia, serif' }}>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* Bottom playback controls */}
      {showPlaybackControls && (
      <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto px-3 sm:px-4 bg-white pb-safe sm:pb-4 pt-2">
        <div className="h-0.5 bg-gray-200 mb-2 sm:mb-3">
          <div 
            className="h-full bg-hark-red transition-all duration-500" 
            style={{ width: `${ttsText ? ttsProgress : currentArticle.audioProgress}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between gap-2 cursor-pointer" onClick={handlePlaybackClick}>
          <div className="flex-1 mr-2 sm:mr-4 min-w-0 overflow-hidden relative" style={{ height: '1.5em' }}>
            <h2 
              className="text-sm sm:text-lg font-bold text-black whitespace-nowrap absolute transition-all duration-500"
              style={{
                animation: (ttsText && newsletterTitle && newsletterTitle.replace(/\n/g, ' ').length > 30) || 
                           (!ttsText && currentArticle.audioTitle && currentArticle.audioTitle.length > 30)
                  ? 'scroll-text 15s linear infinite' 
                  : 'none'
              }}
            >
              {ttsText 
                ? (newsletterTitle ? newsletterTitle.replace(/\n/g, ' ') : ttsTitle)
                : currentArticle.audioTitle}
            </h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* All articles use TTS controls - same UI for all */}
            <button 
              className="p-1.5 sm:p-1 touch-manipulation" 
              aria-label={isPlayingTTS ? 'Pause' : 'Play'} 
              onClick={(e) => {
                e.stopPropagation();
                if (ttsText) {
                  toggleTTSPlayback();
                }
              }}
            >
              {isPlayingTTS ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="sm:w-6 sm:h-6">
                  <rect x="8" y="6" width="3" height="12" fill="#000000"/>
                  <rect x="13" y="6" width="3" height="12" fill="#000000"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="sm:w-6 sm:h-6">
                  <path d="M6 4L18 12L6 20V4Z" fill="#000000"/>
                </svg>
              )}
            </button>
            <button 
              className="p-1.5 sm:p-1 touch-manipulation" 
              aria-label="Stop" 
              onClick={(e) => {
                e.stopPropagation();
                if (ttsText) {
                  stopTTSPlayback();
                  setTtsText('');
                  setTtsTitle('');
                  setTtsProgress(0);
                  setTtsCurrentTime(0);
                  setTtsDuration(0);
                  setShowPlaybackControls(false);
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="sm:w-6 sm:h-6">
                <path d="M18 6L6 18M6 6L18 18" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Audio Player Modal */}
      <AudioPlayerModal
        isOpen={showAudioPlayer}
        onClose={handleCloseAudioPlayer}
        onSeekForward={seekForward15}
        onSeekBackward={seekBackward15}
        ttsText={ttsText}
        onViewFullIssue={handleViewFullIssue}
        newsletterTitle={newsletterTitle}
        newsletterAuthor="Justin Mares"
        isPlaying={isPlayingTTS}
        onTogglePlay={toggleTTSPlayback}
        progress={ttsProgress}
        currentTime={ttsCurrentTime}
        duration={ttsDuration}
      />

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={handleCloseModal}
        onSubscribe={handleSubscribe}
      />
    </div>
  );
}

