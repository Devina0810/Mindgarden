// src/pages/Mood.jsx
import { useEffect, useState } from "react";
import { collection, addDoc, query, where, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import Navbar from "../components/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const moodOptions = [
  { label: "Excited", icon: "😄", color: "#FFD700" },
  { label: "Happy", icon: "😊", color: "#FFA500" },
  { label: "Neutral", icon: "😐", color: "#D3D3D3" },
  { label: "Sad", icon: "😢", color: "#ADD8E6" },
  { label: "Anxious", icon: "😰", color: "#FF6347" }
];

const Mood = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [journal, setJournal] = useState("");
  const [activities, setActivities] = useState([]);
  const [entries, setEntries] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

  const activityTags = ["Exercise", "Meditation", "Social", "Creative", "Outdoors"];

  const toggleActivity = (activity) => {
    setActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((act) => act !== activity)
        : [...prev, activity]
    );
  };

  const fetchEntries = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(
      collection(db, "moods"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setEntries(data);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "moods", id));
      setEntries(entries.filter(entry => entry.id !== id));
      setShowDeleteModal(false);
      setEntryToDelete(null);
      toast.success("Mood entry deleted successfully!");
    } catch (error) {
      console.error("Error deleting mood entry:", error);
      toast.error("Failed to delete mood entry. Please try again.");
    }
  };

  const confirmDelete = (entry) => {
    setEntryToDelete(entry);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setEntryToDelete(null);
  };

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast.error("Please select a mood before submitting.");
      return;
    }
    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(collection(db, "moods"), {
        uid: user.uid,
        mood: selectedMood,
        journal,
        activities,
        createdAt: new Date()  // ✅ Correct Firestore timestamp
      });
      toast.success("Mood saved successfully!");
      setSelectedMood(null);
      setJournal("");
      setActivities([]);
      fetchEntries();
    } catch (err) {
      console.error("Error saving mood:", err);
      toast.error("Failed to save mood entry.");
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="min-h-screen bg-[#F8F4E9] p-6 font-[Montserrat]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-[Playfair_Display] text-[#6A752D] text-center mb-8">
            🌿 How Are You Feeling Today?
          </h2>

          {/* Mood Selection */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
            {moodOptions.map((mood) => (
              <div
                key={mood.label}
                onClick={() => setSelectedMood(mood.label)}
                className={`p-4 rounded-lg bg-[#F5F5DC] text-center cursor-pointer transition-transform transform hover:scale-105 shadow-md ${
                  selectedMood === mood.label ? "ring-2 ring-[#6A752D]" : ""
                }`}
              >
                <div
                  className="text-3xl mb-2"
                  style={{ color: "#6B6B4D" }}
                >
                  {mood.icon}
                </div>
                <p className="text-[#6B6B4D] font-medium">{mood.label}</p>
              </div>
            ))}
          </div>

          {/* Journal */}
          <textarea
            rows="4"
            className="w-full p-3 rounded-lg border border-[#D1D1B0] focus:ring-[#6A752D] focus:border-[#6A752D] bg-[#F5F5DC] text-[#6B6B4D] mb-4"
            placeholder="Optional: What’s on your mind today?"
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
          ></textarea>

          {/* Activities */}
          <div className="mb-6">
            <p className="text-[#6A752D] mb-2 font-semibold">Activities today</p>
            <div className="flex flex-wrap gap-2">
              {activityTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleActivity(tag)}
                  className={`px-3 py-1 rounded-full border border-[#D1D1B0] text-[#6B6B4D] transition ${
                    activities.includes(tag)
                      ? "bg-[#6A752D] text-white border-[#6A752D]"
                      : "bg-[#F5F5DC] hover:bg-[#E8E8D0]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-[#6A752D] text-white py-3 rounded-lg hover:bg-[#5A6425] transition"
          >
            Save Today's Mood
          </button>

          {/* Recent Entries */}
          <div className="mt-10">
            <h3 className="text-2xl font-semibold text-[#6A752D] mb-4">
              Recent Entries
            </h3>
            <div className="space-y-4">
              {entries.length === 0 ? (
                <p className="text-[#6B6B4D] italic">
                  No mood entries yet.
                </p>
              ) : (
                entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white p-4 rounded-lg shadow-md"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-medium text-[#6B6B4D]">
                        {entry.mood}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-[#999]">
                          {entry.createdAt?.toDate
                            ? new Date(entry.createdAt.toDate()).toLocaleString()
                            : new Date(entry.createdAt).toLocaleString()}
                        </span>
                        <button
                          onClick={() => confirmDelete(entry)}
                          className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {entry.journal && (
                      <p className="mt-2 text-[#555]">{entry.journal}</p>
                    )}
                    {entry.activities?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {entry.activities.map((a, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-[#E8E8D0] text-[#6B6B4D] px-2 py-1 rounded-full"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-[#6A752D] mb-4">
                Delete Mood Entry
              </h3>
              <p className="text-[#6B6B4D] mb-6">
                Are you sure you want to delete this mood entry? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-[#6B6B4D] bg-[#F5F5DC] border border-[#D1D1B0] rounded-lg hover:bg-[#E8E8D0] transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(entryToDelete.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Mood;
