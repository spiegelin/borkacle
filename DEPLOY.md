# Deployment Guide

This guide outlines the steps to build, push, and deploy the Borkacle application components using Docker and Kubernetes on Oracle Cloud Infrastructure (OCI).

## Docker Image Management

### Login to OCI Registry
```zsh
docker login <region> --username '<ns>/<user>'
```

### Build Images
```zsh
# Build images
docker build --platform linux/amd64 -t borkacle-controller:latest ./controller
docker build --platform linux/amd64 -t borkacle-frontend:latest ./frontend
docker build --platform linux/amd64 -t borkacle-bot:latest ./bot
```

### Tag Images
```zsh
# Tag images
docker tag borkacle-controller:latest <region>/<ns>/borkacle-controller:1.0.1
docker tag borkacle-frontend:latest <region>/<ns>/borkacle-frontend:1.0.1
docker tag borkacle-bot:latest <region>/<ns>/borkacle-bot:1.0.1
```

### Push Images
```zsh
# Push images (Maybe run more than once if error 409 on controller)
docker push <region>/<ns>/borkacle-controller:1.0.1
docker push <region>/<ns>/borkacle-frontend:1.0.1
docker push <region>/<ns>/borkacle-bot:1.0.1
```

### Set Repositories to Public (Manual Step)
Visit <https://cloud.oracle.com/compute/registry/containers> and set all pushed repositories (`borkacle-controller`, `borkacle-frontend`, `borkacle-bot`) to public.

## Kubernetes Setup and Deployment

### Initial Configuration
```zsh
# Kubernetes configuration
mkdir -p $HOME/.kube
oci ce cluster create-kubeconfig --cluster-id ... # Replace ... with your OKE cluster OCID
export KUBECONFIG=$HOME/.kube/config
```

### Create Namespace
```zsh
# Create a namespace
kubectl create namespace borkacle
```

### Create Secrets

**Application Secrets:**
```zsh
# Create secrets
kubectl create secret generic app-secrets \
  --namespace borkacle \
  --from-literal=DB_URL='your-db-url' \
  --from-literal=DB_USERNAME='your-db-username' \
  --from-literal=DB_PASSWORD='your-db-password' \
  --from-literal=TRUST_STORE_PASSWORD='your-trust-store-password' \
  --from-literal=KEY_STORE_PASSWORD='your-key-store-password' \
  --from-literal=TELEGRAM_BOT_TOKEN='your-telegram-bot-token' \
  --from-literal=TELEGRAM_BOT_NAME='your-telegram-bot-name' \
  --from-literal=JWT_SECRET='your-jwt-secret' \
  --from-literal=JWT_EXPIRATION_MS='your-jwt-expiration-ms'
```

**Wallet Secret:**
```zsh
# Create a wallet secret
kubectl create secret generic wallet-secret \
  --namespace borkacle \
  --from-file=./wallet/truststore.jks \
  --from-file=./wallet/keystore.jks \
  --from-file=./wallet/cwallet.sso \
  --from-file=./wallet/ewallet.p12 \
  --from-file=./wallet/ewallet.pem \
  --from-file=./wallet/ojdbc.properties \
  --from-file=./wallet/sqlnet.ora \
  --from-file=./wallet/tnsnames.ora
```

**Confirm Secret Creation:**
```zsh
# Confirm everything was created
kubectl describe secret app-secrets -n borkacle
kubectl get secret app-secrets -n borkacle -o jsonpath="{.data.DB_URL}" | base64 --decode # Decode if needed
```

### Apply Manifests
```zsh
# Apply Kubernetes manifests from the k8s directory
kubectl apply -f k8s/
```

### Confirmation
```zsh
# Confirm deployment status
kubectl get pods -n borkacle
kubectl get services -n borkacle
```

## Troubleshooting and Maintenance

### Debugging Commands
```zsh
### Useful to debug
kubectl delete secret app-secrets -n borkacle # Example: Delete secrets if needed
kubectl describe pods frontend -n borkacle # Describe a specific pod
kubectl logs frontend-... -n borkacle # Get logs from a frontend pod (replace ... with pod suffix)
kubectl logs bot-... -n borkacle # Get logs from a bot pod
kubectl logs controller-... -n borkacle # Get logs from a controller pod
kubectl get events -n borkacle --sort-by=.metadata.creationTimestamp # View cluster events
kubectl get secret app-secrets -n borkacle -o json | jq '.data | map_values(@base64d)' # View decoded secrets
```

### Restart Deployments
```zsh
### Restart after applying changes (if needed)
kubectl rollout restart deployment/bot deployment/controller deployment/frontend -n borkacle
```

### Cleanup
```zsh
### Delete everything
#kubectl delete all --all -n borkacle # Uncomment to delete all resources in the namespace
kubectl delete namespace borkacle # Delete the entire namespace
```
