const Loading = ({ isheight = true }) => {
  const smallLoaderClass =
    "animate-spin rounded-full h-8 w-8 border-t-4 border-[#8884d8] border-solid";
  const mediumLoaderClass =
    "animate-spin rounded-full h-16 w-16 border-t-4 border-[#8884d8] border-solid";
  return (
    <div
      className={`flex items-center justify-center ${
        isheight ? "h-screen" : ""
      }`}
    >
      <div className={isheight ? mediumLoaderClass : smallLoaderClass}></div>
    </div>
  );
};

export default Loading;
