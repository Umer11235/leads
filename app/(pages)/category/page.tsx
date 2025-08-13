"use client";

import { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {Toaster,toast} from 'sonner'
import { apiService, askMessagesService, productService } from "@/apies/Services/UserService";
import Popup from "@/components/(AdminPanel)/popup";
import { useAuthRedirect } from "@/utilities/Authentication";
import CommonListV3 from "@/components/(AdminPanel)/ListOfDatawithPagination/CommonListV3";

interface ICategory {
  id?: number;
  name: string;

}

interface Category {
  id: string;
  name: string;

}

const ContactSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),

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
  const [data, setData] = useState<Category[]>([]);


  const [initialValues, setInitialValues] = useState<ICategory>({
    name: '',
  
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
      const response = await askMessagesService.deleteMessage("https://localhost:7242/api/category", selectedId.toString()); 
      if (response.isSuccess) {
        toast.success("Successfully Deleted");
        handleProductUpdate(response); 
      }
    } catch (error) {
      console.error("Error deleting Category:", error);
    }
  }

  const handleEdit = (id: string, updatedData: Category) => {
    setOnEditing(true);
    setSelectedId(id);
    setInitialValues({
      name: updatedData.name,
  
    });
    setIsEditing(true);
  }

  const handleSubmit = async (values: ICategory, { resetForm }: { resetForm: () => void }) => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      if (isEditing) {
        const response = await apiService.putData(
          "/category/"+selectedId, values, {}, true
        );
     
        if (response.isSuccess) {
          toast.success("Category has been Updated");
          handleProductUpdate(response.data); 
          resetForm(); 
          setIsEditing(false); 
          setInitialValues({
            name: '',
    
          });
        }
      } else {
        const response = await apiService.postData(          
          "/category", values, {}, true
        );

        if (response.isSuccess) {
          toast.success("Category has been Added");
          handleProductUpdate(response.data); 
          resetForm(); 
        }
      }
    } catch (err) {
      setErrorMessage("An error occurred while updating the Category.");
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
    
      <h2 className="text-xl font-bold mb-4">Categories</h2>
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

               

                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    {loading ? "Processing..." : isEditing ? "Update Category" : "Create Category"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <div className="w-[60%]">
          <CommonListV3<Category>
            key={refreshKey}
            apiEndpoint="/category"
            columns={[
              { key: "name", label: "Name" },
         
           
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