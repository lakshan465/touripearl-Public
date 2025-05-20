import React, { useEffect, useState } from "react";
import Dashboard from "../../../dashboard/Dashboard";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loding2";
import Cat from "./GuideReviewCat";
import { StateChangeBtn, BottomDelete, BackBtn } from "./FilterBtn";
import { Card2 } from "./Card2";
import toast from "react-hot-toast";
function GuideReview() {
  const { userId } = useParams();

  const url = "http://localhost:8085/api/v1/guideApplications/" + userId; //to fect data base on id
  const statusUpdateUrl =
    "http://localhost:8085/api/v1/guideApplications/createGuide";
  const deleteUrl =
    "http://localhost:8085/api/v1/guideApplications/deleteGuideApplication";
  const [application, setApplication] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isReject, setIsReject] = useState(false);
  const Navi = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [guideApplicationId, setGuideApplicationId] = useState();
  const [loading, setLoading] = useState(true);
  const [showCard, setShowCard] = useState(false); //to show save cancle card turn it to true
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");
  const [icon, setIcon] = useState(true); //true for warning icon false for delete icon
  const [state, setstate] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url);

      setApplication(response.data.object);
      forBottmBtn(response.data.object);

      //console.log(response.data.object.guideApplicationId);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      //console.log("inside guide review fetch Data finally block")
      setTimeout(() => {
        setLoading(false);
      }, 200); //server loading simulation
    }
  };
  const updateState = async () => {
    setLoading(true);
    try {
      let response;
      if (state === "DELETE") {
        console.log("inside axios.delete(deleteUrl");
        setShowCard(false);
        response = await axios.delete(deleteUrl, {
          data: {
            guideApplicationId: userId,
            applicationStatus: state,
          },
        });
        // Check if response indicates success
        //if (response.status === 200) {
          toast.error("Application Deleted!", { icon: "❌" });
        //}
      } else {
        setShowCard(false);
        console.log("inside axios.post(statusUpdateUrl");
        response = await axios.post(statusUpdateUrl, {
          guideApplicationId: userId,
          applicationStatus: state,
        });
        //if (response.status === 200) {
          toast.success('Status Changed successfully!');
        //}
      }

      console.log("Response:", response?.message);
      console.log("inside updateState");
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      //console.log("inside guide review fetch Data finally block")
      setTimeout(() => {
        setLoading(false);
      }, 300); //server loading simulation
    }
  };
  const handleState = (e) => {
    const buttonValue = e.target.value;
    if (buttonValue === "APPROVED") {
      setstate("APPROVED");
      console.log("inside APPROVED");
      handleToApprove();
    } else if (buttonValue === "REJECTED") {
      setstate("REJECTED");
      handleToReject();
    } else if (buttonValue === "DELETE") {
      handleDelete();
    }
  };
  const handleToApprove = () => {
    setIcon(true);
    setTitle("Changing Status");
    setMsg("Click SAVE to Chang Status to APPROVE");
    setShowCard(true);
  };
  const handleToReject = () => {
    setIcon(true);
    setTitle("Changing Status");
    setMsg("Click SAVE to Chang Status to REJECT");
    setShowCard(true);
  };
  const handleDelete = () => {
    console.log("inside handleDelete");
    setstate("DELETE");
    setTitle("Deleting Application");
    setMsg("Click SAVE to DELETE");
    setIcon(false);
    setShowCard(true);
  };
  const handleSave = async () => {
    await updateState(); // Ensure the state update completes before re-fetching data
    if (state !== "DELETE") fetchData(); // Re-fetch the data to update the view for pending and rejected
    Navi(`/admin/guide-management/`);
  };

  const handleCancel = () => {
    setShowCard(false);
  };

  const forBottmBtn = (application) => {
    application.applicationStatus === "PENDING"
      ? setIsPending(true)
      : setIsPending(false);
    application.applicationStatus === "REJECTED"
      ? setIsReject(true)
      : setIsReject(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Dashboard title="Guide Management">
      <div className="container p-6 mx-auto">
        {loading ? (
          <Loader />
        ) : (
          <>
            <BackBtn application={application} />
            <Cat application={application} />
            {isPending && <StateChangeBtn handleState={handleState} />}
            {isReject && <BottomDelete handleDelete={handleDelete} />}
            {showCard && (
              <Card2
                title={title}
                msg={msg}
                handleSave={handleSave}
                handleCancel={handleCancel}
                icon={icon}
              />
            )}
          </>
        )}
      </div>
    </Dashboard>
  );
}

export default GuideReview;
