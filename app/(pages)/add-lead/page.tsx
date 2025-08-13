"use client";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Toaster, toast } from 'sonner';
import { apiService } from "@/apies/Services/UserService";
import { useAuthRedirect } from "@/utilities/Authentication";
import { use, useEffect, useState } from "react";
import Dropdown from "@/components/(AdminPanel)/(Fields)/inputs/Dropdown/Dropdown";

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







interface ICategory {
  id: string;
  name: string;
  

}

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [selectedId, setselectedId] = useState("");
  const { isAuthenticated } = useAuthRedirect();
   const [filters, setFilters] = useState<Record<string, any>>({});
    const [data, setData] = useState<ICategory[]>([]);
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
      const response = await apiService.fetchData("/Category",{});
      setData(response.data);
      console.log("Data fetched contact successfully:", response.data);
    } catch (err) {
      console.log("Failed to fetch data");
    } finally {
      setLoading(false);
    }
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

    console.log("Payload to be sent:", values);
    
      const response = await apiService.postData(`/Contact`, values, {}, true);
      if (response.isSuccess) {
        toast.success("Lead has been Added");

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

  if (!isAuthenticated) return null;

  return (
    // <div className="w-full max-w-2xl mx-auto p-4">
    <div className="w-full  mx-auto p-4">




      <Toaster />
      <h2 className="text-xl font-bold mb-6">Leads form</h2>
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

        {/* category */}
        <div className="w-full md:w-1/3 px-2 mb-4">
          {/* Category Dropdown */}
  <label htmlFor="categoryId" className="block font-medium mb-1">
    Category*
  </label>
  <Field
    as="select"
    id="categoryId"
    name="categoryId"
    className="border rounded w-full p-2"
  >
    <option value="">Select a category</option>
    {data.map((cat) => (
      <option key={cat.id} value={cat.id}>
        {cat.name}
      </option>
    ))}
  </Field>
  <ErrorMessage name="category" component="div" className="text-red-600 text-sm mt-1" />

{/* If you need to store categoryId separately */}
{/* <Field type="hidden" name="categoryId" value={values.categoryId} /> */}
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

   

      {/* Submit Button */}
      <div className="mt-6 flex justify-between">
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? "Processing..." : "Add new Lead"}
        </button>


      </div>
    </Form>
  )}
</Formik>



    </div>
  );
};

export default Page;