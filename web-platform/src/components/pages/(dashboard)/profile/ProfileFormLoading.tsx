import React from "react";

import Skeleton from "@mui/material/Skeleton";

const ProfileFormLoading = () => {
  return (
    <div className="flex flex-col p-20 min-h-screen  space-y-32 bg-surface-container-lowest rounded-medium mt-48">
      <div className="flex items-center justify-between">
        <Skeleton
          variant="rectangular"
          height={80}
          width={300}
          className="rounded-large"
        />
        <Skeleton
          variant="rectangular"
          height={40}
          width={70}
          className="rounded-large"
        />
      </div>
      <div className="flex gap-12">
        <Skeleton
          variant="rectangular"
          height={30}
          width={70}
          className="rounded-large"
        />
        <Skeleton
          variant="rectangular"
          height={30}
          width={70}
          className="rounded-large"
        />
        <Skeleton
          variant="rectangular"
          height={30}
          width={70}
          className="rounded-large"
        />
        <Skeleton
          variant="rectangular"
          height={30}
          width={70}
          className="rounded-large"
        />
      </div>
      <div className="flex gap-12 justify-between flex-col md:flex-row">
        <Skeleton
          variant="rectangular"
          height={130}
          className="rounded-large md:w-1/2 w-full"
        />
        <Skeleton
          variant="rectangular"
          height={130}
          className="rounded-large md:w-1/2 w-full"
        />
      </div>
      <Skeleton
        variant="rectangular"
        height={400}
        width={"100%"}
        className="rounded-large"
      />
      <Skeleton
        variant="rectangular"
        height={100}
        width={"100%"}
        className="rounded-large"
      />
      <Skeleton
        variant="rectangular"
        height={50}
        width={"100%"}
        className="rounded-large"
      />
    </div>
  );
};

export default ProfileFormLoading;
