import "./JobCard.css"


export function JobCard(props){
  const activeDate = new Date(props.active_from);
  const now = new Date();

  const diffMs = now - activeDate; 
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return(
    <article className="job-card">
      <h3 className="job-title">{props.title}</h3>
      <p className="company">{props.company}</p>
      <p><strong>Location:</strong> {props.location}</p>
      <p><strong>Type:</strong> {props.employment_type}</p>
      <p><strong>Exprience:</strong> {props.exp_level}</p>
      <p><strong>Source:</strong> {props.partner_name}</p>
      <p><strong>Job Age:</strong> {diffDays} days ago</p>


      <a className="apply-link" href={props.apply_url} target="_blank">
      Apply Here
      </a>

    </article>
  )

}
