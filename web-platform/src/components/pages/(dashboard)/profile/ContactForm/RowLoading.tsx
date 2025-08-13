import Skeleton from "@mui/material/Skeleton";

export const RowLoading = () => {
  return (
    <div className="flex gap-16 items-center">
      <Skeleton
        animation="wave"
        className="w-full md:w-[32%]"
        sx={{ height: "90px" }}
      />
      <Skeleton
        animation="wave"
        className="w-full md:w-auto grow"
        sx={{ height: "90px" }}
      />
      <Skeleton animation="wave" sx={{ height: "90px", width: "40px" }} />
    </div>
  );
};
