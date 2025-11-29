import "./JobCard.css"


export function JobCard(props){
  return(
    <article className="job-card">
      <h3 className="job-title">{props.name}</h3>
      <p className="company">{props.company}</p>
      <p><strong>Location:</strong> {props.cityCategory}</p>
      <p><strong>Type:</strong> {props.jobType}</p>
      <p><strong>Exprience:</strong> {props.expLevel}</p>
      <p><strong>Source:</strong> {props.partnerName}</p>

      <a className="apply-link" href={props.apply_url} target="_blank">
      Apply Here
      </a>

    </article>
  )

}
