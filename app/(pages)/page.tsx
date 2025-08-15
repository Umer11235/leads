"use client";

import { apiService } from "@/apies/Services/UserService";
import SimpleCard from "@/components/(AdminPanel)/(Card)/SimpleCard/SimpleCard";
import Icons from "@/utilities/icons/icons";
import { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

const Home = () => {


  const [total, settotal] = useState("0");
  const [followUp, setfollowUp] = useState("0");
  const [nonFollowup, setnonFollowup] = useState("0");

  useEffect(() => {

    handleFetchData();
  }, []);


const handleFetchData= async()=>{
  const response =await apiService.fetchData("/stats")
  console.log("response",response)
  if (response.isSuccess) {
  settotal(response.data.totalLeads);
  setfollowUp(response.data.followUpLeads);  
  setnonFollowup(response.data.nonFollowUpLeads);
  }
}


  // const products = localStorage.getItem('products');
  // const Users = localStorage.getItem('users');
  // const Orders = localStorage.getItem('orders');
  // const Requested = localStorage.getItem('requested');


  const eventsData = [
    {
      Message: "i would like to buy there is any more stock ?",
      Update: <input type="text" className="border-2"/>,
      "Action":"Delete",
    
    },
    {
      Message: "Can you provide more details about this item",
      Update: <input type="text" className="border-2"/>,
     "Action": "Delete",
    
    },
    {
      Message: "Are there any defects or issues with the item?",
      Update: <input type="text" className="border-2"/>,
      "Action": "Delete",
     
    },
    {
      Message: "Where would be a convenient meetup spot for us?",
      Update: <input type="text" className="border-2"/>,
      "Action": "Delete",
    },
    // Add more data as needed
  ];

  const columns = ["Message", "Update", "Action"];


  return (
    <div>
      <p className="font-bold pb-3 px-2">Home</p>

      <div className="flex flex-wrap w-full">
        <div className="flex flex-wrap gap-4 w-[50%]? w-full justify-evenly ">
          <SimpleCard
            title="Total Leads"
            value={total? total:"0"}
            percentage="+5.27%"
            bgColor="#E3F5FF"
            icon2={<Icons icon="VectorTop" />}
          />

          <SimpleCard
            title="Followup"
            value={followUp ? followUp:"0"}
            percentage="+5.27%"
            icon={<Icons icon="listCheck" />}
            bgColor="#E3E3E3"
            icon2={<Icons icon="VectorTop" />}
          />

          <SimpleCard
            title="Non Followup"
            value={nonFollowup ? nonFollowup:"0"}
            percentage="+5.27%"
            bgColor="white"
            icon2={<Icons icon="VectorTop" />}
          />
          {/* <SimpleCard
            title="Requested Users"
            value={Requested ? Requested:"0"}
            percentage="-0.27%"
            icon={<FaCalendarAlt />}
            bgColor="#E5ECF6"
            icon2={<Icons icon="VectorDown" />}
          /> */}
        </div>

        {/* <div className="flex flex-wrap  w-1/2 rounded-2xl ">
          <EmailAlert
            data={data}
            barDataKey="pv"
            tooltipContent={tooltipContent}
          />
        </div> */}
      </div>

      <div className="flex flex-wrap w-full mt-6 justify-between bottom-2 ">
        <div className="flex flex-wrap w-[72%]? w-full rounded-2xl border-2 overflow-hidden   ">
          {/* <TopEvents
            title="Comments"
            columns={columns}
            data={[]}
            Width="w-full"
          /> */}
        </div>
        {/* <div className="flex flex-wrap w-1/4  bg-white rounded-3xl">
          <PieChart />
        </div> */}
      </div>
    </div>
  );
};

export default Home;
