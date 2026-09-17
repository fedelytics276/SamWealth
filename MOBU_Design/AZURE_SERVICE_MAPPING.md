# MOBU Investment Platform
## AWS to Azure Service Mapping

**Purpose**: Reference guide for cloud platform migration  
**Last Updated**: September 2026

---

## Service Equivalents

| Category | AWS Service | Azure Equivalent | Notes |
|----------|-------------|------------------|-------|
| **Compute** |
| Container Orchestration | EKS (Elastic Kubernetes Service) | AKS (Azure Kubernetes Service) | Managed Kubernetes |
| Virtual Machines | EC2 | Azure Virtual Machines | IaaS compute |
| Serverless Functions | Lambda | Azure Functions | Event-driven compute |
| **Networking** |
| Load Balancer | ALB (Application Load Balancer) | Azure Application Gateway | Layer 7 load balancing |
| Load Balancer | ELB/NLB | Azure Load Balancer | Layer 4 load balancing |
| Virtual Network | VPC | Azure Virtual Network (VNet) | Network isolation |
| DNS | Route 53 | Azure DNS | Domain name system |
| CDN | CloudFront | Azure CDN | Content delivery |
| NAT | NAT Gateway | Azure NAT Gateway | Outbound internet connectivity |
| **Database** |
| Relational Database | RDS PostgreSQL | Azure Database for PostgreSQL | Managed PostgreSQL |
| NoSQL | DynamoDB | Azure Cosmos DB | Globally distributed database |
| Caching | ElastiCache Redis | Azure Cache for Redis | In-memory cache |
| **Storage** |
| Object Storage | S3 | Azure Blob Storage | Object/file storage |
| File Storage | EFS | Azure Files | Shared file system |
| Block Storage | EBS | Azure Managed Disks | VM disk storage |
| **Messaging** |
| Message Queue | SQS | Azure Queue Storage / Service Bus | Message queueing |
| Pub/Sub | SNS | Azure Service Bus / Event Grid | Publish-subscribe |
| Event Streaming | MSK (Managed Kafka) | Azure Event Hubs | Apache Kafka compatible |
| **Security** |
| IAM | IAM | Azure Active Directory (AAD) / RBAC | Identity & access management |
| Secrets | Secrets Manager | Azure Key Vault | Secrets management |
| Encryption Keys | KMS | Azure Key Vault | Key management service |
| WAF | AWS WAF | Azure WAF | Web application firewall |
| DDoS Protection | AWS Shield | Azure DDoS Protection | DDoS mitigation |
| **Monitoring** |
| Logging | CloudWatch Logs | Azure Monitor Logs | Log aggregation |
| Metrics | CloudWatch Metrics | Azure Monitor Metrics | Metrics collection |
| APM | X-Ray | Azure Application Insights | Application performance monitoring |
| Alerts | CloudWatch Alarms | Azure Monitor Alerts | Alerting system |
| **Developer Tools** |
| Container Registry | ECR | Azure Container Registry (ACR) | Docker image registry |
| CI/CD | CodePipeline | Azure DevOps / GitHub Actions | CI/CD pipelines |
| **AI/ML** |
| Machine Learning | SageMaker | Azure Machine Learning | ML platform |
| **Analytics** |
| Data Warehouse | Redshift | Azure Synapse Analytics | Data warehousing |
| Search | Elasticsearch Service | Azure Cognitive Search | Full-text search |
| **Integration** |
| API Management | API Gateway | Azure API Management | API gateway |
| **Notification** |
| Email | SES | Azure Communication Services | Email service |
| SMS | SNS | Azure Communication Services | SMS service |

---

## MOBU Specific Mapping

### Infrastructure Components

| Component | AWS Implementation | Azure Implementation |
|-----------|-------------------|---------------------|
| **Kubernetes Cluster** | EKS | AKS |
| **PostgreSQL Database** | RDS PostgreSQL | Azure Database for PostgreSQL - Flexible Server |
| **Redis Cache** | ElastiCache Redis | Azure Cache for Redis |
| **Object Storage** | S3 | Azure Blob Storage |
| **Container Registry** | ECR | Azure Container Registry (ACR) |
| **Load Balancer** | ALB | Azure Application Gateway |
| **Virtual Network** | VPC | Azure Virtual Network (VNet) |
| **Secrets Management** | Secrets Manager | Azure Key Vault |
| **Kafka** | MSK | Azure Event Hubs (Kafka-compatible) |
| **Logging** | CloudWatch Logs | Azure Monitor Logs (Log Analytics) |
| **Monitoring** | CloudWatch | Azure Monitor |
| **Key Management** | KMS | Azure Key Vault |
| **IAM** | IAM Roles | Azure Managed Identity + RBAC |
| **Email** | SES | Azure Communication Services (Email) |
| **SMS** | SNS | Azure Communication Services (SMS) |

---

## Deployment Architecture Changes

### AWS Architecture
```
AWS Organization
└── Production Account
    └── VPC (10.0.0.0/16)
        ├── Public Subnet (ALB)
        ├── Private Subnet AZ-a (EKS, RDS Primary)
        ├── Private Subnet AZ-b (EKS, RDS Replica)
        └── Private Subnet Data (ElastiCache, MSK)
```

### Azure Architecture
```
Azure Subscription
└── Resource Group: mobu-prod
    └── VNet (10.0.0.0/16)
        ├── Public Subnet (Application Gateway)
        ├── Private Subnet AZ-1 (AKS, PostgreSQL Primary)
        ├── Private Subnet AZ-2 (AKS, PostgreSQL Replica)
        └── Private Subnet Data (Redis, Event Hubs)
```

---

## Service-Specific Notes

### 1. AKS (Azure Kubernetes Service)
**Equivalent to**: EKS

**Key Differences**:
- Native integration with Azure Active Directory
- Use Azure CNI or Kubenet for networking
- Azure Monitor for container insights (instead of CloudWatch Container Insights)
- Azure Policy for Kubernetes (instead of AWS Config)

**Configuration**:
```bash
# Create AKS cluster
az aks create \
  --resource-group mobu-prod \
  --name mobu-cluster \
  --node-count 3 \
  --node-vm-size Standard_D4s_v3 \
  --enable-managed-identity \
  --enable-addons monitoring \
  --network-plugin azure
```

---

### 2. Azure Database for PostgreSQL
**Equivalent to**: RDS PostgreSQL

**Key Differences**:
- Use "Flexible Server" tier (newer, more flexible)
- High Availability uses zone-redundant deployment
- Backup retention up to 35 days
- Native integration with Azure Monitor

**Connection String**:
```
Server=mobu-postgres.postgres.database.azure.com;
Database=mobu_prod;
Port=5432;
User Id=mobu_admin@mobu-postgres;
Password={password};
Ssl Mode=Require;
```

---

### 3. Azure Key Vault
**Equivalent to**: AWS Secrets Manager + KMS

**Key Differences**:
- Single service for both secrets and keys (AWS splits them)
- Use Managed Identity for passwordless authentication
- Supports Hardware Security Modules (HSM)

**Access from AKS**:
```yaml
# Use Azure Key Vault Provider for Secrets Store CSI Driver
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: azure-keyvault
spec:
  provider: azure
  parameters:
    keyvaultName: "mobu-keyvault"
    tenantId: "{tenant-id}"
```

---

### 4. Azure Event Hubs
**Equivalent to**: MSK (Managed Kafka)

**Key Differences**:
- Kafka-compatible API (use Kafka clients)
- Supports both Kafka protocol and AMQP
- No broker management (fully managed)
- Pricing based on throughput units, not brokers

**Kafka Configuration**:
```python
from kafka import KafkaProducer

producer = KafkaProducer(
    bootstrap_servers='mobu-eventhub.servicebus.windows.net:9093',
    security_protocol='SASL_SSL',
    sasl_mechanism='PLAIN',
    sasl_plain_username='$ConnectionString',
    sasl_plain_password='{connection_string}'
)
```

---

### 5. Azure Blob Storage
**Equivalent to**: S3

**Key Differences**:
- Three access tiers: Hot, Cool, Archive
- Containers (not buckets)
- Lifecycle management policies similar to S3

**Python SDK**:
```python
from azure.storage.blob import BlobServiceClient

blob_service = BlobServiceClient.from_connection_string(conn_str)
container_client = blob_service.get_container_client("documents")
```

---

### 6. Azure Monitor Logs
**Equivalent to**: CloudWatch Logs

**Key Differences**:
- Uses Kusto Query Language (KQL) instead of CloudWatch Insights
- Log Analytics Workspace (centralized log store)
- Retention up to 730 days

**Query Example (KQL)**:
```kql
ContainerLog
| where TimeGenerated > ago(1h)
| where LogLevel == "Error"
| summarize count() by ContainerName
```

---

### 7. Azure Application Gateway
**Equivalent to**: ALB (Application Load Balancer)

**Key Differences**:
- Integrated Web Application Firewall (WAF)
- Autoscaling built-in
- SSL termination
- URL-based routing

**Configuration**:
- Public IP for internet-facing traffic
- Backend pool: AKS cluster
- HTTP settings: Port 80/443
- WAF rules: OWASP CRS 3.2

---

### 8. Azure Container Registry (ACR)
**Equivalent to**: ECR

**Key Differences**:
- Geo-replication for multi-region deployments
- Integrated vulnerability scanning (Defender for Containers)
- Content trust (image signing)

**Integration with AKS**:
```bash
# Attach ACR to AKS
az aks update \
  --name mobu-cluster \
  --resource-group mobu-prod \
  --attach-acr moburegistry
```

---

## Infrastructure as Code

### Terraform Changes

**AWS Provider**:
```hcl
provider "aws" {
  region = "af-south-1"
}
```

**Azure Provider**:
```hcl
provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

resource "azurerm_resource_group" "mobu" {
  name     = "mobu-prod"
  location = "South Africa North"
}
```

---

### CI/CD Changes

**GitHub Actions with AWS**:
```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v1
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

**GitHub Actions with Azure**:
```yaml
- name: Azure Login
  uses: azure/login@v1
  with:
    creds: ${{ secrets.AZURE_CREDENTIALS }}
    
- name: Build and push to ACR
  uses: azure/docker-login@v1
  with:
    login-server: moburegistry.azurecr.io
    username: ${{ secrets.REGISTRY_USERNAME }}
    password: ${{ secrets.REGISTRY_PASSWORD }}
```

---

## Cost Comparison

### AWS Estimated Monthly Cost (Phase 1A)
| Service | Configuration | Cost |
|---------|---------------|------|
| EKS | 1 cluster | $73 |
| EC2 (EKS nodes) | 3 × t3.large | $228 |
| RDS PostgreSQL | db.t3.medium | $120 |
| ElastiCache Redis | cache.t3.micro | $17 |
| S3 | 100 GB | $2 |
| MSK | 3 brokers, t3.small | $300 |
| Data Transfer | 500 GB | $45 |
| **Total** | | **~$785/month** |

### Azure Estimated Monthly Cost (Phase 1A)
| Service | Configuration | Cost |
|---------|---------------|------|
| AKS | Control plane free | $0 |
| VMs (AKS nodes) | 3 × D4s_v3 | $384 |
| PostgreSQL | B_Standard_B2s | $65 |
| Redis | C1 (1 GB) | $25 |
| Blob Storage | 100 GB | $2 |
| Event Hubs | Standard tier | $150 |
| Data Transfer | 500 GB | $45 |
| **Total** | | **~$671/month** |

**Savings**: ~$114/month (~15% cheaper)

---

## Migration Checklist

### Pre-Migration
- [ ] Create Azure subscription
- [ ] Set up billing alerts
- [ ] Create service principals for automation
- [ ] Set up Azure DevOps or GitHub Actions

### Infrastructure
- [ ] Create Resource Group
- [ ] Create VNet with subnets
- [ ] Create AKS cluster
- [ ] Create Azure Database for PostgreSQL
- [ ] Create Azure Cache for Redis
- [ ] Create Azure Container Registry
- [ ] Create Application Gateway
- [ ] Create Key Vault
- [ ] Create Event Hubs namespace

### Application
- [ ] Update connection strings (PostgreSQL, Redis)
- [ ] Update Kafka bootstrap servers (Event Hubs)
- [ ] Update blob storage SDK (S3 → Blob)
- [ ] Update secrets retrieval (Secrets Manager → Key Vault)
- [ ] Update IAM to Azure Managed Identity
- [ ] Update logging (CloudWatch → Azure Monitor)

### CI/CD
- [ ] Update GitHub Actions workflows
- [ ] Update Docker registry (ECR → ACR)
- [ ] Update kubectl config (EKS → AKS)
- [ ] Update Terraform/Bicep scripts

### Testing
- [ ] Deploy to staging environment
- [ ] Run integration tests
- [ ] Performance testing
- [ ] Security scanning

### Cutover
- [ ] DNS update (if applicable)
- [ ] Database migration (AWS RDS → Azure PostgreSQL)
- [ ] Monitor metrics
- [ ] Verify logging
- [ ] User acceptance testing

---

## Regional Availability

### AWS Regions (Africa)
- **af-south-1**: Cape Town (South Africa) ✅ Available
- No other African regions

### Azure Regions (Africa)
- **South Africa North**: Johannesburg ✅ Available
- **South Africa West**: Cape Town ✅ Available

**Recommendation**: Use **South Africa North** (Johannesburg) as primary region.

---

## Key Differences Summary

| Aspect | AWS | Azure |
|--------|-----|-------|
| **Container Orchestration** | EKS ($73/month) | AKS (free control plane) |
| **Identity** | IAM | Azure AD + Managed Identity |
| **Secrets** | Secrets Manager + KMS | Key Vault (combined) |
| **Networking** | VPC | VNet |
| **Kafka** | MSK (expensive) | Event Hubs (cheaper, Kafka-compatible) |
| **Monitoring Query Language** | CloudWatch Insights | Kusto (KQL) |
| **Container Registry** | ECR | ACR |
| **Resource Organization** | Accounts > VPCs | Subscriptions > Resource Groups |

---

## Recommended Tools

### Azure CLI
```bash
# Install
brew install azure-cli  # macOS
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash  # Linux

# Login
az login

# Set subscription
az account set --subscription "{subscription-id}"
```

### kubectl for AKS
```bash
# Get AKS credentials
az aks get-credentials \
  --resource-group mobu-prod \
  --name mobu-cluster

# Verify
kubectl get nodes
```

### Terraform Azure Provider
```bash
# Install
terraform init

# Plan
terraform plan

# Apply
terraform apply
```

---

## Documentation Updates Required

The following documents need AWS → Azure updates:

1. ✅ **AZURE_SERVICE_MAPPING.md** (this document)
2. ⏳ **Technical_Diagrams.md** - Update deployment diagrams
3. ⏳ **IMPLEMENTATION_TASKS.md** - Update Sprint 1-6 tasks
4. ⏳ **02_System_Architecture.md** - Update architecture section
5. ⏳ **05_Implementation_Strategy.md** - Update infrastructure references
6. ⏳ **EXECUTION_READY_SUMMARY.md** - Update technology stack
7. ⏳ **Other documents** - Global find/replace for AWS→Azure

---

**Document Version**: 1.0  
**Last Updated**: September 2026  
**Owner**: Head of Engineering

*Use this as a reference when updating all MOBU documentation to Azure.*
