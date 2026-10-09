const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-40 flex justify-center items-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 border-4 border-[#8B6B4E] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white font-medium">Uploading property...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
