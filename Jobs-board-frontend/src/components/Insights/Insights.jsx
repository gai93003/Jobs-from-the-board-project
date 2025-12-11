import { useState } from "react";
import { MOCK_INSIGHTS } from "./MockDataInsight";
import "./Insights.css";

// Small helper: format 0.2 => "20%"
function formatPercent(value) {
  if (value == null) return "-";
  return `${(value * 100).toFixed(0)}%`;
}

// Which label for timeframe
const TIMEFRAME_LABELS = {
  "30_days": "Last 30 days",
  "3_months": "Last 3 months",
  "all_time": "All time",
};

export default function Insights() {
  // For now we just keep this state local and use mock data.
  const [timeframe, setTimeframe] = useState("30_days");
  const insights = MOCK_INSIGHTS;

  const focusStage =
    insights.stages.find((s) => s.id === insights.focusStageId) || null;

  // You can later change this function to use real advice based on data
  function getFocusTitle(stageId) {
    switch (stageId) {
      case "initial_screening":
        return "Initial Screening";
      case "hm_screening":
        return "Hiring Manager Screening";
      case "first_round":
        return "1st Round Interview";
      case "second_round":
        return "2nd Round Interview";
      case "receive_offer":
        return "Receive Offer";
      default:
        return "Your Funnel";
    }
  }

  function getFocusBullets(stageId) {
    switch (stageId) {
      case "initial_screening":
        return [
          "Tailor your CV and Cover Letter for each specific role.",
          "Use keywords from the job description (word clouds can help).",
          "Ask a mentor or peer to review your CV before submitting.",
        ];
      // case "hm_screening":
      //   return [
      //     "Make sure your CV and interview answers tell the same story.",
      //     "Prepare 3–4 clear achievement stories aligned to the job.",
      //     "Practice concise answers: problem → action → impact.",
      //   ];
      case "first_round":
        return [
          "Research the company and its product in detail.",
          "Prepare thoughtful questions for the interviewer.",
          "Practice mock interviews with someone from your course.",
        ];
      case "second_round":
        return [
          "Deepen your technical examples and system thinking.",
          "Show how you collaborate in a team and resolve conflict.",
          "Clarify your salary / role expectations in advance.",
        ];
        case "receive_offer":
        return [
          "Congradulation",
        ];
      default:
        return [
          "Keep your statuses up to date so the insights stay accurate.",
        ];
    }
  }

  return (
    <div className="insights-page">
      {/* Top heading */}
      <div className="insights-header">
        <div>
          <h1 className="insights-title">My Application Insights</h1>
          <p className="insights-subtitle">
            Track your progress and get data-driven advice to land your first role in tech.
          </p>
        </div>

        <div className="timeframe-toggle">
          {[
            { id: "30_days", label: "Last 30 days" },
            { id: "3_months", label: "Last 3 months" },
            { id: "all_time", label: "All time" },
          ].map((t) => (
            <button
              key={t.id}
              className={
                timeframe === t.id
                  ? "timeframe-chip timeframe-chip--active"
                  : "timeframe-chip"
              }
              onClick={() => setTimeframe(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main cards strip */}
      <section className="insights-strip">
        {insights.stages.map((stage, idx) => (
          <StageCard
            key={stage.id}
            stage={stage}
            isFirst={idx === 0}
            isLast={idx === insights.stages.length - 1}
            isFocus={stage.id === insights.focusStageId}
          />
        ))}
      </section>

      {/* Feedback panel */}
      <section className="feedback-panel">
        <div className="feedback-header">
          <div className="feedback-icon">💡</div>
          <h2>Actionable Feedback</h2>
        </div>

        <div className="feedback-body">
          <p className="feedback-focus-line">
            <strong>Focus on: </strong>
            {focusStage
              ? getFocusTitle(focusStage.id)
              : "Building your application funnel"}
          </p>

          <p className="feedback-summary">
            Your application numbers are a great starting point. Use this guidance
            to improve your conversion at the current bottleneck in your funnel.
          </p>

          <ul className="feedback-list">
            {getFocusBullets(insights.focusStageId).map((item, i) => (
              <li key={i}>
                <span className="tick">✔</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="feedback-note">
            Tip: These insights will become more accurate as you keep your application
            statuses up-to-date in the Job Board.
          </p>
        </div>
      </section>
    </div>
  );
}

/**
 * Stage card component
 * Shows % value + small benchmark ruler (pessimistic / mean / optimistic)
 */
function StageCard({ stage, isFirst, isLast, isFocus }) {
  const hasBenchmarks = !!stage.benchmarks;

  // Compute where current value sits between pessimistic and optimistic
  let pointerPos = 0;
  if (hasBenchmarks && stage.value != null) {
    const { pessimistic, optimistic } = stage.benchmarks;
    const clamped = Math.max(
      pessimistic,
      Math.min(optimistic, stage.value)
    );
    const ratio = (clamped - pessimistic) / (optimistic - pessimistic || 1);
    pointerPos = ratio * 100;
  }

  return (
    <div className="stage-card-wrapper">
      <div
        className={
          "stage-card" + (isFocus ? " stage-card--focus" : "")
        }
      >
        <div className="stage-header">
          <span className="stage-label">{stage.label}</span>
          {isFirst && (
            <span className="stage-apps-subtitle">
              Total applications sent
            </span>
          )}
        </div>

        {stage.value == null ? (
          <div className="stage-main">
            <div className="stage-number">{stage.count}</div>
          </div>
        ) : (
          <div className="stage-main">
            <div className="stage-number">{formatPercent(stage.value)}</div>
          </div>
        )}

        {hasBenchmarks && (
          <div className="stage-benchmarks">
            <div className="benchmarks-label-row">
              <span>Pessimistic: {formatPercent(stage.benchmarks.pessimistic)}</span>
              <span>Mean: {formatPercent(stage.benchmarks.mean)}</span>
              <span>Optimistic: {formatPercent(stage.benchmarks.optimistic)}</span>
            </div>
            <div className="benchmarks-bar">
              <div className="benchmarks-segment pessimistic" />
              <div className="benchmarks-segment mean" />
              <div className="benchmarks-segment optimistic" />
              {stage.value != null && (
                <div
                  className="benchmarks-pointer"
                  style={{ left: `${pointerPos}%` }}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {!isLast && <div className="stage-arrow">➜</div>}
    </div>
  );
}
