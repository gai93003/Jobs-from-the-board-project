import "./JobCard.css"

 
export function JobCard(props){
  let diffDaysText = "N/A";
   if (props.active_from) {
    const activeDate = new Date(props.active_from);
    if (!isNaN(activeDate)) {
      const diffMs = new Date() - activeDate;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      diffDaysText = `${diffDays} days ago`;
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

      {/* MY APPLICATIONS — SHOW DROPDOWN */}
      {props.status && props.onStatusChange && (
        <div className="status-row">
          <label>Status: </label>
          <select
            value={props.status}
            onChange={(e) => props.onStatusChange(e.target.value)}
          >
            <option value="Interested">Interested</option>
            <option value="Application Started">Application Started</option>
            <option value="Application Submitted">Application Submitted</option>
            <option value="Invited to Interview">Invited to Interview</option>
            <option value="Application Declined">Application Declined</option>
          </select>
        </div>
      )}

      <a className="apply-link" href={props.apply_url} target="_blank">
      Apply Here
      </a>

      {/* DASHBOARD — SHOW INTERESTED BUTTON */}
      {!props.status && props.onInterested && (
        <button
          className="interested-btn"
          onClick={() => props.onInterested(props)}
        >
          Interested
        </button>
      )}
     

    </article>
  )

}
