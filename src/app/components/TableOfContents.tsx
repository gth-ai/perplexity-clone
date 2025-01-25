"use client";

import { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('h1, h2, h3'))
      .map((element) => ({
        id: element.id || element.textContent?.toLowerCase().replace(/\s+/g, '-') || '',
        text: element.textContent || '',
        level: parseInt(element.tagName.charAt(1))
      }));

    setHeadings(elements);

    // Add IDs to elements if they don't have one
    elements.forEach(({ id, text }) => {
      const element = document.querySelector(`h1, h2, h3`);
      if (element && !element.id) {
        element.id = id || text.toLowerCase().replace(/\s+/g, '-');
      }
    });

    const handleScroll = () => {
      const headingElements = Array.from(document.querySelectorAll('h1, h2, h3'));
      const visibleHeadings = headingElements.filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight / 2;
      });

      if (visibleHeadings.length > 0) {
        setActiveId(visibleHeadings[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="sticky top-4 p-4 bg-white/10 backdrop-blur-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-100">Table of Contents</h2>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
          >
            <a
              href={`#${heading.id}`}
              className={`block py-1 text-sm transition-colors duration-200 ${
                activeId === heading.id
                  ? 'text-blue-400 font-medium'
                  : 'text-gray-300 hover:text-blue-400'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
} 