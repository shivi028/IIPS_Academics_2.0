import React, { useEffect, useState, useCallback } from "react";
import { SiBookstack } from "react-icons/si";
import { FaAngleRight } from "react-icons/fa6";
import noData from "../../../assets/noData.svg";
import { UserAuth } from "../../../Context/AuthContext";
import { supabase } from "../../../supabaseClient";
import { CalendarIcon, PlusIcon } from "../../../Icons";
import ResourceUploadModal from "./ResourceUploadModal";
import toast from "react-hot-toast";

function Card({ children }) {
  return (
    <div className="bg-white shadow-sm border-b-2  cursor-pointer">
      {children}
    </div>
  );
}

function CardContent({ children }) {
  return (
    <div className="p-4 flex items-center justify-between ">{children}</div>
  );
}
export default function Syllabus({ canUpload }) {
  const { session } = UserAuth();
  const [syllabusFiles, setSyllabusFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  function handleOpenModal() {
    if (!canUpload) {
      toast.error("complete your profile to upload resource");
      return;
    }
    setIsModalOpen(true);
  }
  const handleCloseModal = () => setIsModalOpen(false);

  const handleUploadSuccess = useCallback(() => {
    setFetchTrigger((prev) => prev + 1);
    setTimeout(() => {
      handleCloseModal();
    }, 1500);
  }, []);

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    const fetchUserSyllabus = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("resources")
          .select(
            `
            id, title, uploaded_at, status,
            subject:subject_id (
              semester_number,
              course:course_id (name)
            )
          `
          )
          .eq("uploader_profile_id", session.user.id)
          .eq("resource_type", "SYLLABUS")

          .order("uploaded_at", { ascending: false });

        if (fetchError) throw fetchError;

        setSyllabusFiles(
          data.map((syllabus) => ({
            id: syllabus.id,
            title: syllabus.title,
            semester: `${syllabus.subject?.course?.name || ""} Semester ${
              syllabus.subject?.semester_number || ""
            }`,
            date: syllabus.uploaded_at
              ? new Date(syllabus.uploaded_at).toLocaleDateString()
              : "N/A",

            status: syllabus.status,
          }))
        );
      } catch (err) {
        console.error("Error fetching user syllabus:", err);
        setError(err.message || "Failed to fetch syllabus files.");
        setSyllabusFiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSyllabus();
  }, [session?.user?.id, fetchTrigger]);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">Loading your syllabus files...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="mt-3">
       <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {syllabusFiles.length > 0 ? (
          syllabusFiles.map((item) => (
            <Card key={item.id}>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 w-full justify-between">
                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-gray-200 rounded-full shrink-0">
                      <SiBookstack className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm sm:text-base break-words">
                          {item.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#3B3838]">{item.semester}</p>
                      <div className="flex flex-col sm:flex-row gap-2 mt-2 text-sm text-[#3B3838]">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span className="text-xs sm:text-sm">
                            {item.date}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-6  sm:mt-0 self-start sm:self-center ml-auto sm:ml-12">
                    {/* Reward display removed */}
                    <FaAngleRight className="bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] rounded-full w-5 h-5 sm:w-6 sm:h-6 " />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="w-full justify-center flex flex-col items-center text-center">
            <img
              src={noData}
              className="w-[200px] md:w-[250px]"
              alt="No syllabus files uploaded"
            />
            <p className="mt-4 text-lg text-gray-700">
              You haven't uploaded any syllabus files yet.
            </p>
            <p className="text-sm text-gray-500">
              Click "Upload New Syllabus" to share your first one!
            </p>
          </div>
        )}
      </div>
      <ResourceUploadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUploadSuccess={handleUploadSuccess}
        defaultResourceType="SYLLABUS"
      />
    </div>
  );
}
