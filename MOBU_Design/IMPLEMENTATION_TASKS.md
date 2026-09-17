# MOBU Investment Platform
## Implementation Tasks (Sprint-Ready User Stories)

**Purpose**: JIRA/Linear-ready tasks derived from design documents  
**Audience**: Engineering team, Product Manager, Scrum Master  
**Last Updated**: September 2026

---

## Table of Contents

1. [Epic Structure](#1-epic-structure)
2. [Sprint 1 Tasks (Weeks 1-2)](#2-sprint-1-tasks-weeks-1-2)
3. [Sprint 2 Tasks (Weeks 3-4)](#3-sprint-2-tasks-weeks-3-4)
4. [Sprint 3 Tasks (Weeks 5-6)](#4-sprint-3-tasks-weeks-5-6)
5. [Sprint 4 Tasks (Weeks 7-8)](#5-sprint-4-tasks-weeks-7-8)
6. [Sprint 5 Tasks (Weeks 9-10)](#6-sprint-5-tasks-weeks-9-10)
7. [Sprint 6 Tasks (Weeks 11-12)](#7-sprint-6-tasks-weeks-11-12)
8. [Task Template](#8-task-template)
9. [Definition of Done](#9-definition-of-done)

---

## 1. Epic Structure

### Epic Hierarchy

```
MOBU Platform (Product)
│
├── Epic 0: dbt Data Lineage & Quality ✅ (8 tasks, 21 story points) [IN PROGRESS]
│   ├── dbt installation ✅ DONE
│   ├── Project structure ✅ DONE
│   ├── Staging models ✅ DONE
│   ├── Quality metrics ✅ DONE
│   ├── Database setup ⏳ NEXT
│   ├── Data Feed Agent ⏳
│   ├── MVP integration ⏳
│   └── Documentation ✅ DONE
│
├── Epic 1: Infrastructure & DevOps (10 tasks, 40 story points)
│   ├── Azure subscription setup
│   ├── Kubernetes cluster (AKS)
│   ├── CI/CD pipeline
│   └── Monitoring
│
├── Epic 2: Security Master Data Plane (25 tasks, 80 story points)
│   ├── PostgreSQL schema
│   ├── Data ingestion pipelines
│   ├── API endpoints
│   └── Admin UI
│
├── Epic 3: Knowledge Graph (30 tasks, 100 story points)
│   ├── Neo4j setup
│   ├── Graph schema
│   ├── Import scripts
│   └── Query APIs
│
├── Epic 4: Authentication & User Management (15 tasks, 50 story points)
│   ├── User registration
│   ├── JWT authentication
│   ├── KYC flow
│   └── User profiles
│
├── Epic 5: Recommendation Engine (35 tasks, 120 story points)
│   ├── ML model training
│   ├── Graph traversal algorithms
│   ├── Scoring logic
│   └── Evidence trail generation
│
├── Epic 6: Portfolio Management (20 tasks, 70 story points)
│   ├── Portfolio CRUD
│   ├── Holdings tracking
│   ├── Order management
│   └── Performance calculation
│
└── Epic 7: Web Application (40 tasks, 130 story points)
    ├── Dashboard
    ├── Recommendation pages
    ├── Evidence trail visualization
    └── Portfolio views
```

**Total Effort**: 183 tasks, 611 story points (~6 months for 5-person team)

---

## 1.5. Epic 0: dbt Data Lineage & Quality (Current Sprint)

### Epic Summary
**Status**: 🟡 IN PROGRESS (5 of 8 tasks complete)  
**Story Points**: 21  
**Priority**: High  
**Goal**: Establish data lineage tracking and quality validation for 4 AI Quality Criteria

**Completed Tasks**: ✅
- DBT-1: Install dbt-core and dbt-postgres ✅
- DBT-2: Initialize dbt project structure ✅
- DBT-3: Create staging models for data feeds ✅
- DBT-4: Create intermediate quality models ✅
- DBT-5: Create marts layer for dashboard ✅

**Remaining Tasks**: ⏳
- DBT-6: Set up PostgreSQL database with schemas ⏳
- DBT-7: Connect Data Feed Agent to raw_data schema ⏳
- DBT-8: Integrate MVP dashboard with marts ⏳

---

## 1.6. dbt Integration Tasks (Detailed)

### DBT-1: Install dbt-core and dbt-postgres ✅ COMPLETED
**Epic**: dbt Data Lineage & Quality  
**Story Points**: 2  
**Priority**: Critical  
**Status**: ✅ DONE

**Description**:
As a data engineer, I need dbt installed locally so that I can build data transformation pipelines.

**Acceptance Criteria**:
- [✅] dbt-core 1.8.0 installed
- [✅] dbt-postgres 1.8.0 installed
- [✅] dbt binary accessible via PATH
- [✅] Installation verified with `dbt --version`

**Completed**: September 12, 2026

---

### DBT-2: Initialize dbt project structure ✅ COMPLETED
**Epic**: dbt Data Lineage & Quality  
**Story Points**: 2  
**Priority**: Critical  
**Status**: ✅ DONE

**Description**:
As a data engineer, I need a dbt project initialized with proper folder structure so that I can organize models by layer.

**Acceptance Criteria**:
- [✅] dbt project created at `mobu_dbt/`
- [✅] `dbt_project.yml` configured with layers (staging, intermediate, marts)
- [✅] `profiles.yml` created with PostgreSQL connection config
- [✅] Quality thresholds set in vars (accuracy: 0.9995, reliability: 0.999, sharpe: 1.5)
- [✅] Folder structure: models/staging, models/intermediate, models/marts

**Completed**: September 12, 2026

---

### DBT-3: Create staging models for data feeds ✅ COMPLETED
**Epic**: dbt Data Lineage & Quality  
**Story Points**: 5  
**Priority**: High  
**Status**: ✅ DONE

**Description**:
As a data engineer, I need staging models that validate and standardize raw data feeds so that downstream models have clean inputs.

**Acceptance Criteria**:
- [✅] `stg_price_feeds.sql` - Validates price data (≥95% quality)
- [✅] `stg_onchain_feeds.sql` - Validates blockchain data (≥90% quality)
- [✅] `stg_news_feeds.sql` - Validates sentiment data (≥70% confidence)
- [✅] `stg_macro_feeds.sql` - Validates economic indicators (≥98% quality)
- [✅] `schema.yml` with tests (not_null, unique, accepted_values, accepted_range)
- [✅] All models materialize as views
- [✅] Deduplication logic per feed type

**Completed**: September 12, 2026  
**Models**: 4 staging feed models + 5 staging system models

---

### DBT-4: Create intermediate quality models ✅ COMPLETED
**Epic**: dbt Data Lineage & Quality  
**Story Points**: 5  
**Priority**: High  
**Status**: ✅ DONE

**Description**:
As a data engineer, I need intermediate models that calculate the 4 AI Quality Criteria so that compliance can be tracked.

**Acceptance Criteria**:
- [✅] `int_accuracy_metrics.sql` - Criterion 1: Accuracy ≥99.95%
- [✅] `int_reliability_metrics.sql` - Criterion 2: Uptime ≥99.9%
- [✅] `int_sharpe_ratio.sql` - Criterion 3: Sharpe Ratio ≥1.5
- [✅] `int_learning_metrics.sql` - Criterion 4: Self-improving (feedback ≥80%)
- [✅] Rolling window calculations (7-day, 30-day, 90-day)
- [✅] Threshold compliance flags
- [✅] All models materialize as ephemeral (not persisted)

**Completed**: September 12, 2026  
**Models**: 4 intermediate quality models

---

### DBT-5: Create marts layer for dashboard ✅ COMPLETED
**Epic**: dbt Data Lineage & Quality  
**Story Points**: 3  
**Priority**: High  
**Status**: ✅ DONE

**Description**:
As a product manager, I need a marts model that aggregates all quality metrics into a single table so that the MVP dashboard can query it easily.

**Acceptance Criteria**:
- [✅] `mart_quality_dashboard.sql` created
- [✅] Aggregates all 4 criteria into single row
- [✅] Includes: criterion name, value, unit, threshold, compliant flag
- [✅] Overall compliance flag (all 4 criteria must pass)
- [✅] Lineage metadata (dbt_run_timestamp, invocation_id)
- [✅] Materialized as table (indexed for fast queries)

**Completed**: September 12, 2026  
**Output**: Single dashboard-ready table

---

### DBT-6: Set up PostgreSQL database with schemas ⏳ NEXT
**Epic**: dbt Data Lineage & Quality  
**Story Points**: 2  
**Priority**: High  
**Status**: ⏳ TO DO

**Description**:
As a data engineer, I need a PostgreSQL database with proper schemas so that dbt can write transformed data.

**Acceptance Criteria**:
- [ ] PostgreSQL 15+ installed locally (or Azure Database for PostgreSQL)
- [ ] Database created: `mobu_dev`
- [ ] Schemas created: `raw_data`, `staging`, `intermediate`, `marts`, `analytics`
- [ ] User created: `mobu_user` with appropriate permissions
- [ ] Password set in environment variable: `MOBU_DB_PASSWORD`
- [ ] Connection tested with `psql` or pgAdmin
- [ ] `dbt debug` passes successfully

**Technical Notes**:
```sql
CREATE DATABASE mobu_dev;
\c mobu_dev

CREATE SCHEMA raw_data;
CREATE SCHEMA staging;
CREATE SCHEMA intermediate;
CREATE SCHEMA marts;
CREATE SCHEMA analytics;

CREATE USER mobu_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE mobu_dev TO mobu_user;
GRANT ALL ON SCHEMA raw_data, staging, intermediate, marts, analytics TO mobu_user;
```

**Environment Setup**:
```bash
export MOBU_DB_PASSWORD="secure_password"
export PATH="/Users/fedeanalytics/Library/Python/3.13/bin:$PATH"
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu_dbt
dbt debug
```

**Definition of Done**:
- `dbt debug` shows "All checks passed!"
- Can connect to database via `psql -h localhost -U mobu_user -d mobu_dev`
- All schemas visible in database

**Estimated Time**: 2-3 hours

---

### DBT-7: Connect Data Feed Agent to raw_data schema ⏳
**Epic**: dbt Data Lineage & Quality  
**Story Points**: 3  
**Priority**: Medium  
**Status**: ⏳ TO DO  
**Dependencies**: DBT-6

**Description**:
As a data engineer, I need the Data Feed Agent to write validated data to raw_data tables so that dbt can transform it.

**Acceptance Criteria**:
- [ ] Raw tables created in `raw_data` schema
- [ ] Python Data Feed Agent created (`data_feed_agent.py`)
- [ ] Agent connects to PostgreSQL using psycopg2
- [ ] Sample data inserted into each raw table (at least 100 rows)
- [ ] Data quality scores included in each row
- [ ] Timestamps: `ingested_at`, `created_at`

**Definition of Done**:
- Data Feed Agent runs without errors
- Raw tables populated with sample data
- `SELECT COUNT(*) FROM raw_data.price_data_raw` returns > 0
- Data quality scores present in all rows

**Estimated Time**: 4-5 hours

---

### DBT-8: Integrate MVP dashboard with marts ⏳
**Epic**: dbt Data Lineage & Quality  
**Story Points**: 3  
**Priority**: Medium  
**Status**: ⏳ TO DO  
**Dependencies**: DBT-6, DBT-7

**Description**:
As a product manager, I need the MVP dashboard to query dbt marts instead of JSON files so that we display real-time quality metrics.

**Acceptance Criteria**:
- [ ] `dbt run` completes successfully (all models built)
- [ ] `dbt test` passes all tests
- [ ] `pg` (node-postgres) package added to MVP project
- [ ] New API route created: `pages/api/quality-metrics-live.ts`
- [ ] Route queries `analytics.mart_quality_dashboard`
- [ ] Dashboard component updated to fetch from new API
- [ ] Quality badges display live data from database

**Definition of Done**:
- Dashboard displays 4 quality metric badges with live data
- Metrics update when `dbt run` is executed
- Console shows no database connection errors

**Estimated Time**: 3-4 hours

---

## 2. Sprint 1 Tasks (Weeks 1-2)

### Sprint Goal
**"Establish development environment and deploy first API endpoint"**

---

### INFRA-1: Set up Azure subscription and VNet
**Epic**: Infrastructure & DevOps  
**Story Points**: 3  
**Priority**: Critical  
**Assignee**: Head of Engineering

**Description**:
As a DevOps engineer, I need to set up the Azure infrastructure foundation so that we can deploy services securely.

**Acceptance Criteria**:
- [ ] Azure subscription created (or use existing)
- [ ] Resource Group created: `mobu-prod`
- [ ] VNet configured (10.0.0.0/16) in South Africa North region
- [ ] Public subnet (10.0.1.0/24) and Private subnets (10.0.2.0/24, 10.0.3.0/24)
- [ ] NAT Gateway configured
- [ ] Network Security Groups (NSGs) configured
- [ ] Route tables configured

**Technical Notes**:
- Use Terraform or Bicep for infrastructure as code
- Reference: `02_System_Architecture.md` Section 2.2
- Use `South Africa North` (Johannesburg) as primary region

**Definition of Done**:
- All infrastructure defined in Terraform/Bicep
- Successfully ping external internet from private subnet
- Documentation in `docs/infrastructure/azure-setup.md`

---

### INFRA-2: Set up Kubernetes cluster (AKS)
**Epic**: Infrastructure & DevOps  
**Story Points**: 5  
**Priority**: Critical  
**Assignee**: Head of Engineering

**Description**:
As a DevOps engineer, I need a Kubernetes cluster so that we can deploy containerized services.

**Acceptance Criteria**:
- [ ] AKS cluster created (version 1.28+)
- [ ] 2 node pools (Standard_D4s_v3 for dev, Standard_D8s_v3 for prod)
- [ ] Azure CNI networking configured
- [ ] kubectl configured locally
- [ ] Helm installed
- [ ] Ingress controller (nginx) deployed
- [ ] Azure Container Insights enabled
- [ ] Can deploy test pod and access via Application Gateway

**Technical Notes**:
- Use `az aks create` or Terraform azurerm_kubernetes_cluster
- Enable Managed Identity for cluster authentication
- Enable Azure Monitor for containers
- Reference: `Technical_Diagrams.md` Section 5.2

**Definition of Done**:
- Deploy hello-world app and access via public URL
- Cluster auto-scaling configured
- Documentation in `docs/infrastructure/kubernetes-setup.md`

---

### INFRA-3: Set up CI/CD pipeline (GitHub Actions)
**Epic**: Infrastructure & DevOps  
**Story Points**: 5  
**Priority**: High  
**Assignee**: Senior Backend Engineer #1

**Description**:
As a developer, I need automated testing and deployment so that code changes ship reliably.

**Acceptance Criteria**:
- [ ] GitHub Actions workflows created:
  - [ ] `.github/workflows/test.yml` (runs on PR)
  - [ ] `.github/workflows/deploy-dev.yml` (merges to `develop`)
  - [ ] `.github/workflows/deploy-prod.yml` (merges to `main`)
- [ ] Docker images built and pushed to ACR (Azure Container Registry)
- [ ] Automated deployment to AKS (using kubectl apply)
- [ ] Slack notifications on deployment

**Technical Notes**:
- Use GitHub Actions with Azure Login action
- Build multi-stage Docker images (dev/prod)
- Reference: `05_Implementation_Strategy.md` Section 5.1

**Definition of Done**:
- Create PR → Tests run automatically
- Merge to develop → Auto-deploy to dev environment
- Documentation in `docs/cicd.md`

---

### DATA-1: Design PostgreSQL schema (Security Master)
**Epic**: Security Master Data Plane  
**Story Points**: 3  
**Priority**: Critical  
**Assignee**: Senior Backend Engineer #1

**Description**:
As a backend engineer, I need the database schema defined so that I can implement data models.

**Acceptance Criteria**:
- [ ] SQL migration files created (`migrations/001_initial_schema.sql`)
- [ ] Tables created:
  - [ ] `securities` (ticker, name, asset_type, exchange, etc.)
  - [ ] `price_history` (security_id, date, open, high, low, close, volume)
  - [ ] `fundamentals` (security_id, metric_name, value, date)
- [ ] Indexes created (see Technical_Diagrams.md Section 4.2)
- [ ] Foreign key constraints defined
- [ ] Sample data inserted (10 securities from JSE)

**Technical Notes**:
- Use Alembic for migrations (Python)
- Reference: `03_Data_Model.md` Section 2.1, `Technical_Diagrams.md` Section 4.1
- TimescaleDB extension for price_history (Phase 1B)

**Definition of Done**:
- Run migration successfully on local PostgreSQL
- All tables visible in `psql \dt`
- Sample query returns data: `SELECT * FROM securities LIMIT 10;`

---

### DATA-2: Set up PostgreSQL database (Azure Database for PostgreSQL)
**Epic**: Security Master Data Plane  
**Story Points**: 3  
**Priority**: Critical  
**Assignee**: Head of Engineering

**Description**:
As a backend engineer, I need a production-grade database so that I can store application data.

**Acceptance Criteria**:
- [ ] Azure Database for PostgreSQL Flexible Server created (B_Standard_B2s, 100GB storage)
- [ ] Network Security Group configured (only AKS can connect)
- [ ] Admin user created
- [ ] Database created (`mobu_prod`)
- [ ] Application user created with restricted permissions
- [ ] Connection tested from local machine (via bastion host or VPN)
- [ ] Automated backups enabled (7-day retention)
- [ ] High Availability configured (zone-redundant)

**Technical Notes**:
- Use Terraform to provision
- Enable encryption at rest (default in Azure)
- Connection string format: `Server=mobu-postgres.postgres.database.azure.com;Database=mobu_prod;Port=5432;`
- Reference: `02_System_Architecture.md` Section 2.3

**Definition of Done**:
- Successfully connect from local: `psql -h <server>.postgres.database.azure.com -U app_user mobu_prod`
- Run migrations successfully
- Documentation in `docs/databases/postgresql.md`

---

### API-1: Create FastAPI project structure
**Epic**: Security Master Data Plane  
**Story Points**: 2  
**Priority**: Critical  
**Assignee**: Senior Backend Engineer #1

**Description**:
As a backend engineer, I need a standardized project structure so that the codebase is maintainable.

**Acceptance Criteria**:
- [ ] Project structure created:
  ```
  backend/
  ├── app/
  │   ├── main.py (FastAPI app)
  │   ├── config.py (settings)
  │   ├── models/ (SQLAlchemy models)
  │   ├── routers/ (API routes)
  │   ├── services/ (business logic)
  │   └── utils/
  ├── tests/
  ├── migrations/
  ├── Dockerfile
  ├── requirements.txt
  └── pyproject.toml
  ```
- [ ] FastAPI app runs locally (`uvicorn app.main:app --reload`)
- [ ] Health check endpoint: `GET /health` returns `{"status": "ok"}`
- [ ] OpenAPI docs accessible at `/docs`

**Technical Notes**:
- Use Poetry for dependency management
- Reference: `06_API_Specification.md` Section 1

**Definition of Done**:
- `curl http://localhost:8000/health` returns 200
- OpenAPI docs visible at http://localhost:8000/docs
- Documentation in `backend/README.md`

---

### API-2: Implement GET /securities endpoint
**Epic**: Security Master Data Plane  
**Story Points**: 3  
**Priority**: High  
**Assignee**: Senior Backend Engineer #1

**Description**:
As a frontend developer, I need an API to fetch securities so that I can display them in the UI.

**Acceptance Criteria**:
- [ ] Endpoint: `GET /api/v1/securities`
- [ ] Query parameters:
  - [ ] `exchange` (optional, filter by exchange code)
  - [ ] `asset_type` (optional, filter by asset type)
  - [ ] `limit` (default 50, max 100)
  - [ ] `offset` (for pagination)
- [ ] Response: JSON array of securities
- [ ] Unit tests: 80%+ coverage
- [ ] Integration test: Query returns sample data

**Request Example**:
```bash
GET /api/v1/securities?exchange=JSE&limit=10
```

**Response Example**:
```json
{
  "data": [
    {
      "id": "uuid",
      "ticker": "SHP.JO",
      "name": "Shoprite Holdings Ltd",
      "asset_type": "stock",
      "exchange": "JSE",
      "currency": "ZAR"
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 150
  }
}
```

**Technical Notes**:
- Reference: `06_API_Specification.md` Section 4.1

**Definition of Done**:
- Endpoint returns data
- Tests pass (`pytest tests/test_securities.py`)
- Documentation in OpenAPI docs

---

### TEST-1: Set up testing framework
**Epic**: Infrastructure & DevOps  
**Story Points**: 2  
**Priority**: High  
**Assignee**: Senior Backend Engineer #1

**Description**:
As a developer, I need automated tests so that I can catch bugs early.

**Acceptance Criteria**:
- [ ] pytest configured
- [ ] Test fixtures for database (use pytest-postgresql)
- [ ] Test fixtures for FastAPI client (TestClient)
- [ ] Coverage reporting (pytest-cov)
- [ ] Pre-commit hooks (black, isort, flake8)
- [ ] Sample test passes

**Technical Notes**:
- Use pytest-postgresql for ephemeral test databases
- Use factory_boy for test data generation

**Definition of Done**:
- Run `pytest` and see passing tests
- Run `pytest --cov` and see coverage report
- Pre-commit hook runs on `git commit`

---

### DOCS-1: Write developer onboarding guide
**Epic**: Infrastructure & DevOps  
**Story Points**: 2  
**Priority**: Medium  
**Assignee**: Senior Backend Engineer #1

**Description**:
As a new engineer, I need setup instructions so that I can start contributing quickly.

**Acceptance Criteria**:
- [ ] Document created: `docs/ONBOARDING.md`
- [ ] Sections:
  - [ ] Prerequisites (Python 3.11, Docker, kubectl)
  - [ ] Local development setup
  - [ ] Running the backend locally
  - [ ] Running tests
  - [ ] Deploying to dev environment
  - [ ] Troubleshooting common issues
- [ ] Tested by another team member

**Definition of Done**:
- New engineer can follow guide and get backend running in <1 hour
- Zero questions needed during setup

---

### DESIGN-1: Create design system (Figma)
**Epic**: Web Application  
**Story Points**: 5  
**Priority**: Medium  
**Assignee**: Product Designer

**Description**:
As a designer, I need a design system so that UI components are consistent.

**Acceptance Criteria**:
- [ ] Figma file created: "MOBU Design System"
- [ ] Color palette defined (primary, secondary, success, error, neutral)
- [ ] Typography scale (headings, body, captions)
- [ ] Component library:
  - [ ] Buttons (primary, secondary, outline, text)
  - [ ] Input fields
  - [ ] Cards
  - [ ] Navigation (header, sidebar)
  - [ ] Tables
- [ ] Shared with team (view access)

**Technical Notes**:
- Reference: `07_UI_UX_Design.md` Section 2

**Definition of Done**:
- Design system published in Figma
- Components reusable across pages
- Engineers can inspect and export assets

---

**Sprint 1 Summary**:
- **Total Tasks**: 10
- **Total Story Points**: 33
- **Critical Path**: INFRA-1 → INFRA-2 → DATA-2 → API-2
- **Blockers**: None (all tasks can start Week 1)
- **Sprint Demo**: Show working `/health` and `/securities` endpoints deployed to EKS

---

## 3. Sprint 2 Tasks (Weeks 3-4)

### Sprint Goal
**"Implement core data ingestion and first graph database queries"**

---

### DATA-3: Build data ingestion pipeline (JSE market data)
**Epic**: Security Master Data Plane  
**Story Points**: 8  
**Priority**: Critical  
**Assignee**: Data Engineer

**Description**:
As a data engineer, I need to ingest JSE market data so that we have up-to-date prices.

**Acceptance Criteria**:
- [ ] Python script: `scripts/ingest_jse_data.py`
- [ ] Fetch data from JSE API (or fallback to CSV scraping)
- [ ] Parse and validate data
- [ ] Insert into `price_history` table (upsert on conflict)
- [ ] Schedule as Kubernetes CronJob (runs daily at 6pm CAT)
- [ ] Logging (success/failure) to CloudWatch
- [ ] Error handling (retry 3 times, then alert Slack)

**Data Sources**:
- JSE API: https://www.jse.co.za/market-data (if available)
- Fallback: Download CSV from JSE website

**Technical Notes**:
- Reference: `05_Implementation_Strategy.md` Section 4.2

**Definition of Done**:
- Run script manually and see data in `price_history` table
- CronJob runs successfully in Kubernetes
- Alert triggers if ingestion fails

---

### GRAPH-1: Set up Neo4j database (EC2 or Aura)
**Epic**: Knowledge Graph  
**Story Points**: 5  
**Priority**: Critical  
**Assignee**: Senior Backend Engineer #2

**Description**:
As a backend engineer, I need Neo4j database so that I can store the knowledge graph.

**Acceptance Criteria**:
- [ ] Neo4j instance created (either Azure VM self-hosted or Neo4j Aura)
- [ ] Version: Neo4j 5.x (latest stable)
- [ ] Network Security Group configured (only AKS can connect)
- [ ] Bolt protocol enabled (port 7687)
- [ ] Admin user created, password stored in Azure Key Vault
- [ ] Connection tested from local machine
- [ ] Backup strategy defined (daily snapshots to Azure Blob Storage)

**Technical Notes**:
- Recommendation: Use Neo4j Aura for simplicity (managed service)
- Alternative: Self-host on Azure VM (Standard_D4s_v3)
- Reference: `02_System_Architecture.md` Section 2.3

**Definition of Done**:
- Successfully connect: `cypher-shell -a bolt://<neo4j-endpoint> -u neo4j -p <password>`
- Create test node: `CREATE (n:Test {name: 'Hello'}) RETURN n;`
- Documentation in `docs/databases/neo4j.md`

---

### GRAPH-2: Define Neo4j graph schema
**Epic**: Knowledge Graph  
**Story Points**: 5  
**Priority**: Critical  
**Assignee**: Senior Backend Engineer #2

**Description**:
As a backend engineer, I need the graph schema defined so that I can import data.

**Acceptance Criteria**:
- [ ] Cypher script: `migrations/neo4j/001_schema.cypher`
- [ ] Node labels defined:
  - [ ] `Investor`
  - [ ] `Security`
  - [ ] `Sector`
  - [ ] `Exchange`
  - [ ] `Metric`
  - [ ] `RiskProfile`
- [ ] Relationship types defined:
  - [ ] `[:LISTED_ON]` (Security → Exchange)
  - [ ] `[:IN_SECTOR]` (Security → Sector)
  - [ ] `[:HAS_METRIC]` (Security → Metric)
  - [ ] `[:HAS]` (Investor → RiskProfile)
- [ ] Indexes created (on ticker, sector name, etc.)
- [ ] Constraints created (unique ticker)

**Technical Notes**:
- Reference: `03_Data_Model.md` Section 3.2, `Technical_Diagrams.md` Section 3.1

**Definition of Done**:
- Run script: `cat migrations/neo4j/001_schema.cypher | cypher-shell`
- Verify indexes: `SHOW INDEXES;`
- Verify constraints: `SHOW CONSTRAINTS;`

---

### GRAPH-3: Import securities into Neo4j
**Epic**: Knowledge Graph  
**Story Points**: 5  
**Priority**: High  
**Assignee**: Senior Backend Engineer #2

**Description**:
As a backend engineer, I need securities in the graph database so that I can query them.

**Acceptance Criteria**:
- [ ] Python script: `scripts/import_securities_to_neo4j.py`
- [ ] Read securities from PostgreSQL
- [ ] Create `Security` nodes in Neo4j
- [ ] Create `[:LISTED_ON]` relationships to `Exchange` nodes
- [ ] Create `[:IN_SECTOR]` relationships to `Sector` nodes
- [ ] Idempotent (can run multiple times without duplicates)
- [ ] Log progress (every 100 securities)

**Technical Notes**:
- Use neo4j-driver (Python)
- Batch inserts (100 nodes per transaction for performance)

**Definition of Done**:
- Run script successfully
- Query returns data: `MATCH (s:Security) RETURN count(s);` (should match PostgreSQL count)
- Verify relationships: `MATCH (s:Security)-[:LISTED_ON]->(e:Exchange) RETURN s, e LIMIT 10;`

---

### AUTH-1: Implement user registration endpoint
**Epic**: Authentication & User Management  
**Story Points**: 5  
**Priority**: High  
**Assignee**: Full-Stack Engineer #1

**Description**:
As a user, I need to register an account so that I can use the platform.

**Acceptance Criteria**:
- [ ] Endpoint: `POST /api/v1/auth/register`
- [ ] Request body: `{email, phone, password, first_name, last_name}`
- [ ] Validations:
  - [ ] Email format valid
  - [ ] Phone format valid (E.164)
  - [ ] Password strong (8+ chars, uppercase, lowercase, number, special)
  - [ ] Email/phone not already registered
- [ ] Hash password (bcrypt)
- [ ] Insert into `users` table
- [ ] Send OTP via email (use Azure Communication Services)
- [ ] Return success message
- [ ] Unit tests: 90%+ coverage

**Request Example**:
```json
POST /api/v1/auth/register
{
  "email": "thabo@example.com",
  "phone": "+27821234567",
  "password": "SecurePass123!",
  "first_name": "Thabo",
  "last_name": "Mokoena"
}
```

**Response Example**:
```json
{
  "message": "Registration successful. Please verify your email.",
  "user_id": "uuid"
}
```

**Technical Notes**:
- Reference: `06_API_Specification.md` Section 3.1

**Definition of Done**:
- Endpoint returns 201 on success
- Email sent with OTP
- Tests pass
- Documented in OpenAPI

---

### AUTH-2: Implement email OTP verification endpoint
**Epic**: Authentication & User Management  
**Story Points**: 3  
**Priority**: High  
**Assignee**: Full-Stack Engineer #1

**Description**:
As a user, I need to verify my email so that my account is activated.

**Acceptance Criteria**:
- [ ] Endpoint: `POST /api/v1/auth/verify-email`
- [ ] Request body: `{email, otp}`
- [ ] Validate OTP (check against stored OTP in database)
- [ ] OTP expires after 10 minutes
- [ ] Update user: `email_verified = true`
- [ ] Return JWT access token
- [ ] Unit tests: 90%+ coverage

**Request Example**:
```json
POST /api/v1/auth/verify-email
{
  "email": "thabo@example.com",
  "otp": "123456"
}
```

**Response Example**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 900
}
```

**Technical Notes**:
- Store OTP in Redis (TTL: 10 minutes)
- Reference: `06_API_Specification.md` Section 3.2

**Definition of Done**:
- Verify with correct OTP → Returns token
- Verify with expired OTP → Returns 400 error
- Tests pass

---

### AUTH-3: Implement JWT authentication middleware
**Epic**: Authentication & User Management  
**Story Points**: 5  
**Priority**: Critical  
**Assignee**: Full-Stack Engineer #1

**Description**:
As a backend engineer, I need JWT authentication so that protected endpoints are secure.

**Acceptance Criteria**:
- [ ] Middleware function: `get_current_user(token: str)`
- [ ] Validate JWT signature
- [ ] Check expiration
- [ ] Extract user_id from token
- [ ] Fetch user from database
- [ ] Attach user to request context
- [ ] Protected endpoint example: `GET /api/v1/me` (returns current user)
- [ ] Unit tests: 90%+ coverage

**Technical Notes**:
- Use PyJWT library
- Secret key stored in Azure Key Vault
- Reference: `06_API_Specification.md` Section 3.4, `Technical_Diagrams.md` Section 7.1

**Definition of Done**:
- Call protected endpoint without token → 401 error
- Call with valid token → Returns user data
- Call with expired token → 401 error
- Tests pass

---

### WEB-1: Create React project (Next.js)
**Epic**: Web Application  
**Story Points**: 3  
**Priority**: High  
**Assignee**: Full-Stack Engineer #1

**Description**:
As a frontend developer, I need a React project so that I can build the UI.

**Acceptance Criteria**:
- [ ] Project created: `npx create-next-app@latest frontend`
- [ ] TypeScript enabled
- [ ] Tailwind CSS configured
- [ ] Project structure:
  ```
  frontend/
  ├── app/ (Next.js 13+ app directory)
  │   ├── layout.tsx
  │   ├── page.tsx (homepage)
  ├── components/
  ├── lib/ (utilities)
  ├── public/
  └── package.json
  ```
- [ ] App runs locally: `npm run dev`
- [ ] Homepage renders ("Welcome to MOBU")

**Technical Notes**:
- Use Next.js 13+ (App Router)
- Reference: `07_UI_UX_Design.md` Section 1

**Definition of Done**:
- App accessible at http://localhost:3000
- No TypeScript errors
- Documentation in `frontend/README.md`

---

### WEB-2: Implement registration page
**Epic**: Web Application  
**Story Points**: 5  
**Priority**: High  
**Assignee**: Full-Stack Engineer #1

**Description**:
As a user, I need a registration page so that I can create an account.

**Acceptance Criteria**:
- [ ] Page: `/register`
- [ ] Form fields: Email, Phone, Password, First Name, Last Name
- [ ] Client-side validation (email format, password strength)
- [ ] Call API: `POST /api/v1/auth/register`
- [ ] Show success message on registration
- [ ] Redirect to OTP verification page
- [ ] Responsive design (mobile-friendly)

**Design**:
- Reference: `07_UI_UX_Design.md` Section 3.1 (Figma mockups)

**Technical Notes**:
- Use React Hook Form for form handling
- Use Zod for validation
- Show loading spinner during API call

**Definition of Done**:
- Fill form → Click Register → See success message
- Invalid email → Show error
- Responsive on mobile (test on iPhone SE size)

---

### MONITOR-1: Set up Azure Monitor logging
**Epic**: Infrastructure & DevOps  
**Story Points**: 3  
**Priority**: Medium  
**Assignee**: Head of Engineering

**Description**:
As a DevOps engineer, I need centralized logging so that I can debug issues.

**Acceptance Criteria**:
- [ ] Log Analytics Workspace created
- [ ] Azure Monitor Container Insights enabled for AKS
- [ ] Log categories configured:
  - [ ] `/mobu/backend`
  - [ ] `/mobu/frontend`
  - [ ] `/mobu/data-ingestion`
- [ ] Kubernetes pods send logs to Azure Monitor
- [ ] Logs structured as JSON (timestamp, level, message, context)
- [ ] Log retention: 30 days
- [ ] Test: Trigger error in backend → See log in Log Analytics

**Technical Notes**:
- AKS automatically forwards logs to Azure Monitor if Container Insights enabled
- Use KQL (Kusto Query Language) for querying logs
- Reference: `Technical_Diagrams.md` Section 8.1

**Definition of Done**:
- Logs visible in Azure Portal (Log Analytics)
- Can filter by log level using KQL: `ContainerLog | where LogLevel == "Error"`
- Documentation in `docs/monitoring/logging.md`

---

**Sprint 2 Summary**:
- **Total Tasks**: 10
- **Total Story Points**: 47
- **Critical Path**: GRAPH-1 → GRAPH-2 → GRAPH-3
- **Blockers**: GRAPH-3 depends on DATA-3 (securities in PostgreSQL)
- **Sprint Demo**: Show user registration flow end-to-end (frontend → backend → database → OTP email)

---

## 4. Sprint 3 Tasks (Weeks 5-6)

### Sprint Goal
**"Build risk profile questionnaire and first recommendation algorithm"**

---

### PROFILE-1: Implement risk profile questionnaire API
**Epic**: Authentication & User Management  
**Story Points**: 5  
**Priority**: Critical  
**Assignee**: Full-Stack Engineer #2

**Description**:
As a user, I need to complete a risk profile so that I get personalized recommendations.

**Acceptance Criteria**:
- [ ] Endpoint: `POST /api/v1/users/me/risk-profile`
- [ ] Request body: `{horizon, risk_score, income, investable_cash, goals}`
- [ ] Validations:
  - [ ] `horizon` in ["1_year", "3_years", "5_years", "10_years"]
  - [ ] `risk_score` between 1-10
  - [ ] `income`, `investable_cash` positive numbers
- [ ] Insert into `risk_profiles` table
- [ ] Create `RiskProfile` node in Neo4j
- [ ] Create `[:HAS]` relationship (Investor → RiskProfile)
- [ ] Return success message
- [ ] Unit tests: 90%+ coverage

**Request Example**:
```json
POST /api/v1/users/me/risk-profile
Authorization: Bearer <token>
{
  "horizon": "5_years",
  "risk_score": 6,
  "income": 50000,
  "investable_cash": 10000,
  "goals": ["retirement", "wealth_accumulation"]
}
```

**Technical Notes**:
- Reference: `04_Product_Requirements.md` Section 2.1

**Definition of Done**:
- Submit profile → Returns 201
- Query PostgreSQL: Profile exists
- Query Neo4j: `MATCH (i:Investor)-[:HAS]->(rp:RiskProfile) RETURN rp;`
- Tests pass

---

### PROFILE-2: Implement risk profile questionnaire UI
**Epic**: Web Application  
**Story Points**: 8  
**Priority**: Critical  
**Assignee**: Full-Stack Engineer #2

**Description**:
As a user, I need a questionnaire UI so that I can set my risk profile.

**Acceptance Criteria**:
- [ ] Page: `/onboarding/risk-profile`
- [ ] Multi-step form (4 steps):
  - [ ] Step 1: Time horizon
  - [ ] Step 2: Risk tolerance (slider 1-10)
  - [ ] Step 3: Financial situation (income, investable cash)
  - [ ] Step 4: Goals (checkboxes)
- [ ] Progress indicator (1 of 4, 2 of 4, etc.)
- [ ] Back/Next navigation
- [ ] Call API: `POST /api/v1/users/me/risk-profile`
- [ ] Redirect to dashboard on success
- [ ] Responsive design

**Design**:
- Reference: `07_UI_UX_Design.md` Section 3.2

**Definition of Done**:
- Complete questionnaire → Redirected to dashboard
- Refresh page → See saved answers (if partially completed)
- Mobile-friendly

---

### REC-1: Implement simple recommendation algorithm
**Epic**: Recommendation Engine  
**Story Points**: 8  
**Priority**: Critical  
**Assignee**: Senior Backend Engineer #2

**Description**:
As a user, I need personalized recommendations so that I can invest wisely.

**Acceptance Criteria**:
- [ ] Python script: `services/recommendation_engine/simple_recommender.py`
- [ ] Algorithm:
  1. Fetch user's risk profile
  2. Query Neo4j for compatible securities:
     ```cypher
     MATCH (s:Security)-[:HAS_METRIC]->(m:Metric {name: 'beta'})
     WHERE m.value <= {user_risk_score}/10
     RETURN s
     LIMIT 10
     ```
  3. Score securities (simple formula: `score = sector_diversification + valuation`)
  4. Rank by score
  5. Return top 5
- [ ] Store recommendations in PostgreSQL `recommendations` table
- [ ] Unit tests: 80%+ coverage

**Output Example**:
```json
[
  {
    "security_id": "uuid",
    "ticker": "SHP.JO",
    "name": "Shoprite",
    "action": "BUY",
    "confidence": 0.85,
    "reasoning": "Low beta (0.8) matches your risk profile"
  }
]
```

**Technical Notes**:
- This is a simplified v1 (no ML yet)
- Reference: `05_Implementation_Strategy.md` Section 4.3

**Definition of Done**:
- Run recommender for test user → Returns 5 recommendations
- Recommendations stored in database
- Tests pass

---

### REC-2: Create recommendation generation CronJob
**Epic**: Recommendation Engine  
**Story Points**: 3  
**Priority**: High  
**Assignee**: Senior Backend Engineer #2

**Description**:
As a system, I need to generate recommendations daily so that users see fresh insights.

**Acceptance Criteria**:
- [ ] Kubernetes CronJob: `cronjobs/recommendation-generator.yaml`
- [ ] Schedule: Daily at 6am CAT (`0 6 * * *`)
- [ ] Python script: `scripts/generate_recommendations.py`
- [ ] For each user:
  - [ ] Call recommendation engine
  - [ ] Store recommendations
  - [ ] Publish event to Kafka (topic: `recommendation-computed`)
- [ ] Log progress (every 10 users)
- [ ] Alert on failure (Slack webhook)

**Technical Notes**:
- Use Kubernetes Job (not Deployment)
- Timeout: 30 minutes (if >10K users, optimize later)

**Definition of Done**:
- CronJob runs successfully in Kubernetes
- Check database: New recommendations created
- Verify Kafka topic: Events published

---

### REC-3: Implement GET /recommendations endpoint
**Epic**: Recommendation Engine  
**Story Points**: 3  
**Priority**: High  
**Assignee**: Full-Stack Engineer #1

**Description**:
As a frontend developer, I need an API to fetch recommendations so that I can display them.

**Acceptance Criteria**:
- [ ] Endpoint: `GET /api/v1/recommendations`
- [ ] Query parameters:
  - [ ] `status` (optional, filter by ACTIVE/EXPIRED/EXECUTED)
  - [ ] `limit` (default 10)
- [ ] Response: JSON array of recommendations
- [ ] Include security details (ticker, name)
- [ ] Unit tests: 80%+ coverage

**Request Example**:
```bash
GET /api/v1/recommendations?status=ACTIVE
Authorization: Bearer <token>
```

**Response Example**:
```json
{
  "data": [
    {
      "id": "uuid",
      "security": {
        "ticker": "SHP.JO",
        "name": "Shoprite Holdings Ltd"
      },
      "action": "BUY",
      "confidence": 0.85,
      "price_target": 185.50,
      "created_at": "2026-09-05T06:00:00Z",
      "expires_at": "2026-09-12T06:00:00Z",
      "reasoning": "Low beta (0.8) matches your risk profile"
    }
  ]
}
```

**Technical Notes**:
- Reference: `06_API_Specification.md` Section 4.3

**Definition of Done**:
- Endpoint returns data
- Only returns recommendations for authenticated user
- Tests pass

---

### WEB-3: Create dashboard page
**Epic**: Web Application  
**Story Points**: 8  
**Priority**: Critical  
**Assignee**: Full-Stack Engineer #1

**Description**:
As a user, I need a dashboard so that I can see my recommendations and portfolio.

**Acceptance Criteria**:
- [ ] Page: `/dashboard`
- [ ] Sections:
  - [ ] Header (Welcome, User Name)
  - [ ] Portfolio Summary (total value, day change, allocation chart - placeholder)
  - [ ] Recommendations (cards showing top 5)
  - [ ] Quick Actions (Buy, View Portfolio)
- [ ] Call API: `GET /api/v1/recommendations`
- [ ] Display loading state
- [ ] Display error state (if API fails)
- [ ] Responsive design

**Design**:
- Reference: `07_UI_UX_Design.md` Section 3.5

**Technical Notes**:
- Use SWR for data fetching (caching, revalidation)
- Placeholder chart (use Chart.js or Recharts)

**Definition of Done**:
- Login → Redirected to dashboard
- See recommendations (if generated)
- Responsive on mobile

---

### WEB-4: Create recommendation card component
**Epic**: Web Application  
**Story Points**: 5  
**Priority**: High  
**Assignee**: Full-Stack Engineer #1

**Description**:
As a user, I need a visual representation of recommendations so that I can quickly understand them.

**Acceptance Criteria**:
- [ ] Component: `components/RecommendationCard.tsx`
- [ ] Props: `{recommendation}`
- [ ] Display:
  - [ ] Security name & ticker
  - [ ] Action (BUY/SELL) with color badge
  - [ ] Confidence score (85%)
  - [ ] Price target
  - [ ] "View Evidence" button
- [ ] Hover effect (shadow, scale)
- [ ] Click → Navigate to `/recommendations/[id]`

**Design**:
- Reference: `07_UI_UX_Design.md` Section 3.6

**Definition of Done**:
- Card renders correctly
- Hover effect works
- Click navigates to detail page

---

### DATA-4: Implement data quality checks
**Epic**: Security Master Data Plane  
**Story Points**: 5  
**Priority**: Medium  
**Assignee**: Data Engineer

**Description**:
As a data engineer, I need data quality checks so that bad data doesn't enter the system.

**Acceptance Criteria**:
- [ ] Python module: `data_quality/checks.py`
- [ ] Checks:
  - [ ] Price data: Close price > 0
  - [ ] Price data: Volume >= 0
  - [ ] Price data: High >= Low
  - [ ] No duplicate (security_id, date) pairs
  - [ ] Date is not in the future
- [ ] Run after each ingestion
- [ ] Log violations (CloudWatch)
- [ ] Alert if >5% of data fails checks (Slack)

**Technical Notes**:
- Use Great Expectations library (optional)
- Reference: `05_Implementation_Strategy.md` Section 4.2

**Definition of Done**:
- Run ingestion with bad data → Violations logged
- Run ingestion with good data → No violations
- Slack alert triggered on high failure rate

---

### KAFKA-1: Set up Kafka cluster (Azure Event Hubs)
**Epic**: Infrastructure & DevOps  
**Story Points**: 5  
**Priority**: Medium  
**Assignee**: Head of Engineering

**Description**:
As a backend engineer, I need Kafka so that I can implement event-driven architecture.

**Acceptance Criteria**:
- [ ] Azure Event Hubs namespace created (Standard tier)
- [ ] Kafka protocol enabled (port 9093)
- [ ] Network Security Group configured (only AKS can connect)
- [ ] Event Hubs (topics) created:
  - [ ] `user-events`
  - [ ] `recommendation-computed`
  - [ ] `order-placed`
- [ ] Test: Produce and consume message using Kafka protocol
- [ ] Client library configured (kafka-python)

**Technical Notes**:
- Azure Event Hubs is Kafka-compatible (use standard Kafka clients)
- Connection string includes SAS key for authentication
- Alternative: Self-host Kafka on AKS (more complex, more expensive)
- Reference: `02_System_Architecture.md` Section 2.4

**Definition of Done**:
- Produce message using kafka-python
- Consume message using kafka-python
- Documentation in `docs/infrastructure/event-hubs.md`

---

### KAFKA-2: Implement event publishing (recommendation-computed)
**Epic**: Recommendation Engine  
**Story Points**: 3  
**Priority**: Medium  
**Assignee**: Senior Backend Engineer #2

**Description**:
As a backend engineer, I need to publish events so that other services can react.

**Acceptance Criteria**:
- [ ] Publish event to Kafka topic `recommendation-computed` after generating recommendations
- [ ] Event payload:
  ```json
  {
    "user_id": "uuid",
    "recommendation_ids": ["uuid1", "uuid2"],
    "created_at": "2026-09-05T06:00:00Z"
  }
  ```
- [ ] Unit tests: Verify event published

**Technical Notes**:
- Use kafka-python producer
- Idempotent producer (exactly-once semantics)

**Definition of Done**:
- Generate recommendation → Event published to Kafka
- Consume event: `kafka-console-consumer --topic recommendation-computed`

---

**Sprint 3 Summary**:
- **Total Tasks**: 10
- **Total Story Points**: 55
- **Critical Path**: PROFILE-1 → REC-1 → REC-2 → REC-3 → WEB-3
- **Blockers**: None
- **Sprint Demo**: Show end-to-end flow: Register → Risk Profile → Dashboard with Recommendations

---

## 5. Sprint 4 Tasks (Weeks 7-8)

### Sprint Goal
**"Implement evidence trail visualization and portfolio management basics"**

(30 more sprints follow the same structure - truncated for brevity. Full list available in `05_Implementation_Strategy.md`)

---

## 8. Task Template

Use this template when creating new tasks:

```markdown
### [EPIC-CODE]-[NUMBER]: [Task Title]
**Epic**: [Epic Name]  
**Story Points**: [1-13]  
**Priority**: [Critical/High/Medium/Low]  
**Assignee**: [Role or Name]

**Description**:
As a [role], I need to [action] so that [benefit].

**Acceptance Criteria**:
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
- [ ] Unit tests: [coverage %]

**Technical Notes**:
- Implementation details
- Reference: [Link to design doc]

**Definition of Done**:
- Specific, testable completion criteria
- Documentation updated (if applicable)
```

---

## 9. Definition of Done

A task is only "Done" when ALL of these are true:

### Code Quality
- [ ] Code reviewed by at least 1 other engineer
- [ ] Unit tests written (80%+ coverage for business logic)
- [ ] Integration tests written (for API endpoints)
- [ ] No linter errors (black, isort, flake8)
- [ ] TypeScript compiles without errors (frontend)

### Functionality
- [ ] Acceptance criteria met
- [ ] Manually tested (happy path + edge cases)
- [ ] Works in dev environment
- [ ] No known bugs

### Documentation
- [ ] API documented in OpenAPI (if new endpoint)
- [ ] README updated (if new service or major feature)
- [ ] Code comments for complex logic
- [ ] Runbook updated (if new operational task)

### Deployment
- [ ] Merged to `develop` branch
- [ ] Deployed to dev environment
- [ ] Verified in dev environment
- [ ] Migration scripts run successfully (if database changes)

### Security & Performance
- [ ] No secrets in code (use env vars)
- [ ] Input validation (prevent SQL injection, XSS)
- [ ] Performance acceptable (API response < 500ms p95)
- [ ] No memory leaks

---

## How to Use This Document

1. **For Product Managers**:
   - Use epic structure to plan roadmap
   - Prioritize tasks based on business value
   - Track progress (burndown charts, velocity)

2. **For Engineers**:
   - Pick tasks from sprint backlog
   - Follow acceptance criteria
   - Check off items as you complete them
   - Move task to "Done" when Definition of Done is met

3. **For Scrum Masters**:
   - Run sprint planning (select tasks for sprint)
   - Facilitate daily standups (blockers? progress?)
   - Run sprint retrospectives (what went well? improve?)

4. **Import to JIRA/Linear**:
   - Copy each task into your project management tool
   - Tag with epic, story points, assignee
   - Link dependencies (e.g., GRAPH-3 depends on DATA-3)

---

## Appendix: Full Epic Breakdown

| Epic | Tasks | Story Points | Duration (Sprints) |
|------|-------|--------------|-------------------|
| Infrastructure & DevOps | 10 | 40 | 2 |
| Security Master Data Plane | 25 | 80 | 4 |
| Knowledge Graph | 30 | 100 | 5 |
| Authentication & User Management | 15 | 50 | 3 |
| Recommendation Engine | 35 | 120 | 6 |
| Portfolio Management | 20 | 70 | 4 |
| Web Application | 40 | 130 | 7 |
| **Total** | **175** | **590** | **~12 months** |

**Team Size**: 8 engineers, velocity ~50 story points/sprint  
**Timeline**: 12 sprints × 2 weeks = 6 months

---

**Document Version**: 1.0  
**Last Updated**: September 2026  
**Owner**: Head of Product / Scrum Master

*This is a living document. Add tasks as new requirements emerge. Archive completed tasks quarterly.*


---

## Phase 7: Broker Integration & Trade Execution (NEW)

### Overview
Enable users to execute MOBU recommendations with 1-click via connected broker accounts.

### Priority Brokers
1. **Alpaca** (Immediate - paper trading available)
2. **Interactive Brokers** (Global reach - 150+ markets)
3. **EasyEquities** (South Africa - partnership needed)

### Tasks

#### Week 1-2: Foundation
- [ ] **Task 7.1**: Set up Alpaca paper trading account
  - Sign up at https://alpaca.markets/
  - Get paper trading API keys
  - Test with `broker_integration_starter.py`
- [ ] **Task 7.2**: Build broker abstraction layer
  - Create `BrokerAdapter` base class
  - Implement `AlpacaAdapter`
  - Create `BrokerFactory` pattern
- [ ] **Task 7.3**: Database tables
  - Create `broker_connections` table
  - Create `executed_trades` table
  - Add encryption for OAuth tokens

#### Week 3-4: API Integration
- [ ] **Task 7.4**: Build trade execution API
  - `POST /api/v1/trade/execute` endpoint
  - Order validation (buying power check)
  - Error handling & retry logic
- [ ] **Task 7.5**: OAuth broker connection flow
  - "Connect Broker" UI
  - OAuth2 authorization
  - Token storage (encrypted)
- [ ] **Task 7.6**: Trade confirmation UI
  - Trade execution modal
  - Order status tracking
  - Real-time updates (WebSocket)

#### Week 5-6: Interactive Brokers
- [ ] **Task 7.7**: Apply for Interactive Brokers API access
  - Submit application at https://www.interactivebrokers.com/
  - Complete compliance docs
  - Receive API credentials
- [ ] **Task 7.8**: Build `InteractiveBrokersAdapter`
  - Implement OAuth2 authentication
  - Map to BrokerAdapter interface
  - Test with paper account
- [ ] **Task 7.9**: Multi-market support
  - Add currency conversion (USD, ZAR, NGN, KES)
  - Handle exchange hours
  - Support fractional shares

#### Week 7-8: Testing & Deployment
- [ ] **Task 7.10**: Integration tests
  - Test each broker adapter
  - End-to-end flow tests
  - Load testing (concurrent orders)
- [ ] **Task 7.11**: Security audit
  - Penetration testing
  - OAuth flow security review
  - Encryption verification
- [ ] **Task 7.12**: Deploy to production
  - Gradual rollout (10% → 50% → 100%)
  - Monitoring & alerting
  - User documentation

### Success Metrics
- **Week 2**: Paper trading works (100 test orders executed)
- **Week 4**: 10 beta users connected brokers
- **Week 6**: Interactive Brokers integrated
- **Week 8**: 100+ live trades executed via MOBU

### Dependencies
- Payment gateway integration (Phase 4)
- User authentication & KYC
- Real-time market data feeds

### Risks & Mitigations
- **Risk**: Broker API changes break integration
  - **Mitigation**: Version pinning, automated tests, monitoring
- **Risk**: User loses money due to bug
  - **Mitigation**: Paper trading mandatory first, extensive testing, insurance
- **Risk**: Regulatory issues
  - **Mitigation**: Legal review, partner with licensed brokers only

---

## Documentation Created
- ✅ `09_African_Market_Integration.md` - African exchanges, alternative data, payment gateways
- ✅ `10_Broker_Integration_Implementation.md` - Technical implementation guide
- ✅ `broker_integration_starter.py` - Working test script with Alpaca paper trading

**Next Action**: Run `python broker_integration_starter.py` to test broker integration immediately!
