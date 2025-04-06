export default function Pagination({
  pageNumber,
  totalResults,
  onPrevious,
  onNext,
  loading,
}) {
  const totalPages = Math.ceil(totalResults / 10);

  return (
    <div className="mt-8 flex justify-center items-center gap-4">
      <button
        onClick={onPrevious}
        disabled={pageNumber === 1 || loading}
        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-gray-600">
        Page {pageNumber} of {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={pageNumber === totalPages || loading}
        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
