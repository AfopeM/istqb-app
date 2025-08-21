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

export default function HomeCard({
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
      className={`
        relative group transform transition-all duration-300 ease-out
        rounded-2xl overflow-hidden w-full max-w-sm shadow-md h-[340px]
        bg-white border border-white/0 
        ${
          !isComingSoon
            ? "hover:scale-105 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer"
            : "cursor-default"
        }
      `}
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
        <div className="absolute inset-0 z-20 bg-gradient-to-br from-gray-900/80 to-gray-700/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center transform -rotate-12">
            <Clock className="w-8 h-8 text-white mx-auto mb-2" />
            <p className="font-bold text-white text-lg tracking-wide">
              Coming Soon
            </p>
          </div>
        </div>
      )}

      {/* IMAGE SECTION */}
      <div className="relative h-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
        <div
          className="w-full h-full bg-contain bg-center"
          style={{
            backgroundImage: `url(/home/${img})`,
            backgroundColor: "#e5e7eb",
          }}
        />
      </div>

      {/* CONTENT SECTION */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-blue-600/90 uppercase tracking-wider mb-2">
              {id.replace(/-/g, " ")}
            </p>
            <h3 className="font-bold text-gray-900/90 text-lg leading-tight">
              {title}
            </h3>
          </div>
          {!isComingSoon && (
            <ExternalLink className="w-4 h-4 text-blue-500/70 ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>

        <p className="text-sm text-gray-700/90 leading-relaxed mt-3">
          {description}
        </p>
      </div>
    </article>
  );
}
