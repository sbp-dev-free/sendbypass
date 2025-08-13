import { VideoList } from "./VideoList";
export const Video = () => {
  return (
    <div className="p-16 md:pt-32 md:ps-32 md:pe-16 bg-surface-container-high rounded-large  xl:w-[1039px] xl:mx-auto">
      <h4 className="font-light text-[28px] md:text-[36px] text-on-surface text-center">
        <span className="font-semibold">Effortless</span> to Navigate,
        <span className="font-semibold">Delightful</span> to Use
      </h4>
      <p className="text-label-large text-on-surface-variant text-center mt-4 mb-24">
        Watch the video below to see the features and functionality of the app.
      </p>
      <VideoList />
    </div>
  );
};
