export default function FriendItem({
  name,
  status,
  online = false,
  image,
  onClick,
}: {
  name: string;
  status: string;
  online?: boolean;
  image?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#3a3c41] w-full text-left"
    >
      <div className="relative">
        {image ? (
          <img src={image} alt={name} className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#5865f2] text-white font-semibold">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        {online && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#2b2d31] rounded-full" />
        )}
      </div>
      <div>
        <div className="font-semibold text-sm">{name}</div>
        <div className="text-xs text-gray-400">{status}</div>
      </div>
    </button>
  );
}