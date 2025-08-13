"use client";

import { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {Toaster,toast} from 'sonner'
import { apiService, askMessagesService, productService } from "@/apies/Services/UserService";
import Popup from "@/components/(AdminPanel)/popup";
import { useAuthRedirect } from "@/utilities/Authentication";
import { getTypeLabel } from "@/utilities/helpers.ts";
import CommonListV3 from "@/components/(AdminPanel)/ListOfDatawithPagination/CommonListV3";

interface IContactFormValues {
  id?: number;
  name: string;
  designation: string;
  businessName: string;
  website: string;
  phoneNumber: string;
  email: string;
  facebook: string;
  insta: string;
  linkedIn: string;
  address: string;
  state: string;
  city: string;
  category: string;
}

interface Contact {
  id: string;
  name: string;
  designation: string;
  businessName: string;
  website: string;
  phoneNumber: string;
  email: string;
  facebook: string;
  insta: string;
  linkedIn: string;
  address: string;
  state: string;
  city: string;
  category: string;
  type:number;
}

const ContactSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
});

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [onEditing, setOnEditing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<Contact[]>([]);


  const [initialValues, setInitialValues] = useState<IContactFormValues>({
    name: '',
    designation: '',
    businessName: '',
    website: '',
    phoneNumber: '',
    email: '',
    facebook: '',
    insta: '',
    linkedIn: '',
    address: '',
    state: '',
    city: '',
    category: ''
  });

  const handleProductUpdate = (newProduct: any) => {
    setRefreshKey((prev) => prev + 1);
  };


  const handleDeleteConfirmation = async (id: string) => {
    alert(id)
     setSelectedId(id); 
    setIsOpen(true);   
  };

  const handleDelete = async () => {
    try {
      if (!selectedId) return;
      const response = await askMessagesService.deleteMessage("https://localhost:7242/api/Contact", selectedId.toString()); 
      if (response.isSuccess) {
        toast.success("Successfully Deleted");
        handleProductUpdate(response); 
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  }

  const handleEdit = (id: string, updatedData: Contact) => {
    setOnEditing(true);
    setInitialValues({
      name: updatedData.name,
      designation: updatedData.designation,
      businessName: updatedData.businessName,
      website: updatedData.website,
      phoneNumber: updatedData.phoneNumber,
      email: updatedData.email,
      facebook: updatedData.facebook,
      insta: updatedData.insta,
      linkedIn: updatedData.linkedIn,
      address: updatedData.address,
      state: updatedData.state,
      city: updatedData.city,
      category: updatedData.category
    });
    setIsEditing(true);
  }

  const handleSubmit = async (values: IContactFormValues, { resetForm }: { resetForm: () => void }) => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      if (isEditing) {
        const response = await apiService.putData(
          "/Contact", values, {}, true
        );
     
        if (response.isSuccess) {
          toast.success("Contact has been Updated");
          handleProductUpdate(response.data); 
          resetForm(); 
          setIsEditing(false); 
          setInitialValues({
            name: '',
            designation: '',
            businessName: '',
            website: '',
            phoneNumber: '',
            email: '',
            facebook: '',
            insta: '',
            linkedIn: '',
            address: '',
            state: '',
            city: '',
            category: ''
          });
        }
      } else {
        const response = await apiService.postData(          
          "/Contact", values, {}, true
        );

        if (response.isSuccess) {
          toast.success("Contact has been Added");
          handleProductUpdate(response.data); 
          resetForm(); 
        }
      }
    } catch (err) {
      setErrorMessage("An error occurred while updating the contact.");
    } finally {
      setLoading(false);
    }
  };


const{ isAuthenticated}=useAuthRedirect();
 if(!isAuthenticated) return null; 

  return (
    <div className="w-full">
      <Toaster />
      <Popup isOpen={isOpen} setIsOpen={setIsOpen} title="Are you Sure You Want Delete" cancelText="Cancel" confirmText="Delete" onConfirm={handleDelete} />
    
      <h2 className="text-xl font-bold mb-4">Contacts</h2>
      <div className="w-full flex justify-between flex-wrap">
        <div className="w-1/3">
          {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}
          {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}

          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={ContactSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form>
                {/* Basic Information */}
                <div className="mb-4">
                  <label htmlFor="name" className="block font-medium">
                    Name*
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="border rounded w-full p-2"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <div className="mb-4">
                  <label htmlFor="designation" className="block font-medium">
                    Designation
                  </label>
                  <Field
                    type="text"
                    id="designation"
                    name="designation"
                    className="border rounded w-full p-2"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="businessName" className="block font-medium">
                    Business Name
                  </label>
                  <Field
                    type="text"
                    id="businessName"
                    name="businessName"
                    className="border rounded w-full p-2"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="category" className="block font-medium">
                    Category
                  </label>
                  <Field
                    type="text"
                    id="category"
                    name="category"
                    className="border rounded w-full p-2"
                  />
                </div>

                {/* Contact Information */}
                <div className="mb-4">
                  <label htmlFor="phoneNumber" className="block font-medium">
                    Phone Number*
                  </label>
                  <Field
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    className="border rounded w-full p-2"
                  />
                  <ErrorMessage name="phoneNumber" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block font-medium">
                    Email*
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="border rounded w-full p-2"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <div className="mb-4">
                  <label htmlFor="website" className="block font-medium">
                    Website
                  </label>
                  <Field
                    type="text"
                    id="website"
                    name="website"
                    className="border rounded w-full p-2"
                  />
                </div>

                {/* Social Media */}
                <div className="mb-4">
                  <label htmlFor="facebook" className="block font-medium">
                    Facebook
                  </label>
                  <Field
                    type="text"
                    id="facebook"
                    name="facebook"
                    className="border rounded w-full p-2"
                  />
                </div>
                

                <div className="mb-4">
                  <label htmlFor="insta" className="block font-medium">
                    Instagram
                  </label>
                  <Field
                    type="text"
                    id="insta"
                    name="insta"
                    className="border rounded w-full p-2"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="linkedIn" className="block font-medium">
                    LinkedIn
                  </label>
                  <Field
                    type="text"
                    id="linkedIn"
                    name="linkedIn"
                    className="border rounded w-full p-2"
                  />
                </div>

                {/* Address */}
                <div className="mb-4">
                  <label htmlFor="address" className="block font-medium">
                    Address
                  </label>
                  <Field
                    type="text"
                    id="address"
                    name="address"
                    className="border rounded w-full p-2"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="state" className="block font-medium">
                    State
                  </label>
                  <Field
                    type="text"
                    id="state"
                    name="state"
                    className="border rounded w-full p-2"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="city" className="block font-medium">
                    City
                  </label>
                  <Field
                    type="text"
                    id="city"
                    name="city"
                    className="border rounded w-full p-2"
                  />
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    {loading ? "Processing..." : isEditing ? "Update Contact" : "Create Contact"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <div className="w-[60%]">
          <CommonListV3<Contact>
            key={refreshKey}
            apiEndpoint="/Contact"
            columns={[
              { key: "name", label: "Name" },
              { key: "designation", label: "Designation" },
              { key: "businessName", label: "Business" },
              { key: "category", label: "Category" },
              { key: "phoneNumber", label: "Phone" },
              { key: "website", label: "website" },
              { key: "facebook", label: "facebook" },
              { key: "insta", label: "Instagram" },
              { key: "linkedIn", label: "linkedIn" },
              { key: "address", label: "Address" },
              { key: "state", label: "State" },
              { key: "city", label: "City" },
              { key: "email", label: "Email" },
           
            ]}
            onEdit={handleEdit}
            onDelete={handleDeleteConfirmation}
            // filtersPatterns={[
            //   { name: "name", type: "text", placeholder: "Search By Name" },
            //   { name: "category", type: "text", placeholder: "Search By Category" },
            // ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;