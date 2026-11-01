import { useState } from "react";
import {
  Server,
  Database,
  Cpu,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  ShieldCheck,
  Activity,
  FileCode,
  HardDrive,
  RefreshCw,
  GitBranch,
  Radio,
  Boxes,
  Workflow,
  ExternalLink,
} from "lucide-react";
import { SectionHeading } from "./primitives";
import { MathView } from "./MathView";

/* -------------------------------------------------------------------------- */
/* BATCH SCORING PIPELINE STEPS                                               */
/* -------------------------------------------------------------------------- */
interface PipelineStep {
  id: string;
  stepNumber: string;
  name: string;
  role: string;
  tools: string;
  details: string;
  monitoringFocus: string;
}

const batchPipelineSteps: PipelineStep[] = [
  {
    id: "data_sources",
    stepNumber: "01",
    name: "Data Sources",
    role: "Originating raw transactional and behavioural data.",
    tools: "PostgreSQL, MySQL, CRM (Salesforce), Kafka logs, S3 Data Lake",
    details:
      "Captures raw subscriber activities: daily logins, transaction history, customer service tickets, and billing events across production databases.",
    monitoringFocus: "Source database availability, replication lag, and connection pool saturation.",
  },
  {
    id: "data_ingestion",
    stepNumber: "02",
    name: "Data Ingestion (ETL / ELT)",
    role: "Extracts and consolidates raw records into batch landing zones.",
    tools: "Apache Airflow, Prefect, dbt, AWS Glue, Google Cloud Dataflow",
    details:
      "Scheduled nightly DAGs extract incremental records modified within the past 24 hours, transforming raw tables into partitioned Parquet files.",
    monitoringFocus: "Ingestion pipeline failure rate, execution time, and dropped record volume.",
  },
  {
    id: "data_validation",
    stepNumber: "03",
    name: "Data Validation & Quality Checks",
    role: "Guarantees schema integrity and filters corrupted records.",
    tools: "Great Expectations, Pydantic, Pandera, AWS Deequ",
    details:
      "Executes declarative assertions: verifies expected columns exist, checks for null rates on required features, validates numerical bounds, and halts the job if data quality tests fail.",
    monitoringFocus: "Schema anomalies, missingness spikes, and unexpected distribution shifts.",
  },
  {
    id: "feature_processing",
    stepNumber: "04",
    name: "Feature Engineering & Aggregation",
    role: "Transforms raw records into model-compatible numerical vectors.",
    tools: "PySpark, Polars, DuckDB, scikit-learn Transformers",
    details:
      "Calculates rolling aggregates (e.g. 30-day login frequency, 90-day spend deviation, customer support ticket velocity) and imputes missing values using saved median vectors.",
    monitoringFocus: "Feature computation drift, numerical overflow, and feature null rates.",
  },
  {
    id: "feature_store",
    stepNumber: "05",
    name: "Feature Store / Data Warehouse",
    role: "Maintains train-serve consistency and serves reusable feature sets.",
    tools: "Feast, Hopsworks, Snowflake, Databricks Unity Catalog, BigQuery",
    details:
      "Stores pre-computed offline features. Guarantees that identical feature transformations used during model training are applied during batch inference, eliminating train-serve skew.",
    monitoringFocus: "Feature freshness, time-travel consistency, and metadata versioning.",
  },
  {
    id: "batch_job",
    stepNumber: "06",
    name: "Batch Scoring Job Orchestration",
    role: "Launches scheduled distributed inference runners.",
    tools: "Apache Airflow, Prefect, Kubernetes CronJobs, AWS Batch",
    details:
      "Cron orchestrator triggers the batch job at 02:00 AM. Spawns ephemeral compute clusters (e.g. 16-core CPU nodes) dedicated exclusively to inference execution.",
    monitoringFocus: "Job startup latency, container exit codes, and memory consumption.",
  },
  {
    id: "model_loading",
    stepNumber: "07",
    name: "Model Registry & Serialization Load",
    role: "Retrieves pinned, version-controlled model artifacts.",
    tools: "MLflow Model Registry, Weights & Biases, S3 / GCS buckets",
    details:
      "Pulls the production-tagged Random Forest artifact (e.g. churn_rf_model:v2.4.1.joblib) from the registry, verifying cryptographic checksums before memory loading.",
    monitoringFocus: "Artifact download integrity, model version verification, and deserialize time.",
  },
  {
    id: "model_inference",
    stepNumber: "08",
    name: "Bulk Model Inference Execution",
    role: "Computes parallelized tree predictions across all records.",
    tools: "Scikit-Learn, Treelite, ONNX Runtime, Ray",
    details:
      "Executes rf.predict_proba(X_batch) in parallel chunks using all CPU cores (n_jobs=-1). Evaluates 2 million customer feature vectors in ~8 minutes.",
    monitoringFocus: "Batch throughput (rows/sec), CPU core saturation, and RAM headroom.",
  },
  {
    id: "post_processing",
    stepNumber: "09",
    name: "Post-Processing & Decision Rules",
    role: "Applies probability calibration, risk tiers, and business thresholds.",
    tools: "Python Business Engine, Drools, Rule Sets",
    details:
      "Applies the operational churn threshold: customers with P(churn) >= 0.65 are tagged HIGH_RISK; 0.40–0.64 MEDIUM_RISK. Assigns recommended retention voucher codes.",
    monitoringFocus: "Percentage of records assigned to each tier; alerts on sudden tier shifts.",
  },
  {
    id: "prediction_storage",
    stepNumber: "10",
    name: "Prediction Storage & Downstream Sync",
    role: "Persists predictions into queryable production tables.",
    tools: "Snowflake, PostgreSQL, BigQuery, Redis, DynamoDB",
    details:
      "Writes scored results with user_id, churn_score, risk_tier, model_version, and scored_at timestamp into production analytical databases.",
    monitoringFocus: "Write throughput, disk IOPS, and table partition replacement.",
  },
  {
    id: "monitoring_feedback",
    stepNumber: "11",
    name: "Production Monitoring & Feedback Loop",
    role: "Continuously audits data drift and downstream outcomes.",
    tools: "Evidently AI, WhyLabs, Prometheus, Grafana, Slack Alerts",
    details:
      "Computes Kolmogorov-Smirnov (KS) drift statistics comparing today's feature distributions against training baselines. Validates actual churn 30 days later to track True Positive rates.",
    monitoringFocus: "Population Stability Index (PSI), concept drift, and model decay alerts.",
  },
];

/* -------------------------------------------------------------------------- */
/* REAL-TIME MICROSERVICE SCORING STEPS                                       */
/* -------------------------------------------------------------------------- */
const realtimePipelineSteps: PipelineStep[] = [
  {
    id: "client_app",
    stepNumber: "01",
    name: "Client Application",
    role: "Submits synchronous online scoring request.",
    tools: "Web Frontend, Mobile App, Partner API, Microservice",
    details:
      "A user submits an online loan application. The web server issues an HTTP POST request containing applicant attributes: { income: 75000, fico: 710, dti: 0.28, amount: 25000 }.",
    monitoringFocus: "Network latency, client timeouts, and retry storms.",
  },
  {
    id: "api_gateway",
    stepNumber: "02",
    name: "API Gateway & Load Balancer",
    role: "Directs incoming traffic, enforces rate limiting and TLS.",
    tools: "Kong, Nginx, AWS ALB, Envoy, Traefik",
    details:
      "Terminates TLS, throttles abuse, balances requests across active microservice pods, and routes to /api/v1/predict/loan-risk.",
    monitoringFocus: "Total request rate (RPS), HTTP 4xx/5xx status codes, and TLS handshake latency.",
  },
  {
    id: "auth_service",
    stepNumber: "03",
    name: "Authentication & Authorization",
    role: "Validates API keys and OAuth tokens.",
    tools: "OAuth 2.0, JWT, Auth0, Okta, Vault",
    details:
      "Verifies the calling service has valid permissions to query the risk scoring model, preventing unauthorized access to sensitive financial endpoints.",
    monitoringFocus: "Token validation failures, expired signatures, and latency overhead.",
  },
  {
    id: "fastapi_service",
    stepNumber: "04",
    name: "FastAPI Prediction Microservice",
    role: "High-performance async ASGI application container.",
    tools: "FastAPI, Uvicorn, Python 3.12, Docker",
    details:
      "Asynchronous web framework that manages incoming scoring requests with minimal overhead. Pre-loads model artifact into worker memory on server startup (lifespan event).",
    monitoringFocus: "Worker concurrency, event loop lag, and process RSS memory.",
  },
  {
    id: "request_validation",
    stepNumber: "05",
    name: "Request Schema Validation",
    role: "Validates input types, values, and required fields.",
    tools: "Pydantic v2, TypedDict",
    details:
      "Strictly asserts data types: ensures FICO is an integer between 300 and 850, income > 0, and flags missing fields with immediate 422 Unprocessable Entity responses.",
    monitoringFocus: "Validation rejection rate, malformed payload frequencies.",
  },
  {
    id: "feature_enrichment",
    stepNumber: "06",
    name: "Online Feature Enrichment",
    role: "Retrieves low-latency real-time feature context.",
    tools: "Redis, Feast Online Store, DynamoDB",
    details:
      "Queries low-latency key-value store (< 3ms) for pre-computed user features (e.g. 30-day overdraft count, historical account tenure) and merges them with the request payload.",
    monitoringFocus: "Cache hit ratio, Redis lookup p99 latency, and missing key fallbacks.",
  },
  {
    id: "in_memory_model",
    stepNumber: "07",
    name: "In-Memory Model Scoring",
    role: "Executes single-sample vectorized tree scoring.",
    tools: "Scikit-Learn, Treelite compiled C-runtime, ONNX Runtime",
    details:
      "CRITICAL: The Random Forest artifact is pre-loaded in RAM at process startup—NEVER loaded from disk per request! Treelite evaluates 200 decision trees in ~0.8 ms.",
    monitoringFocus: "Inference compute latency (p95 and p99 percentiles), CPU utilization.",
  },
  {
    id: "probability_calibration",
    stepNumber: "08",
    name: "Probability Calibration & Sigmoid Mapping",
    role: "Transforms raw tree vote tallies into true risk probabilities.",
    tools: "CalibratedClassifierCV, Platt Sigmoid, Isotonic Regression",
    details:
      "Maps raw Random Forest voting fractions through a pre-fitted sigmoid function, converting ensemble tallies into statistically calibrated default probabilities: P(default) = 0.082.",
    monitoringFocus: "Calibration curve drift, probability distribution stability.",
  },
  {
    id: "business_rules",
    stepNumber: "09",
    name: "Business Logic & Underwriting Rules",
    role: "Translates probabilities into actionable business recommendations.",
    tools: "Business Logic Engine, Policy Tables",
    details:
      "Applies risk policy: P(default) < 0.10 -> APPROVE_TIER_A; 0.10–0.25 -> MANUAL_UNDERWRITING_REVIEW; > 0.25 -> DECLINE. Injects adverse action explanatory codes.",
    monitoringFocus: "Approval / Decline ratio distribution shifts.",
  },
  {
    id: "json_response",
    stepNumber: "10",
    name: "JSON Response & Audit Logging",
    role: "Returns structured prediction payload and logs transaction.",
    tools: "Kafka, Fluentd, OpenTelemetry, S3 Audit Bucket",
    details:
      "Returns JSON response in < 25ms: { decision: 'APPROVE', default_prob: 0.082, risk_grade: 'A', model_version: 'v2.4.1', latency_ms: 18.4 }. Asynchronously streams audit log to Kafka.",
    monitoringFocus: "End-to-end response time, telemetry packet loss, and compliance audit trail.",
  },
];

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT: ProductionApplicationsModule                               */
/* -------------------------------------------------------------------------- */
export function ProductionApplicationsModule() {
  const [activeTab, setActiveTab] = useState<"batch" | "realtime" | "comparison">("batch");
  const [selectedBatchStepId, setSelectedBatchStepId] = useState<string>("data_sources");
  const [selectedRtStepId, setSelectedRtStepId] = useState<string>("fastapi_service");

  const activeBatchStep = batchPipelineSteps.find((s) => s.id === selectedBatchStepId) || batchPipelineSteps[0];
  const activeRtStep = realtimePipelineSteps.find((s) => s.id === selectedRtStepId) || realtimePipelineSteps[0];

  return (
    <div className="space-y-12 pt-8">
      {/* Top Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        {[
          { id: "batch", label: "Architecture 1: Batch Scoring Pipeline", icon: Database },
          { id: "realtime", label: "Architecture 2: Real-Time Microservice Scoring", icon: Server },
          { id: "comparison", label: "Batch vs Real-Time Scoring Matrix", icon: Workflow },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-primary"
                  : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* TAB 1: ARCHITECTURE 1 - BATCH SCORING PIPELINE                       */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === "batch" && (
        <div className="space-y-8">
          <SectionHeading
            index="ARCHITECTURE 01"
            title="Production Batch Scoring Pipeline Architecture"
            desc="End-to-end scheduled batch inference workflow: ingestion, validation, feature store synchronization, parallel tree scoring, and audit monitoring."
          />

          {/* Practical Scenario Banner */}
          <div className="surface rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider font-mono">
              <Sparkles className="size-4" /> Production Scenario: Customer Churn Prediction Engine
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every night at 02:00 AM, this automated batch pipeline processes all 2.5 million active telecommunication subscribers, calculates 30-day behavioural aggregates, executes Random Forest inference, flags high-risk churn customers (<MathView math="P(\text{churn}) \ge 0.65" />), and delivers targeted retention campaigns to the CRM database before 06:00 AM.
            </p>
          </div>

          {/* Interactive Pipeline Workflow Step Navigator */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Interactive Workflow Pipeline (Click Any Node to Inspect)
            </h4>

            {/* Horizontal Flow Container */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-2">
              {batchPipelineSteps.map((step, idx) => {
                const isSelected = step.id === selectedBatchStepId;
                return (
                  <div key={step.id} className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedBatchStepId(step.id)}
                      className={`flex flex-col items-start rounded-xl p-3 text-left transition-all min-w-[150px] border ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary"
                          : "border-border bg-card/60 hover:bg-secondary/40"
                      }`}
                    >
                      <span className="font-mono text-[10px] text-primary font-bold">
                        STEP {step.stepNumber}
                      </span>
                      <span className="font-semibold text-xs text-foreground mt-0.5 truncate w-full">
                        {step.name}
                      </span>
                    </button>
                    {idx < batchPipelineSteps.length - 1 && (
                      <ArrowRight className="size-3.5 text-muted-foreground/60 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Step Detailed Card */}
            <div className="surface rounded-xl border border-border p-6 space-y-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">
                      STEP {activeBatchStep.stepNumber}
                    </span>
                    <h3 className="text-lg font-bold text-foreground">{activeBatchStep.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{activeBatchStep.role}</p>
                </div>

                <div className="rounded-lg bg-secondary/60 px-3 py-1.5 text-xs font-mono text-accent">
                  Standard Tech: {activeBatchStep.tools}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                    Operational Execution Details
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed bg-background/60 border border-border/80 rounded-lg p-3.5">
                    {activeBatchStep.details}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-warning">
                    Production Monitoring & Failure Handling
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed bg-warning/5 border border-warning/20 rounded-lg p-3.5">
                    {activeBatchStep.monitoringFocus}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 2: ARCHITECTURE 2 - REAL-TIME MICROSERVICE SCORING               */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === "realtime" && (
        <div className="space-y-8">
          <SectionHeading
            index="ARCHITECTURE 02"
            title="Real-Time Microservice Scoring Architecture"
            desc="Low-latency synchronous API scoring with FastAPI, Pydantic validation, in-memory model caching, probability calibration, and telemetry."
          />

          {/* Practical Scenario Banner */}
          <div className="surface rounded-xl border border-accent/30 bg-accent/5 p-5 space-y-2">
            <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-wider font-mono">
              <ShieldCheck className="size-4" /> Production Scenario: Instant Loan-Risk Assessment Service
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When an applicant clicks 'Submit Application', an online banking client submits a JSON payload to the FastAPI risk microservice. The service validates inputs, enriches features from Redis, evaluates 200 Random Forest trees in &lt; 1 ms, applies Platt probability calibration, checks underwriting policies, and returns a verified loan decision within a strict 35 ms SLA.
            </p>
          </div>

          {/* Interactive Microservice Workflow Step Navigator */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Microservice Request Lifecycle (Click Any Stage to Inspect)
            </h4>

            {/* Horizontal Flow Container */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-2">
              {realtimePipelineSteps.map((step, idx) => {
                const isSelected = step.id === selectedRtStepId;
                return (
                  <div key={step.id} className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedRtStepId(step.id)}
                      className={`flex flex-col items-start rounded-xl p-3 text-left transition-all min-w-[150px] border ${
                        isSelected
                          ? "border-accent bg-accent/10 shadow-sm ring-1 ring-accent"
                          : "border-border bg-card/60 hover:bg-secondary/40"
                      }`}
                    >
                      <span className="font-mono text-[10px] text-accent font-bold">
                        STAGE {step.stepNumber}
                      </span>
                      <span className="font-semibold text-xs text-foreground mt-0.5 truncate w-full">
                        {step.name}
                      </span>
                    </button>
                    {idx < realtimePipelineSteps.length - 1 && (
                      <ArrowRight className="size-3.5 text-muted-foreground/60 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Stage Detailed Card */}
            <div className="surface rounded-xl border border-border p-6 space-y-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-accent">
                      STAGE {activeRtStep.stepNumber}
                    </span>
                    <h3 className="text-lg font-bold text-foreground">{activeRtStep.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{activeRtStep.role}</p>
                </div>

                <div className="rounded-lg bg-secondary/60 px-3 py-1.5 text-xs font-mono text-primary">
                  Standard Tech: {activeRtStep.tools}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                    Runtime Processing Responsibilities
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed bg-background/60 border border-border/80 rounded-lg p-3.5">
                    {activeRtStep.details}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-destructive">
                    Latency & Reliability Considerations
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed bg-destructive/5 border border-destructive/20 rounded-lg p-3.5">
                    {activeRtStep.monitoringFocus}
                  </p>
                </div>
              </div>

              {/* In-Memory Model Warning Callout */}
              {activeRtStep.id === "in_memory_model" && (
                <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 text-xs text-muted-foreground space-y-1">
                  <div className="font-bold text-warning flex items-center gap-1.5">
                    <AlertTriangle className="size-4" /> Crucial Architectural Rule: Pre-Load Model Artifacts
                  </div>
                  <p>
                    Never call <code>joblib.load('model.pkl')</code> inside the request handler endpoint! Reading a 200MB model from disk on every HTTP request takes 150ms–400ms and thrashes memory. Always load the model into global application state during the FastAPI startup lifespan event so predictions execute purely in-memory.
                  </p>
                </div>
              )}
            </div>

            {/* Supporting Microservice Infrastructure Grid */}
            <div className="pt-6 space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Supporting Enterprise Cloud Infrastructure
              </h4>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="surface rounded-xl border border-border p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-primary font-semibold text-xs font-mono">
                    <Boxes className="size-4" /> Containerization & K8s
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Docker containers deployed in Kubernetes with Horizontal Pod Autoscaler (HPA) scaling pods dynamically based on CPU and request concurrency.
                  </p>
                </div>

                <div className="surface rounded-xl border border-border p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-accent font-semibold text-xs font-mono">
                    <GitBranch className="size-4" /> Zero-Downtime CI/CD
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Blue/Green or Canary rollouts ensure zero user downtime during model updates, with automatic rollback if 5xx errors or latency exceeds SLA.
                  </p>
                </div>

                <div className="surface rounded-xl border border-border p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-success font-semibold text-xs font-mono">
                    <Activity className="size-4" /> Telemetry & Tracing
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Prometheus records p95/p99 latency histograms, Grafana visualizes real-time request rates, and OpenTelemetry traces cross-service latency.
                  </p>
                </div>

                <div className="surface rounded-xl border border-border p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-warning font-semibold text-xs font-mono">
                    <Radio className="size-4" /> Drift Detection in Real Time
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Background workers sample 5% of inference payloads to monitor input feature drift against training reference distributions using Evidently AI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 3: BATCH VS REAL-TIME SCORING MATRIX                             */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === "comparison" && (
        <div className="space-y-8">
          <SectionHeading
            index="SECTION 03"
            title="Batch Scoring vs. Real-Time Microservice Scoring"
            desc="Comparative technical matrix evaluating execution triggers, latency SLAs, infrastructure requirements, failure recovery, and cost dynamics."
          />

          <div className="overflow-x-auto rounded-xl border border-border bg-card/60 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-sidebar/80">
                  <th className="px-4 py-3.5 font-mono text-xs font-bold text-foreground min-w-[180px]">
                    Technical Dimension
                  </th>
                  <th className="px-4 py-3.5 font-mono text-xs font-bold text-primary min-w-[280px]">
                    Batch Scoring Pipeline
                  </th>
                  <th className="px-4 py-3.5 font-mono text-xs font-bold text-accent min-w-[280px]">
                    Real-Time Microservice Scoring
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {[
                  {
                    dim: "Prediction Trigger",
                    batch: "Scheduled timer (Cron, Airflow DAG, weekly/daily ETL triggers) or bulk file arrival.",
                    realtime: "Synchronous incoming client request (HTTP REST, gRPC call, web form submission).",
                  },
                  {
                    dim: "Latency SLA",
                    batch: "Relaxed: Minutes to hours. Focus is on total batch completion throughput rather than response time.",
                    realtime: "Strict: 5ms to 50ms p99 SLA. Millisecond delays directly hurt user experience or violate partner SLAs.",
                  },
                  {
                    dim: "Processing Scale",
                    batch: "High throughput: Hundreds of thousands to millions of records vectorized in parallel chunks.",
                    realtime: "Single-item or small micro-batch payloads (1 to 50 items per payload).",
                  },
                  {
                    dim: "Infrastructure",
                    batch: "Workflow orchestrators (Airflow, Prefect), distributed engines (Spark, Ray), ephemeral compute nodes.",
                    realtime: "API gateways (Kong, Envoy), ASGI servers (FastAPI/Uvicorn), container clusters (Docker, K8s).",
                  },
                  {
                    dim: "Scaling Mechanics",
                    batch: "Horizontal partitioning: split dataset across worker processes or Spark partitions.",
                    realtime: "Kubernetes Horizontal Pod Autoscaler (HPA) adding replica pods based on CPU and request concurrency.",
                  },
                  {
                    dim: "Failure Recovery",
                    batch: "Idempotent job retries: failed tasks can re-run from the last checkpoint without user disruption.",
                    realtime: "Circuit breakers, graceful fallbacks (e.g. heuristic default rule), and client retries.",
                  },
                  {
                    dim: "Cost Model",
                    batch: "Ephemeral: Compute clusters are provisioned only during the run and torn down immediately.",
                    realtime: "Always-on: Minimum baseline replica pods must stay running 24/7 to receive incoming traffic.",
                  },
                  {
                    dim: "Typical Applications",
                    batch: "Nightly customer churn scoring, marketing campaign targets, weekly credit risk portfolio audits.",
                    realtime: "Instant credit card fraud screening, dynamic price quotation, interactive loan underwriting.",
                  },
                  {
                    dim: "Random Forest Suitability",
                    batch: "Flawless: n_jobs=-1 harnesses all CPU cores; massive unconstrained forests evaluate easily.",
                    realtime: "Requires tree pruning (max_depth=10, min_samples_leaf=4) or C-compilation (Treelite) to ensure < 5ms latency.",
                  },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-foreground font-mono text-xs">
                      {row.dim}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground leading-relaxed">
                      {row.batch}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground leading-relaxed">
                      {row.realtime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
