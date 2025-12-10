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

    <article className={`job-card ${props.isInterested ? 'interested' : ''}`}>
      {/* Green heart indicator when job is marked as interested */}
      {props.isInterested && (
        <div className="interested-badge">
          💚
        </div>
      )}
      
      <h3 className="job-title">
        {props.title}
      </h3>

      <p className="company">{props.company}
        {props.is_star && <span className="star-badge"> ⭐</span>}
      </p>

      <p><strong>Location:</strong> {props.location}</p>
      <p><strong>Type:</strong> {props.employment_type}</p>
      <p><strong>Work Place:</strong> {props.location_type}</p>
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
            <option value="Offer Received">Offer Received</option>
          </select>
        </div>
      )}


      <div className="job-card-actions">
        {/* DASHBOARD — SHOW INTERESTED BUTTON ABOVE APPLY LINK */}
        {!props.status && props.onInterested && (
          <button
            className={`interested-btn ${props.isInterested ? 'interested-active' : ''}`}
            onClick={() => props.onInterested(props)}
            disabled={props.isInterested}
          >
            {props.isInterested ? '💚 Interested' : '🤍 Mark as Interested'}
          </button>
        )}
        
        <a 
          className="apply-link" 
          href={props.apply_url} 
          target="_blank"
          rel="noopener noreferrer"
        >
          Apply Here
        </a>
      </div>


    </article>
  )

}
