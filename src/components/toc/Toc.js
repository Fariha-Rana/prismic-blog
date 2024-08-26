"use client";

import { PrismicRichText } from "@prismicio/react";
import { slugifyHeading } from "@/lib/slugifyHeading";

import { asText } from "@prismicio/client";
import { useEffect, useRef, useState } from "react";
import { Heading } from "../head/Heading";

import TocNavElement from "./TocNavElement";

export function Toc({ slices, title }) {
  const headingsList = useRef(null);
  const [activeId, setActiveId] = useState(null);
  const [headings, setHeadings] = useState([]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const scrollRef = useRef(0); // Store the previous scroll position
  const scrollbarRef = useRef(null);

  useEffect(() => {
    if (!headingsList.current) return;

    const firstHeadingId = slugifyHeading({
      text: headingsList.current.childNodes[0].textContent,
    });

    setActiveId(firstHeadingId);

    // Loop over our headings and create an id for each, store it in the new state
    headingsList.current.childNodes.forEach((heading, index) => {
      const id = slugifyHeading({ text: heading.textContent });

      if (id) {
        setHeadings((headings) => [...headings, { id, index }]);
      }
    });
  }, [headingsList]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateScrollbar = () => {
      if (!scrollbarRef.current) return;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      const scrollPercentage =
        (scrollTop / (documentHeight - windowHeight)) * 100;
      scrollbarRef.current.style.top = `${scrollPercentage}%`;
    };

    window.addEventListener("scroll", updateScrollbar);
    updateScrollbar(); // Initial update

    return () => window.removeEventListener("scroll", updateScrollbar);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Add a new useEffect hook with our IntersectionObserver logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("id");

          if (entry.isIntersecting) {
            setActiveId(id);
            scrollRef.current = window.scrollY;
          } else {
            const diff = scrollRef.current - window.scrollY;
            const isScrollingUp = diff > 0;
            const currentIndex = headings.findIndex(
              (heading) => heading.id === id
            );
            const prevEntry = headings[currentIndex - 1];
            const prevId = prevEntry?.id;

            if (isScrollingUp && prevId) {
              setActiveId(prevId);
            }
          }
        });
      },
      {
        rootMargin: "0px 0px -95% 0px",
      }
    );

    const observeHeadings = () => {
      headings.forEach((heading) => {
        const currentHeading = document.getElementById(heading.id);

        if (currentHeading) {
          observer.observe(currentHeading);
        }
      });
    };

    if (headings.length) {
      observeHeadings();
    }

    return () => {
      headings.forEach((heading) => {
        const currentHeading = document.getElementById(heading.id);

        if (currentHeading) {
          observer.unobserve(currentHeading);
        }
      });
    };
  }, [headings]);

  return (
    <div className="2xl:sticky 2xl:top-4 px-4 md:px-6 w-full">
      <div className="2xl:absolute 2xl:top-0 2xl:left-4">
        <aside className="border p-6 bg-white mx-auto max-w-3xl mt-6 md:mt-0 2xl:w-80">
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-gray-200">
            <div
              ref={scrollbarRef}
              className="absolute w-full bg-blue-500 transition-all duration-200 ease-out"
              style={{ height: "20px" }}
            />
          </div>
          <nav aria-labelledby="toc-heading">
            <Heading as="h2" size="xl" id="toc-heading">
              Table of Contents
            </Heading>
            <ol className="pl-4 mt-4" ref={headingsList} role="list">
              <TocNavElement
                node={{ text: asText(title) }}
                level={1}
                activeId={activeId}
              />
              {slices.map(
                (slice) =>
                  slice.slice_type === "text" && (
                    <PrismicRichText
                      key={slice.id}
                      field={slice.primary.text}
                      components={{
                        heading1: ({ node, children, key }) => (
                          <TocNavElement
                            node={node}
                            children={children}
                            key={key}
                            level={1}
                            activeId={activeId}
                          />
                        ),
                        heading2: ({ node, children, key }) => (
                          <TocNavElement
                            node={node}
                            children={children}
                            key={key}
                            level={2}
                            activeId={activeId}
                          />
                        ),
                        heading3: () => <></>,
                        paragraph: () => <></>,
                        preformatted: () => <></>,
                        strong: () => <></>,
                        em: () => <></>,
                        listItem: () => <></>,
                        oListItem: () => <></>,
                        list: () => <></>,
                        oList: () => <></>,
                        image: () => <></>,
                        embed: () => <></>,
                        hyperlink: () => <></>,
                      }}
                    />
                  )
              )}
            </ol>
          </nav>
        </aside>
      </div>
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-500 text-white py-3 px-5 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300"
          aria-label="Back to top">
          ↑
        </button>
      )}
    </div>
  );
}
