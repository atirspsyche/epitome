import React from "react";
import useSimpleVideoObserver from "./simple-video-observer";

// Displays background video, brand hero info, about/credits, and gallery grids
export default function BrandShowcase({ brand }) {
  useSimpleVideoObserver();
  if (!brand) return null;

  const media = Array.isArray(brand.grids_media) ? brand.grids_media : [];
  const safeItem = (i) => media[i];

  const renderMedia = (item, key, fullCover = false) => {
    if (!item) return null;
    if (item.type === "image") {
      return (
        <img
          key={key}
          src={`/images/${item.url}`}
          className={
            fullCover
              ? "inset-0 w-full h-full object-cover rounded-xl"
              : "w-full h-auto object-cover rounded-xl"
          }
          alt={brand.brand_name + " media " + key}
          loading="lazy"
        />
      );
    }
    return (
      <video
        key={key}
        src={`/videos/${item.url}`}
        className="w-full h-auto object-cover feat-video rounded-xl"
        data-lazy="true"
        muted
        loop
        autoplay
        playsInline
        preload="metadata"
      />
    );
  };

  return (
    <>
      <div className="relative grid md:grid-cols-2 text-primary text-5xl md:text-7xl bg-neutral-900 z-10 px-16 py-10 gap-10 pt-36 font-heading leading-tight">
        {brand.brand_name}
      </div>
      <div className="relative grid md:grid-cols-2 bg-neutral-900 z-10 px-16 py-10 gap-10">
        <div>
          <div className="font-heading tracking-tighter text-3xl uppercase leading-tight text-neutral-300 font-bold">
            About Project
          </div>
          <div className="w-full h-0.5 bg-gradient-to-r from-hanBlue to-secondary my-4" />
          {brand.about && (
            <div className="py-4 md:w-3/4 text-sm text-primary whitespace-pre-line">
              {brand.about}
            </div>
          )}
        </div>
        <div>
          <div className="font-heading tracking-tighter text-3xl uppercase font-semibold leading-tight text-neutral-300">
            Credits
          </div>
          <div className="w-full h-0.5 bg-gradient-to-r from-hanBlue to-secondary my-4" />
          <div className="py-4 space-y-2">
            {Array.isArray(brand.credits) &&
              brand.credits.map((el, i) => (
                <div key={i} className="text-sm text-primary">
                  <b>{el.title}</b>: {el.description}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Gallery Pattern */}
      {/* <div className="bg-secondary relative grid md:grid-cols-2 gap-10 px-10 ">
        <div className="md:col-span-2 object-cover relative min-h-[50vh]">
          {renderMedia(safeItem(0), 0, true)}
        </div>
      </div>
      <div className="bg-secondary relative grid md:grid-cols-2 gap-10 p-10">
        {[safeItem(1), safeItem(2)].map((m, i) => (
          <div key={i}>{renderMedia(m, i + 1)}</div>
        ))}
      </div>
      <div className="bg-secondary relative grid md:grid-cols-2 gap-10 px-10">
        <div className="md:col-span-2 relative min-h-[50vh]">
          {renderMedia(safeItem(3), 3, true)}
        </div>
      </div>
      <div className="bg-secondary relative grid md:grid-cols-2 gap-10 p-10">
        {[safeItem(4), safeItem(5)].map((m, i) => (
          <div key={i}>{renderMedia(m, i + 4)}</div>
        ))}
      </div>
      <div className="bg-secondary relative grid md:grid-cols-2 gap-10 px-10 pb-10">
        <div className="md:col-span-2 relative min-h-[50vh]">
          {renderMedia(safeItem(6), 6, true)}
        </div>
      </div> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-secondary px-10">
        {brand.grids_media.map((v, i) => (
          <div
            key={v.url + i}
            className="relative rounded-xl overflow-hidden shadow-sm bg-gray-900"
          >
            <div className="relative" style={{ aspectRatio: "9/16" }}>
              <video
                data-lazy
                src={v.url}
                muted
                // playsInline
                // remove controls if you want autoplay-only and a custom control UI
                controls
                className="w-full h-full object-cover aspect-video"
                preload="metadata"
              />
            </div>

            {/* overlay name */}
            {/* {v.name && (
              <div className="absolute left-3 bottom-3 bg-black/50 px-3 py-1 rounded text-sm text-white">
                {v.name}
              </div>
            )} */}
          </div>
        ))}
      </div>
    </>
  );
}
