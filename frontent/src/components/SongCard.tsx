import React from "react";
import { FaBookmark, FaPlay } from "react-icons/fa";
import { useUserData } from "../context/UserContext";
import { useSongData } from "../context/SongContext";

interface SongCardProps {
  image: string;
  name: string;
  desc: string;
  id: string;
}
 // SongCard.tsx — smooth hover overlay
const SongCard: React.FC<SongCardProps> = ({ image, name, desc, id }) => {
  const { addToPlaylist, isAuth } = useUserData();
  const { setSelectedSong, setIsPlaying } = useSongData();

  return (
    <div className="group min-w-40 p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-colors duration-200">
      <div className="relative">
        <img
          src={image || "/download.jpeg"}
          className="w-34 h-34 rounded-lg object-cover"
          alt={name}
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg" />
        <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200">
          {isAuth && (
            <button
              onClick={() => addToPlaylist(id)}
              className="w-9 h-9 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <FaBookmark size={12} />
            </button>
          )}
          <button
            onClick={() => { setSelectedSong(id); setIsPlaying(true); }}
            className="w-9 h-9 bg-[#1db954] text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            <FaPlay size={12} />
          </button>
        </div>
      </div>
      <p className="font-medium mt-3 mb-1 text-sm text-white truncate">{name}</p>
      <p className="text-xs text-zinc-400 truncate">{desc}</p>
    </div>
  );
};
export default SongCard;
