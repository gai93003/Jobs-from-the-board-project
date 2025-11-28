import { createJob } from './jobsService.js';
import { createJob, findJobByApplyUrl } from './jobsService.js';

// Replaced with the actual URL of the external jobs API
const EXTERNAL_API_URL = 'https://devitjobs.uk/api/jobsLight';

function mapEmploymentType(externalType) {
  switch (externalType) {
    case 'Full-Time':
    case 'Full time':
    case 'full-time':
      return 'Full-time';
    case 'Part-Time':
    case 'Part time':
    case 'part-time':
      return 'Part-time';
    case 'Contract':
      return 'Contract';
    case 'Internship':
      return 'Internship';
    case 'Freelance':
      return 'Freelance';
    default:
      // safe fallback that exists in your ENUM
      return 'Full-time';
  }
}
export async function importJobsFromExternal() {
  const response = await fetch(EXTERNAL_API_URL);
  if (!response.ok) throw new Error('Failed to fetch jobs');
  const externalJobs = await response.json();

  for (const externalJob of externalJobs) {
    const applyUrl =
      externalJob.redirectJobUrl && externalJob.redirectJobUrl.trim() !== ''
        ? externalJob.redirectJobUrl
        : `https://devitjobs.uk/job/${externalJob.jobUrl}`;

    const techStack = (externalJob.technologies?.join(', ') || 'Unknown').slice(0, 255);
    const source = 'DevITJobs'.slice(0, 255);
    const safeApplyUrl = applyUrl.slice(0, 255);

    // 1) skips the job if already in DB
    const existing = await findJobByApplyUrl(safeApplyUrl);
    if (existing) {
    continue; // goesto next externalJob
    }
//   inserts new job
    await createJob({
      title: externalJob.name,
      company: externalJob.company,
      location: externalJob.actualCity,
      employment_type: mapEmploymentType(externalJob.jobType),
      tech_stack: techStack,
      source,
      apply_url: safeApplyUrl,
      approved_at: null,
      exp_level: externalJob.expLevel,
      partner_name: externalJob.partnerName
    });
  }
}


