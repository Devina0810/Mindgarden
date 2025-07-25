// src/pages/Journal.jsx
import { useEffect, useState } from "react";
import { collection, addDoc, query, where, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import Navbar from "../components/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

  // Fetch user's journal entries
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, "journals"),
          where("uid", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setEntries(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching journal entries:", err);
        toast.error("Failed to load entries.");
      }
    };

    fetchEntries();
  }, []);

  // Add new journal entry
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      toast.error("Please fill in both fields.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please log in to add journal entries.");
        return;
      }

      console.log("Adding journal entry...");
      
      await addDoc(collection(db, "journals"), {
        uid: user.uid,
        title,
        content,
        createdAt: new Date().toISOString()
      });

      toast.success("Entry added!");

      // Clear form
      setTitle("");
      setContent("");

      // Refetch entries
      const q = query(
        collection(db, "journals"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEntries(data);

    } catch (err) {
      console.error("Error adding journal entry:", err);
      
      if (err.code === 'permission-denied') {
        toast.error("Permission denied. Please check Firestore rules.");
      } else if (err.code === 'unavailable') {
        toast.error("Database unavailable. Please try again later.");
      } else {
        toast.error(`Failed to add entry: ${err.message}`);
      }
    }
  };

  // Delete journal entry
  const handleDelete = async (entryId) => {
    setEntryToDelete(entryId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!entryToDelete) return;

    try {
      await deleteDoc(doc(db, "journals", entryToDelete));
      toast.success("Entry deleted!");
      
      // Remove the entry from the local state
      setEntries(entries.filter(entry => entry.id !== entryToDelete));
      
      // Close modal and reset state
      setShowDeleteModal(false);
      setEntryToDelete(null);
    } catch (err) {
      console.error("Error deleting journal entry:", err);
      toast.error("Failed to delete entry.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setEntryToDelete(null);
  };

  return (
    <>
      <Navbar />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="min-h-screen bg-[#F8F4E9] px-6 py-10 font-[Montserrat]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-[Playfair_Display] text-[#6A752D] mb-6 text-center">
            🌿 My Journal
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-10">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-[#6A752D] text-[#3A3A3A] placeholder-gray-500"
            />
            <textarea
              rows="5"
              placeholder="Write your thoughts here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring focus:border-[#6A752D] text-[#3A3A3A] placeholder-gray-500"
            />
            <button
              type="submit"
              className="bg-[#6A752D] text-white px-4 py-2 rounded hover:bg-[#5A6425] transition"
            >
              Add Entry
            </button>
          </form>

          {/* Journal Entries */}
          <div>
            {loading ? (
              <p className="text-center text-[#6A752D]">Loading...</p>
            ) : entries.length === 0 ? (
              <p className="text-center text-[#6A752D] italic">
                No entries yet. Start by writing your first one!
              </p>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <div key={entry.id} className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-[#3A3A3A]">{entry.title}</h3>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-red-500 hover:text-red-700 px-2 py-1 rounded text-sm transition"
                        title="Delete entry"
                      >
                        🗑️
                      </button>
                    </div>
                    <p className="mt-1 text-[#555] whitespace-pre-wrap">{entry.content}</p>
                    {entry.createdAt && (
                      <p className="mt-2 text-sm text-[#999]">
                        {new Date(entry.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Journal Entry</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this entry? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Journal;
