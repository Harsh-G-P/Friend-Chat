export default function LogoutModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm z-50">
      <div className="bg-[#2b2d31] p-6 rounded-2xl w-96 text-white shadow-lg">
        <h1 className="font-bold text-lg mb-2">Log Out</h1>
        <h2 className="text-sm font-semibold mb-4">
          Are you sure you want to log out?
        </h2>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-xl bg-gray-600 hover:bg-gray-500"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500"
            onClick={onConfirm}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
