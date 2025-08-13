                        
                        //to get the data of selected category

//     const fetchDatabyNext = async (id:string,currentValues: IContactFormValues) => {
//     setLoading(true);
//     console.log("Selected ID:", id); // Log the selected ID
//     console.log("Current Values:", currentValues); // Log the current values
//     try {
//       const response = await apiService.fetchData(`/Contact/non-followup/${id}/next`,{});

//       if (response.isSuccess) {
        
//         setselectedId(response.data.id);
//       console.log(response.data.name)

//        const followUpDate = response.data.followUpDate 
//         ? new Date(response.data.followUpDate) 
//         : null;

//       // followUpDate: currentValues.followUpDate === '' ? null : currentValues.followUpDate

//        setInitialData({
//         id: response.data.id,
//      name: response.data.name,
//     designation: response.data.designation,
//     businessName: response.data.businessName,
//     website: response.data.website,
//     phoneNumber: response.data.phoneNumber,
//     email:  response.data.email,
//     facebook: response.data.facebook,
//     insta: response.data.insta,
//     linkedIn: response.data.linkedIn,
//     address: response.data.address,
//     state: response.data.state,
//     city:response.data.city,
//     category: response.data.category,
//     // categoryId: response.data.categoryId,
//    followUpDate:followUpDate,
//   followUpRemarks: response.data.followUpRemarks || ''
// });

//     currentValues.followUpDate = followUpDate;
//   const updateResponse = await apiService.putData(`/Contact/${id}`, currentValues, {}, true);

  
//  if (updateResponse.isSuccess) {
//         toast.success("Lead updated and moved to next");
//       }
//       }
//       console.log("Data fetched contact successfully:", response.data);
//     } catch (err) {
//       console.log("Failed to fetch data");
//     } finally {
//       setLoading(false);
//     }
//   };