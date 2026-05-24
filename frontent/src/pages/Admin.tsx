import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";

import { useUserData } from "../context/UserContext";
import { useSongData } from "../context/SongContext";

const server = "http://15.135.219.153:5007";

const Admin = () => {
  const navigate = useNavigate();

  const { user } = useUserData();
  const { albums, songs, fetchAlbums, fetchSongs } = useSongData();

  const [btnLoading, setBtnLoading] = useState(false);

  /* ================= ALBUM STATE ================= */

  const [albumTitle, setAlbumTitle] = useState("");
  const [albumDesc, setAlbumDesc] = useState("");
  const [albumFile, setAlbumFile] = useState<File | null>(null);

  /* ================= SONG STATE ================= */

  const [songTitle, setSongTitle] = useState("");
  const [songDesc, setSongDesc] = useState("");
  const [songAlbum, setSongAlbum] = useState("");
  const [songFile, setSongFile] = useState<File | null>(null);

  /* ================= THUMBNAIL STATE ================= */

  const [thumbFiles, setThumbFiles] = useState<Record<string, File>>({});

  /* ================= FILE HANDLERS ================= */

  const albumFileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAlbumFile(file);
  };

  const songFileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSongFile(file);
  };

  const thumbnailFileHandler = (
    e: ChangeEvent<HTMLInputElement>,
    songId: string
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setThumbFiles((prev) => ({
      ...prev,
      [songId]: file,
    }));
  };

  /* ================= ADD ALBUM ================= */

  const addAlbumHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!albumFile) {
      return toast.error("Please select thumbnail");
    }

    const formData = new FormData();

    formData.append("title", albumTitle);
    formData.append("description", albumDesc);
    formData.append("file", albumFile);

    try {
      setBtnLoading(true);

      const { data } = await axios.post(
        `${server}/api/v1/admin/album/new`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);

      fetchAlbums();

      setAlbumTitle("");
      setAlbumDesc("");
      setAlbumFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };

  /* ================= ADD SONG ================= */

  const addSongHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!songFile) {
      return toast.error("Please select audio file");
    }

    const formData = new FormData();

    formData.append("title", songTitle);
    formData.append("description", songDesc);
    formData.append("album", songAlbum);
    formData.append("file", songFile);

    try {
      setBtnLoading(true);

      const { data } = await axios.post(
        `${server}/api/v1/admin/song/new`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);

      fetchSongs();

      setSongTitle("");
      setSongDesc("");
      setSongAlbum("");
      setSongFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };

  /* ================= ADD THUMBNAIL ================= */

  const addThumbnailHandler = async (songId: string) => {
    const selectedFile = thumbFiles[songId];

    if (!selectedFile) {
      return toast.error("Please select thumbnail");
    }

    const formData = new FormData();

    formData.append("file", selectedFile);

    try {
      setBtnLoading(true);

      const { data } = await axios.post(
        `${server}/api/v1/admin/song/${songId}`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);

      fetchSongs();

      setThumbFiles((prev) => {
        const updated = { ...prev };
        delete updated[songId];
        return updated;
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };

  /* ================= DELETE ALBUM ================= */

  const deleteAlbum = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this album?"
    );

    if (!confirmDelete) return;

    try {
      setBtnLoading(true);

      const { data } = await axios.delete(
        `${server}/api/v1/admin/album/${id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);

      fetchAlbums();
      fetchSongs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };

  /* ================= DELETE SONG ================= */

  const deleteSong = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this song?"
    );

    if (!confirmDelete) return;

    try {
      setBtnLoading(true);

      const { data } = await axios.delete(
        `${server}/api/v1/admin/song/${id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);

      fetchSongs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };

  /* ================= AUTH CHECK ================= */

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#212121] text-white p-8">
      <Link
        to="/"
        className="bg-green-500 text-white font-bold py-2 px-4 rounded-full"
      >
        Go to home page
      </Link>

      {/* ================= ADD ALBUM ================= */}

      <h2 className="text-2xl font-bold mt-8 mb-6">Add Album</h2>

      <form
        onSubmit={addAlbumHandler}
        className="bg-[#181818] p-6 rounded-lg shadow-lg flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Album title"
          className="auth-input"
          value={albumTitle}
          onChange={(e) => setAlbumTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Album description"
          className="auth-input"
          value={albumDesc}
          onChange={(e) => setAlbumDesc(e.target.value)}
          required
        />

        <input
          type="file"
          className="auth-input"
          accept="image/*"
          onChange={albumFileHandler}
          required
        />

        <button
          disabled={btnLoading}
          className="auth-btn"
          style={{ width: "150px" }}
        >
          {btnLoading ? "Please Wait..." : "Add Album"}
        </button>
      </form>

      {/* ================= ADD SONG ================= */}

      <h2 className="text-2xl font-bold mt-10 mb-6">Add Song</h2>

      <form
        onSubmit={addSongHandler}
        className="bg-[#181818] p-6 rounded-lg shadow-lg flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Song title"
          className="auth-input"
          value={songTitle}
          onChange={(e) => setSongTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Song description"
          className="auth-input"
          value={songDesc}
          onChange={(e) => setSongDesc(e.target.value)}
          required
        />

        <select
          className="auth-input"
          value={songAlbum}
          onChange={(e) => setSongAlbum(e.target.value)}
          required
        >
          <option value="">Choose Album</option>

          {albums?.map((album: any) => (
            <option key={album.id} value={album.id}>
              {album.title}
            </option>
          ))}
        </select>

        <input
          type="file"
          className="auth-input"
          accept="audio/*"
          onChange={songFileHandler}
          required
        />

        <button
          disabled={btnLoading}
          className="auth-btn"
          style={{ width: "150px" }}
        >
          {btnLoading ? "Please Wait..." : "Add Song"}
        </button>
      </form>

      {/* ================= ALBUM LIST ================= */}

      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4">Added Albums</h3>

        <div className="flex flex-wrap gap-4">
          {albums?.map((album: any) => (
            <div
              key={album.id}
              className="bg-[#181818] p-4 rounded-lg shadow-md w-40"
            >
              <img
                src={album.thumbnail}
                alt={album.title}
                className="w-full h-52 object-cover rounded-md"
              />

              <h4 className="text-lg font-bold mt-3">
                {album.title.slice(0, 30)}
              </h4>

              <p className="text-sm text-gray-400 mt-1">
                {album.description.slice(0, 50)}...
              </p>

              <button
                disabled={btnLoading}
                onClick={() => deleteAlbum(album.id)}
                className="mt-4 px-3 py-2 bg-red-500 rounded"
              >
                <MdDelete />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= SONG LIST ================= */}

      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4">Added Songs</h3>

        <div className="flex flex-wrap gap-4">
          {songs?.map((song: any) => (
            <div
              key={song.id}
              className="bg-[#181818] p-4 rounded-lg shadow-md w-40"
            >
              {song.thumbnail ? (
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="w-full h-52 object-cover rounded-md"
                />
              ) : (
                <div className="flex flex-col gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      thumbnailFileHandler(e, song.id)
                    }
                  />

                  <button
                    className="auth-btn"
                    disabled={btnLoading}
                    onClick={() => addThumbnailHandler(song.id)}
                  >
                    {btnLoading
                      ? "Please Wait..."
                      : "Add Thumbnail"}
                  </button>
                </div>
              )}

              <h4 className="text-lg font-bold mt-3">
                {song.title.slice(0, 30)}
              </h4>

              <p className="text-sm text-gray-400 mt-1">
                {song.description.slice(0, 50)}...
              </p>

              <button
                disabled={btnLoading}
                onClick={() => deleteSong(song.id)}
                className="mt-4 px-3 py-2 bg-red-500 rounded"
              >
                <MdDelete />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;