import React from "react";
import ReactPlayer from "react-player";
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
              ? "inset-0 w-full h-full object-cover"
              : "w-full h-auto object-cover"
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
        className="w-full h-auto object-cover feat-video"
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
      {/* Background Video */}
      <div className="fixed inset-0 object-cover z-0 pointer-events-auto overflow-hidden bg-black pt-10">
        <ReactPlayer
          src={brand.main_video_url}
          playing={true}
          muted={true}
          loop={true}
          width="100%"
          height="100%"
          config={{
            vimeo: {
              playerOptions: {
                background: true,
                controls: false,
                title: false,
                byline: false,
                portrait: false,
                autoplay: true,
                autopause: false,
                muted: true,
                responsive: true,
              },
            },
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100vw",
            height: "100vh",
            transform: "translate(-50%, -50%)",
            minWidth: "100%",
            minHeight: "100%",
          }}
          className="react-player-crop"
          controls={false}
        />
      </div>

      {/* Brand Hero Text */}
      {/* <div className="h-[90vh]"></div> */}
      <div
        className="z-10 relative text-primary px-8 py-14 w-fit"
        style={{ height: "90vh", top: "65vh" }}
      >
        <div className="font-heading backdrop-blur-xl bg-black/40  rounded-2xl p-8 shadow-2xl ">
          <div className="uppercase font-heading text-5xl md:text-8xl leading-tight text-left text-primary">
            {brand.brand_name}
          </div>
          {brand.subtitle && (
            <div className="text-2xl md:text-4xl font-semibold text-primary pt-4">
              {brand.subtitle}
            </div>
          )}
          {brand.pagination_text && (
            <div className="font-semibold text-primary pt-3">
              {brand.pagination_text}
            </div>
          )}
        </div>
      </div>
      <div className="h-[10vh] -z-10 relative" />

      {/* About & Credits */}
      <div className="relative grid md:grid-cols-2 bg-primary z-10 px-20 py-10 gap-10">
        <div>
          <div className="font-heading text-3xl uppercase leading-tight text-hanBlue">
            About Project
          </div>
          {brand.about && (
            <div className="py-4 md:w-3/4 text-sm text-secondary whitespace-pre-line">
              {brand.about}
            </div>
          )}
        </div>
        <div>
          <div className="font-heading text-3xl uppercase font-semibold leading-tight text-hanBlue">
            Credits
          </div>
          <div className="py-4 space-y-2">
            {Array.isArray(brand.credits) &&
              brand.credits.map((el, i) => (
                <div key={i} className="text-sm text-secondary">
                  <b>{el.title}</b>: {el.description}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Gallery Pattern */}
      <div className="bg-primary relative grid md:grid-cols-2 gap-10">
        <div className="md:col-span-2 object-cover relative min-h-[50vh]">
          {renderMedia(safeItem(0), 0, true)}
        </div>
      </div>
      <div className="bg-primary relative grid md:grid-cols-2 gap-10 p-10">
        {[safeItem(1), safeItem(2)].map((m, i) => (
          <div key={i}>{renderMedia(m, i + 1)}</div>
        ))}
      </div>
      <div className="bg-primary relative grid md:grid-cols-2 gap-10">
        <div className="md:col-span-2 relative min-h-[50vh]">
          {renderMedia(safeItem(3), 3, true)}
        </div>
      </div>
      <div className="bg-primary relative grid md:grid-cols-2 gap-10 p-10">
        {[safeItem(4), safeItem(5)].map((m, i) => (
          <div key={i}>{renderMedia(m, i + 4)}</div>
        ))}
      </div>
      <div className="bg-primary relative grid md:grid-cols-2 gap-10">
        <div className="md:col-span-2 relative min-h-[50vh]">
          {renderMedia(safeItem(6), 6, true)}
        </div>
      </div>
    </>
  );
}
