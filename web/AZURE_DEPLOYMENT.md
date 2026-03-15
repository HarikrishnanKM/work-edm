# Azure Container Apps Deployment Guide

## Prerequisites

- Azure CLI installed and configured
- Docker installed (for local testing)
- Access to Azure Container Registry (ACR)
- Azure Container Apps environment set up

## Environment Setup

### 1. Create Azure Resource Group (if not exists)

```bash
az group create \
  --name work-edm-rg \
  --location eastus
```

### 2. Create Azure Container Registry

```bash
az acr create \
  --resource-group work-edm-rg \
  --name workredmregistry \
  --sku Basic
```

### 3. Create Container Apps Environment

```bash
az containerapp env create \
  --name work-edm-env \
  --resource-group work-edm-rg \
  --location eastus
```

## Build and Push Image

### Build locally and push to ACR

```bash
# Build the Docker image
docker build -t work-edm:latest .

# Tag for ACR
docker tag work-edm:latest workredmregistry.azurecr.io/work-edm:latest

# Log in to ACR
az acr login --name workredmregistry

# Push image
docker push workredmregistry.azurecr.io/work-edm:latest
```

### Or use ACR Tasks (recommended for CI/CD)

```bash
az acr build \
  --registry workredmregistry \
  --image work-edm:latest \
  .
```

## Deploy to Container Apps

### Option 1: Using Azure CLI

```bash
az containerapp create \
  --name work-edm \
  --resource-group work-edm-rg \
  --environment work-edm-env \
  --image workredmregistry.azurecr.io/work-edm:latest \
  --target-port 8080 \
  --ingress external \
  --registry-server workredmregistry.azurecr.io \
  --registry-username <acr-username> \
  --registry-password <acr-password> \
  --environment-variables \
    VITE_API_URL=https://your-api-domain.com/api \
  --cpu 0.5 \
  --memory 1.0Gi \
  --min-replicas 1 \
  --max-replicas 3
```

### Option 2: Using ARM Template (Infrastructure as Code)

Create `deploy.json`:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "registryName": {
      "type": "string",
      "metadata": {
        "description": "ACR registry name"
      }
    },
    "apiUrl": {
      "type": "string",
      "metadata": {
        "description": "Backend API URL"
      }
    }
  },
  "variables": {
    "containerAppName": "work-edm",
    "location": "[resourceGroup().location]"
  },
  "resources": [
    {
      "type": "Microsoft.App/containerApps",
      "apiVersion": "2022-03-01",
      "name": "[variables('containerAppName')]",
      "location": "[variables('location')]",
      "properties": {
        "managedEnvironmentId": "[resourceId('Microsoft.App/managedEnvironments', 'work-edm-env')]",
        "configuration": {
          "ingress": {
            "external": true,
            "targetPort": 8080
          },
          "registries": [
            {
              "server": "[concat(parameters('registryName'), '.azurecr.io')]",
              "username": "[listCredentials(resourceId('Microsoft.ContainerRegistry/registries', parameters('registryName')), '2021-12-01-preview').username]",
              "passwordSecretRef": "acr-password"
            }
          ],
          "secrets": [
            {
              "name": "acr-password",
              "value": "[listCredentials(resourceId('Microsoft.ContainerRegistry/registries', parameters('registryName')), '2021-12-01-preview').passwords[0].value]"
            }
          ]
        },
        "template": {
          "containers": [
            {
              "name": "work-edm",
              "image": "[concat(parameters('registryName'), '.azurecr.io/work-edm:latest')]",
              "resources": {
                "cpu": 0.5,
                "memory": "1.0Gi"
              },
              "env": [
                {
                  "name": "VITE_API_URL",
                  "value": "[parameters('apiUrl')]"
                }
              ]
            }
          ],
          "scale": {
            "minReplicas": 1,
            "maxReplicas": 3
          }
        }
      }
    }
  ],
  "outputs": {
    "containerAppUrl": {
      "type": "string",
      "value": "[reference(resourceId('Microsoft.App/containerApps', variables('containerAppName'))).properties.configuration.ingress.fqdn]"
    }
  }
}
```

Deploy with:

```bash
az deployment group create \
  --resource-group work-edm-rg \
  --template-file deploy.json \
  --parameters \
    registryName=workredmregistry \
    apiUrl=https://your-api-domain.com/api
```

## Update Deployment

### Update environment variables

```bash
az containerapp update \
  --name work-edm \
  --resource-group work-edm-rg \
  --set-env-vars VITE_API_URL=https://new-api-url.com/api
```

### Update image

```bash
az containerapp update \
  --name work-edm \
  --resource-group work-edm-rg \
  --image workredmregistry.azurecr.io/work-edm:v1.0.0
```

### Update replicas

```bash
az containerapp update \
  --name work-edm \
  --resource-group work-edm-rg \
  --min-replicas 2 \
  --max-replicas 5
```

## Monitoring and Debugging

### View logs

```bash
az containerapp logs show \
  --name work-edm \
  --resource-group work-edm-rg \
  --follow
```

### Check container status

```bash
az containerapp show \
  --name work-edm \
  --resource-group work-edm-rg \
  --query properties.runningStatus
```

### Test endpoint

```bash
# Get the FQDN
az containerapp show \
  --name work-edm \
  --resource-group work-edm-rg \
  --query properties.configuration.ingress.fqdn

# Test health endpoint
curl https://<fqdn>/health
```

## Custom Domain

### Add custom domain

```bash
az containerapp hostname bind \
  --name work-edm \
  --resource-group work-edm-rg \
  --hostname app.yourdomain.com
```

### Configure DNS

Add a CNAME record in your DNS provider:
```
app.yourdomain.com CNAME <container-app-fqdn>
```

## Auto-scaling

Configure rules based on CPU/memory:

```bash
az containerapp update \
  --name work-edm \
  --resource-group work-edm-rg \
  --min-replicas 1 \
  --max-replicas 5 \
  --scale-rule-name cpu-rule \
  --scale-rule-type cpu \
  --scale-rule-metadata target-cpu=70
```

## Cost Optimization

- **Use Consumption plan** (pay per request) for variable workloads
- **Set appropriate CPU/memory** (0.5 CPU / 1 GB is sufficient for this app)
- **Use min-replicas = 1** to avoid idle time costs
- **Enable zone redundancy** for production (multi-region)

## Cleanup

```bash
# Delete container app
az containerapp delete \
  --name work-edm \
  --resource-group work-edm-rg

# Delete entire resource group (warning: deletes all resources)
az group delete --name work-edm-rg
```

## Troubleshooting

### Container won't start
- Check image name and tag
- Verify environment variables are set
- Check ACR login credentials
- Review container logs: `az containerapp logs show --name work-edm`

### Connection timeout
- Verify ingress is external: `true`
- Check target port (should be 8080)
- Verify networking/firewall rules

### API connection errors
- Ensure `VITE_API_URL` is correctly set
- Verify API is accessible from container
- Check CORS configuration on backend
- Test with: `curl $VITE_API_URL/employees` from container

### High memory usage
- Review app logs for memory leaks
- Reduce page cache
- Implement lazy loading

## References

- [Azure Container Apps Documentation](https://learn.microsoft.com/en-us/azure/container-apps/)
- [Container Apps Pricing](https://azure.microsoft.com/en-us/pricing/details/container-apps/)
- [ACR Documentation](https://learn.microsoft.com/en-us/azure/container-registry/)
