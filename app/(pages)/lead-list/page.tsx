"use client";

import { apiService, askMessagesService } from "@/apies/Services/UserService";
import CommonListV3 from "@/components/(AdminPanel)/ListOfDatawithPagination/CommonListV3";
import Popup from "@/components/(AdminPanel)/popup";
import { useAuthRedirect } from "@/utilities/Authentication";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import Papa from 'papaparse';




interface IContact {
  id: string;
  name: string;
  designation: string;
  businessName: string;
  website: string;
  phoneNumber: string;
  email: string;
  facebook: string;
  followUpDate?: Date;
  insta: string;
  followUpRemarks: string;
  linkedIn: string;
  address: string;
  state: string;
  city: string;
   category: string;
  // type: number;
  //   categoryObj?: {
  //   id: number;
  //   name: string;
  // };
}

const Page = () => {
  useAuthRedirect();

  const [isPopup, setIsPopup] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cancelConfirmedId, setCancelConfirmedId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
    const [checklist, setchecklist] = useState<string[]>([]);
const [loading, setLoading] = useState(false);

    const handleBulkDelete = async () => {
      alert("Bulk delete initiated");
  if (checklist.length === 0) {
    toast.warning("Please select at least one contact");
    return;
  }

  try {

    const stringIds = checklist.map(id => id.toString());
    setLoading(true);
    const response = await apiService.deleteDataMultiple(
      "/Contact/deletemultiple",
      stringIds, // Send array of IDs
      false

    );

    if (response.isSuccess) {
      toast.success(`Deleted ${response.data} contacts successfully`);
      setchecklist([]); // Clear selection
      setRefreshKey(prev => prev + 1); // Refresh list
    }
  } catch (err) {
    toast.error("Failed to delete contacts");
  } finally {
    setLoading(false);
  }
};


const handleCheckboxChange = (id: string, isChecked: boolean) => {
  setchecklist(prev => {
    const newList = isChecked 
      ? [...prev, id] 
      : prev.filter(itemId => itemId !== id);
    
    // Debugging ke liye updated state print karein
    console.log("Updated checklist:", newList); 
    return newList;
  });
};



  const handleDelete = (id: string) => {
    setIsPopup(true);
    setSelectedId(id);
  };


  const onView=(id:string)=>{
  return `/update-lead/${id}`
}

  const handleDeleteConfirmed = async () => {
    if (!selectedId) return;
    try {
      const response = await askMessagesService.deleteMessage(
        "/Contact",
        selectedId.toString()
      );
      if (response.isSuccess) {
        toast.success("Successfully Deleted");
        setCancelConfirmedId(selectedId);
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <div className="w-full">



      <Toaster />
      <Popup
        isOpen={isPopup}
        setIsOpen={setIsPopup}
        title="Are you Sure You Want Delete"
        cancelText="Cancel"
        confirmText="Delete"
        onConfirm={handleDeleteConfirmed}
      />

      <h2 className="text-xl font-bold mb-4">Leads</h2>

      <CommonListV3<IContact>
        key={refreshKey}
        apiEndpoint="/contacts"
        columns={[
          { key: "name", label: "Name" },
          { key: "designation", label: "Designation" },
          { key: "businessName", label: "Business" },
           {
             key: "category", label: "Category",
           },
          { key: "phoneNumber", label: "Phone" },
          { key: "website", label: "Website" },
          { key: "facebook", label: "Facebook" },
          { key: "insta", label: "Instagram" },
   
          {
  key: "followUpDate",
  label: "Follow Up",
  render: (value) => {
    if (!value) return "-";
    const date = new Date(value);
    const today = new Date();

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const formattedDate = date.toLocaleDateString();

    return (
      <span className={isToday ? "bg-red-400 text-white px-2 py-1 rounded font-semibold" : ""}>
        {formattedDate}
      </span>
    );
  },
},

          { key: "followUpRemarks", label: "remarks" },
          { key: "linkedIn", label: "LinkedIn" },
          { key: "address", label: "Address" },
          { key: "state", label: "State" },
          { key: "city", label: "City" },
          { key: "email", label: "Email" },
         
        ]}
        onDelete={handleDelete}
      onView={onView}
        filtersPatterns={[
      
          {
            title: "Category",
            name: "category",
            type: "text",
            placeholder: "Search By Category",
          },
          {
            type: "select",
            title: "Follow Up",
            name: "followUptype",
            options: [{key: "followUp", value: "1"}, {key: "Non FollowUp", value: "2"}, {key: "All", value: "3"} ],
            placeholder: "Follow Up",
          }
        ]}

        onCheckboxChange={handleCheckboxChange}
        selectedItems={checklist}
        onBulkDelete={handleBulkDelete}
      />
    </div>
  );
};

export default Page;