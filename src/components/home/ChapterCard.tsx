import React, { useMemo } from "react";
import { ExternalLink, Clock } from "lucide-react";

interface Props {
  title: string;
  id: string;
  img: string;
  onClick?: (id: string) => void;
  description: string;
  isComingSoon?: boolean;
}

export default function ChapterCard({
  id,
  img,
  title,
  onClick,
  description,
  isComingSoon = false,
}: Props) {
  const handleClick = useMemo(() => {
    return () => {
      if (!isComingSoon && onClick) {
        onClick(id);
      }
    };
  }, [id, isComingSoon, onClick]);

  const handleKeyDown = useMemo(() => {
    return (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    };
  }, [handleClick]);

  return (
    <article
      className={`group relative h-[340px] w-full max-w-sm transform overflow-hidden rounded-2xl border border-white/0 bg-white shadow-md transition-all duration-300 ease-out ${
        !isComingSoon
          ? "cursor-pointer hover:scale-105 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          : "cursor-default"
      } `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isComingSoon ? -1 : 0}
      role={!isComingSoon ? "button" : "article"}
      aria-label={
        !isComingSoon ? `Start ${title} chapter` : `${title} - Coming Soon`
      }
    >
      {/* COMING SOON OVERLAY */}
      {isComingSoon && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-gray-900/80 to-gray-700/80 backdrop-blur-sm">
          <div className="-rotate-12 transform text-center">
            <Clock className="mx-auto mb-2 h-8 w-8 text-white" />
            <p className="text-lg font-bold tracking-wide text-white">
              Coming Soon
            </p>
          </div>
        </div>
      )}

      {/* IMAGE SECTION */}
      <div className="relative h-40 overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 to-transparent" />
        <div
          className="h-full w-full bg-contain bg-center"
          style={{
            backgroundImage: `url(/home/${img})`,
            backgroundColor: "#e5e7eb",
          }}
        />
      </div>

      {/* CONTENT SECTION */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="mb-2 text-xs font-semibold tracking-wider text-blue-600/90 uppercase">
              {id.replace(/-/g, " ")}
            </p>
            <h3 className="text-lg leading-tight font-bold text-gray-900/90">
              {title}
            </h3>
          </div>
          {!isComingSoon && (
            <ExternalLink className="ml-2 h-4 w-4 flex-shrink-0 text-blue-500/70 opacity-0 transition-opacity group-hover:opacity-100" />
          )}
        </div>

        <p className="mt-3 text-sm leading-relaxed text-gray-700/90">
          {description}
        </p>
      </div>
    </article>
  );
}
