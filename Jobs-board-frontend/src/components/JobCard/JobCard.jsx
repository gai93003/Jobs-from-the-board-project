import "./JobCard.css";
import { useEffect, useState } from "react";
import {
  createApplication,
  updateApplicationStatus,
  getApplicationByUserAndJob,
} from "../../utils/applicationsApi";


export function JobCard(props) {
  const now = new Date();
  let diffDaysText = "N/A";

  if (props.active_from) {
    const activeDate = new Date(props.active_from);
    if (!isNaN(activeDate)) {
      const diffMs = now - activeDate;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      diffDaysText = `${diffDays} days ago`;
    }
  }

  const [application, setApplication] = useState(null);
  const isInterested = application?.status === "Interested";

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.user_id;


useEffect(() => {
  if (!userId || !props.job_id) return;
  let cancelled = false;

  async function loadApplication() {
    try {
      const app = await getApplicationByUserAndJob(userId, props.job_id);
      if (!cancelled) {
        setApplication(app || null);
      }
    } catch (e) {
  
    }
  }

  loadApplication();

  return () => {
    cancelled = true;
  };
}, [userId, props.job_id]);

  async function handleInterestingClick() {
    if (!userId) return; // optionally redirect to login page 

    try {
      if (!application) {
        const created = await createApplication({
          userId,
          jobId: props.job_id,
          status: "Interested",
        });
        setApplication(created);
      } else if (!isInterested) {
        const updated = await updateApplicationStatus(
          application.application_id,
          "Interested"
        );
        setApplication(updated);
      } 
    } catch (e) {
      console.error(e);
    }
  }
  return(
    <article className="job-card">
      <h3 className="job-title">{props.title}</h3>
      <p className="company">{props.company}</p>
      <p><strong>Location:</strong> {props.location}</p>
      <p><strong>Type:</strong> {props.employment_type}</p>
      <p><strong>Exprience:</strong> {props.exp_level}</p>
      <p><strong>Source:</strong> {props.partner_name}</p>
      <p><strong>Job Age:</strong> {diffDaysText}</p>
      <a className="apply-link" href={props.apply_url} target="_blank">
      Apply Here
      </a>
    <button
        type="button"
        className={isInterested ? "apply-link" : "interesting-btn"}
        onClick={handleInterestingClick}>
        {isInterested ? "Interested" : "Interested"}
      </button>
  
    </article>
  )

}
