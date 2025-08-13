"use client";

import { apiService, askMessagesService } from "@/apies/Services/UserService";
import CommonListV3 from "@/components/(AdminPanel)/ListOfDatawithPagination/CommonListV3";
import Popup from "@/components/(AdminPanel)/popup";
import { useAuthRedirect } from "@/utilities/Authentication";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import Papa from "papaparse";

interface IContact {
  id?: string;
  name?: string;
  designation?: string;
  businessName?: string;
  website?: string;
  phoneNumber?: string;
  email?: string;
  facebook?: string;
  followUpDate?: Date;
  insta?: string;
  followUpRemarks?: string;
  linkedIn?: string;
  address?: string;
  state?: string;
  city?: string;
  category?: string;
}

const Page = () => {
  useAuthRedirect();

  const [isPopup, setIsPopup] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cancelConfirmedId, setCancelConfirmedId] = useState<string | null>(
    null
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [checklist, setchecklist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState<IContact[]>([]); // For displaying parsed CSV data
  const [showPreview, setShowPreview] = useState(false); // To toggle between preview and main list

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      transformHeader: (header) =>
        header.trim().toLowerCase().replace(/\*/g, "").replace(/\s+/g, ""),
      complete: (results) => {
        const validData = results.data
          .filter((item: any) => item.category && item.category.trim() !== "")
          .map((item: any, index: number) => ({
            id: `temp-${Date.now()}-${index}`, // Unique temporary ID

            category: item.category || "",
            name: item.name || "",
            phoneNumber: item.phonenumber || "",
            email: item.email || "",
            address: item.address || "",
            businessName: item.businessname || "",
            city: item.city || "",
            state: item.state || "",
            designation: item.designation || "",
            facebook: item.facebook || "",
            insta: item.instagram || "",
            linkedIn: item.linkedin || "",
            website: item.website || "",
          }));

        setParsedData(validData);
        setShowPreview(true); // Show preview after parsing
        e.target.value = ""; // Clear the input value
      },
      error: (error) => {
        toast.error("Error parsing CSV");
      },
    });
  };

  const handleUploadConfirmed = async () => {
    try {
      setLoading(true);

      // Create new array without the temporary id fields
      const uploadData = parsedData.map(({ id, ...rest }) => rest);

      const response = await apiService.postData(
        "/upload",
        uploadData, // Send data without temporary IDs
        {},
        true
      );

      if (response.isSuccess) {
        toast.success(`${parsedData.length} leads uploaded successfully!`);
        setRefreshKey((prev) => prev + 1);
        setShowPreview(false);
        setParsedData([]);
      }
    } catch (err) {
      toast.error("CSV upload failed");
    } finally {
      setLoading(false);
    }
  };
  const handleCancelUpload = () => {
    setShowPreview(false);
    setParsedData([]);
  };

  const handleDelete = (id: string) => {
    setParsedData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Row removed from preview");
  };

 

  return (
    <div className="w-full">
      <Toaster />

      <div className="mb-6 flex gap-4 align-baseline">

        <label className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 cursor-pointer disabled:bg-blue-400">
          Upload CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="hidden"
          />
        </label>
        <p className="text-sm text-gray-500 mt-2">
          Add new Lead 

        </p>
      
        {showPreview && (
                <div className="flex gap-4">
            <button
              onClick={handleUploadConfirmed}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-green-400"
            >
              {loading ? "Uploading..." : "Confirm Upload"}
            </button>
            <button
              onClick={handleCancelUpload}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        )}
    


      </div>

      
 <h3 className="text-lg text-gray-500 font-bold mb-4">
          CSV format should like: category,Name*,Designation,Business Name,City,State,Phone Number*,Email*,Website,Facebook,Instagram,LinkedIn,Address,,

        </h3>
      <h2 className="text-xl font-bold mb-4">Add Csv</h2>

      {showPreview ? (
        <div>
          <CommonListV3<IContact>
            key={refreshKey}
            sharedList={parsedData}
            apiEndpoint="/Contct"
            columns={[
              { key: "name", label: "Name" },
              { key: "designation", label: "Designation" },
              { key: "businessName", label: "Business" },
              { key: "category", label: "Category" },
              { key: "phoneNumber", label: "Phone" },
              { key: "website", label: "Website" },
              { key: "facebook", label: "Facebook" },
              { key: "insta", label: "Instagram" },
              { key: "linkedIn", label: "LinkedIn" },
              { key: "address", label: "Address" },
              { key: "state", label: "State" },
              { key: "city", label: "City" },
              { key: "email", label: "Email" },
            ]}
            onDelete={handleDelete}
          
          />

        </div>
      ) : null}
    </div>
  );
};

export default Page;
