"use client";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Toaster, toast } from 'sonner';
import { apiService } from "@/apies/Services/UserService";
import { useAuthRedirect } from "@/utilities/Authentication";
import { use, useEffect, useState } from "react";
import SearchFilters from "@/components/searchFilter/SearchFilter";
import axios from "axios";

interface IContactFormValues {
   id?: string;
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
  categoryId?:string;
  followUpDate?: Date | null | string; // Add null and string as possible types
  followUpRemarks?: string;
}

const ContactSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  // email: Yup.string().email("Invalid email").required("Email is required"),
  // phoneNumber: Yup.string().required("Phone number is required"),
});



interface IContact {
  id: string;
  category: string;
  

}

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [selectedId, setselectedId] = useState("");
  const [selectedPrevId, setselectedPrevId] = useState("");
  const { isAuthenticated } = useAuthRedirect();
   const [filters, setFilters] = useState<Record<string, any>>({});
    const [data, setData] = useState<IContact[]>([]);
const [initialData, setInitialData] = useState<IContactFormValues>({
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
    category: '',
    categoryId: '',

    followUpDate: null,
    followUpRemarks: ''
});





  useEffect(() => {

    fetchData();

  },[])

//to get the Lead of Category
    const fetchData = async () => {
    setLoading(true);
    
    try {
      // const response = await apiService.fetchData("/contact/v3",{});
      const response = await apiService.fetchData("/non-followup",{});
      setData(response.data);
  

   const list = response.data;

    if (list.length > 0) {
      // Pehla record initial values me set kar do
      const first = list[0];
      setInitialData({
        id: first.id,
        name: first.name,
        designation: first.designation,
        businessName: first.businessName,
        website: first.website,
        phoneNumber: first.phoneNumber,
        email: first.email,
        facebook: first.facebook,
        insta: first.insta,
        linkedIn: first.linkedIn,
        address: first.address,
        state: first.state,
        city: first.city,
        categoryId: first.categoryId,
        category: first.category,
        followUpDate: first.followUpDate ? first.followUpDate.split('T')[0] : '',
        followUpRemarks: first.followUpRemarks
      });
    
      setselectedId(first.id);
      
    }


    } catch (err) {
      console.log("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };


  //to get the data of selected category
    const fetchDatabyCategory = async (id:string) => {
    setLoading(true);
    
    try {
      const response = await apiService.fetchData("/Contact/"+id,{});
      if (response.isSuccess) {
        setselectedId(id);
      console.log(response.data.name)
       setInitialData({
   id: response.data.id,
    name: response.data.name,
    designation: response.data.designation,
    businessName: response.data.businessName,
    website: response.data.website,
    phoneNumber: response.data.phoneNumber,
    email:  response.data.email,
    facebook: response.data.facebook,
    insta: response.data.insta,
    linkedIn: response.data.linkedIn,
    address: response.data.address,
    state: response.data.state,
    city:response.data.city,
    categoryId: response.data.categoryId,
    category: response.data.category,
    followUpDate: response.data.followUpDate ? response.data.followUpDate.split('T')[0] : '',

   // followUpDate:new Date(response.data.followUpDate),
    followUpRemarks: response.data.followUpRemarks
});


      }
      console.log("Data fetched contact successfully:", response.data);
    } catch (err) {
      console.log("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };
  

  //to get the data of selected category
  const fetchDatabyNext = async (id: string, currentValues: IContactFormValues) => {

  setLoading(true);
  try {
    // Prepare the update payload with proper date handling
    const updatePayload = {
      ...currentValues,
      followUpDate: currentValues.followUpDate 
        ? new Date(currentValues.followUpDate).toISOString() 
        : null
    };

    console.log("updated payloadss" ,updatePayload )
    // First update the current record
     setselectedPrevId(id);
 
    const updateResponse = await apiService.putData(
      `/Contact/${id}`, 
      updatePayload, 
      {}, 
      true
    );

    if (!updateResponse.isSuccess) {
      throw new Error("Failed to update current record");
    }


    

    // Then fetch the next record
    const response = await apiService.fetchData(
      // `/Contact/non-followup/${id}/next`, 
      `/non-followup/next/0`, 
      {}
    );
    // const response=await axios.get("http://localhost/test/non-followup/next/0")

    if (response.isSuccess) {
      setselectedId(response.data.id);
      
      const followUpDate = response.data.followUpDate 
        ? new Date(response.data.followUpDate) 
        : null;

      setInitialData({
        id: response.data.id,
        name: response.data.name,
        designation: response.data.designation,
        businessName: response.data.businessName,
        website: response.data.website,
        phoneNumber: response.data.phoneNumber,
        email: response.data.email,
        facebook: response.data.facebook,
        insta: response.data.insta,
        linkedIn: response.data.linkedIn,
        address: response.data.address,
        state: response.data.state,
        city: response.data.city,
        category: response.data.category,
        followUpDate: followUpDate,
        followUpRemarks: response.data.followUpRemarks || ''
      });

      toast.success("Lead updated and moved to next");
    }
  } catch (err) {
    console.error("Failed to fetch next record:", err);
    toast.error("Failed to move to next record");
  } finally {
    setLoading(false);
  }
};

  //to get the data of selected category
    const fetchDatabyPrev = async (id:string) => {
    setLoading(true);
    
    try {
      const response = await apiService.fetchData(`/Contact/non-followup/${id}/previous`,{});
       if (response.isSuccess) {
        
        setselectedId(response.data.id);
      console.log(response.data.name)



       const followUpDate = response.data.followUpDate 
        ? new Date(response.data.followUpDate) 
        : null;

       setInitialData({
id: response.data.id,
        name: response.data.name,
    designation: response.data.designation,
    businessName: response.data.businessName,
    website: response.data.website,
    phoneNumber: response.data.phoneNumber,
    email:  response.data.email,
    facebook: response.data.facebook,
    insta: response.data.insta,
    linkedIn: response.data.linkedIn,
    address: response.data.address,
    state: response.data.state,
    city:response.data.city,
    category: response.data.category,
    followUpDate:followUpDate,
    followUpRemarks: response.data.followUpRemarks? response.data.followUpRemarks : '',
    categoryId:response.data.categoryId

});

       }
      console.log("Data fetched contact successfully:", response.data);
    } catch (err) {
      console.log("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };
  


  const handleApplyFilters = (filterValues: Record<string, any>) => {
   setselectedId(filterValues.id);

   fetchDatabyCategory(filterValues.id);
    setFilters({ ...filterValues });
 
  };

  const handleResetFilters = () => {

    setselectedId("");
  setFilters({});
         setInitialData({
        name: '',
    designation: '',
    businessName: '',
    website: '',
    phoneNumber: '',
    email: '',
    facebook:'',
    insta:'',
    linkedIn: '',
    address:'',
    state:'',
    city:'',
    category: ''
});


  };

  const handleSubmit = async (values: IContactFormValues, { resetForm }: { resetForm: () => void }) => {
    setLoading(true);
    // values.id = selectedId;
    try {
      
        const payload = {
      ...values,
    //  id: selectedId,
      followUpDate: values.followUpDate === '' ? null : values.followUpDate
    };

    
      const response = await apiService.putData(`/Contact/${values.id}`, payload, {}, true);
      if (response.isSuccess) {
        toast.success("Lead has been Updated");

 const followUpDate = response.data.followUpDate 
        ? new Date(response.data.followUpDate) 
        : null;

               setInitialData({
    id: response.data.id,
    name: response.data.name,
    designation: response.data.designation,
    businessName: response.data.businessName,
    website: response.data.website,
    phoneNumber: response.data.phoneNumber,
    email:  response.data.email,
    facebook: response.data.facebook,
    insta: response.data.insta,
    linkedIn: response.data.linkedIn,
    address: response.data.address,   
    state: response.data.state,
    city:response.data.city,
    category: response.data.category,
    categoryId: response.data.categoryId,
    followUpDate:followUpDate,
    followUpRemarks: response.data.followUpRemarks? response.data.followUpRemarks : ''
});


        resetForm();

      }
    } catch (err) {
      toast.error("An error occurred while adding the contact");
    } finally {
      setLoading(false);
    }
  };

  // if (!isAuthenticated) return null;

  return (
    // <div className="w-full max-w-2xl mx-auto p-4">
    <div className="w-full  mx-auto p-4">


  <SearchFilters
          filters={[
        { title:"Category", name: "id",type:"select", placeholder:"Type",
          options: [
              ...(data?.map((users) => ({
                key: users.category,
                value: users.id,
              
              })) || []),

            ]
          }
        
        ]}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />

      <Toaster position="top-right" />
      <h2 className="text-xl font-bold mb-6">Leads Management</h2>
<Formik
  initialValues={initialData}
  enableReinitialize
  validationSchema={ContactSchema}
  onSubmit={handleSubmit}
>
  {({ isSubmitting,values,setFieldValue }) => (
    <Form className="space-y-4">
      {/* Basic Information - 3 Fields per Row */}
      <div className="flex flex-wrap -mx-2">
        {/* Name */}
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="name" className="block font-medium mb-1">
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

        {/* Designation */}
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="designation" className="block font-medium mb-1">
            Designation
          </label>
          <Field
            type="text"
            id="designation"
            name="designation"
            className="border rounded w-full p-2"
          />
        </div>

        {/* Business Name */}
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="businessName" className="block font-medium mb-1">
            Business Name
          </label>
          <Field
            type="text"
            id="businessName"
            name="businessName"
            className="border rounded w-full p-2"
          />
        </div>
      </div>

      {/* Second Row - 3 Fields */}
      <div className="flex flex-wrap -mx-2">
        {/* City */}
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="city" className="block font-medium mb-1">
            City
          </label>
          <Field
            type="text"
            id="city"
            name="city"
            className="border rounded w-full p-2"
          />
        </div>
     

   {/* State */}
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="state" className="block font-medium mb-1">
            State
          </label>
          <Field
            type="text"
            id="state"
            name="state"
            className="border rounded w-full p-2"
          />
        </div>


        {/* Phone Number */}
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="phoneNumber" className="block font-medium mb-1">
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

       

      </div>

      {/* Second Row - 3 Fields */}
      <div className="flex flex-wrap -mx-2">
        {/* City */}
       
        {/* Email */}
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="email" className="block font-medium mb-1">
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
      </div>

      {/* Third Row - 3 Fields */}
      <div className="flex flex-wrap -mx-2">
        {/* Website */}
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="website" className="block font-medium mb-1">
            Website
          </label>
          <Field
            type="text"
            id="website"
            name="website"
            className="border rounded w-full p-2"
          />
        </div>

        {/* Facebook */}
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="facebook" className="block font-medium mb-1">
            Facebook
          </label>
          <Field
            type="text"
            id="facebook"
            name="facebook"
            className="border rounded w-full p-2"
          />
        </div>

        {/* Instagram */}
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="insta" className="block font-medium mb-1">
            Instagram
          </label>
          <Field
            type="text"
            id="insta"
            name="insta"
            className="border rounded w-full p-2"
          />
        </div>
      </div>

      {/* Fourth Row - 3 Fields */}
      <div className="flex flex-wrap -mx-2">
        {/* LinkedIn */}
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="linkedIn" className="block font-medium mb-1">
            LinkedIn
          </label>
          <Field
            type="text"
            id="linkedIn"
            name="linkedIn"
            className="border rounded w-full p-2"
          />
        </div>

      
       
      </div>

      {/* Address (Full Width) */}
      <div className="flex flex-wrap -mx-2">
        <div className="w-full px-2 mb-4">
          <label htmlFor="address" className="block font-medium mb-1">
            Address
          </label>
          <Field
            type="text"
            as="textarea"
            id="address"
            name="address"
            className="border rounded w-full p-2"
          />
        </div>
      </div>

   



{selectedId && (

            <div className="mt-8 border-t pt-4">
              <h3 className="font-bold mb-4">Follow-Up Details</h3>
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/3 px-2 mb-4">
                  <label htmlFor="followUpDate" className="block font-medium mb-1">
                    Next Follow-up Date
                  </label>
                  <Field
                    type="date"
                    id="followUpDate"
                    name="followUpDate"
                    className="border rounded w-full p-2"
                      value={
    values.followUpDate instanceof Date ? 
      values.followUpDate.toISOString().split('T')[0] : 
      values.followUpDate === null || values.followUpDate === '' ? 
        '' : 
        values.followUpDate
  }
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(
      'followUpDate', 
      e.target.value ? new Date(e.target.value) : null
    );
  }}
                  />
                </div>
                <div className="w-full md:w-2/3 px-2 mb-4">
                  <label htmlFor="followUpRemarks" className="block font-medium mb-1">
                    Remarks
                  </label>
                  <Field
                    as="textarea"
                    id="followUpRemarks"
                    name="followUpRemarks"
                    className="border rounded w-full p-2"
                  />
                </div>
              </div>
            </div>
)}


      {/* Submit Button */}
      <div className="mt-6 flex justify-between">
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? "Processing..." : "Save Changes"}
        </button>

<div className="flex gap-2">

        <button
          type="button"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
        onClick={() => fetchDatabyPrev(selectedPrevId)}
        >
          Previous
        </button>
     
        <button
          type="button"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
        onClick={() => fetchDatabyNext(values.id||"",values)}
        >
          Next Random
        </button>

     
</div>

      </div>
    </Form>
  )}
</Formik>



    </div>
  );
};

export default Page;