/**
 * ShopLite Enterprise DevOps & Observability Telemetry Datasets
 * Note: Clearly labeled as DEMO / SAMPLE DATA until Prometheus/CloudWatch adapters are connected.
 */

export const IS_DEMO_METRICS = true;

export const SYSTEM_HEALTH_METRICS = [
  {
    id: "frontend",
    name: "Frontend Service",
    runtime: "React + Vite (Nginx 1.25)",
    endpoint: "http://localhost:3000",
    status: "healthy",
    uptime: "99.99%",
    latencyMs: 14,
    lastChecked: "Just now",
    dependencies: ["Catalog API", "Inventory API", "Orders API"]
  },
  {
    id: "catalog",
    name: "Catalog Service",
    runtime: "Node.js 20 (Express)",
    endpoint: "http://localhost:4000/health",
    status: "healthy",
    uptime: "99.98%",
    latencyMs: 28,
    lastChecked: "Just now",
    dependencies: ["PostgreSQL"]
  },
  {
    id: "inventory",
    name: "Inventory Service",
    runtime: "Go 1.22 (net/http)",
    endpoint: "http://localhost:5000/health",
    status: "healthy",
    uptime: "99.99%",
    latencyMs: 18,
    lastChecked: "Just now",
    dependencies: ["PostgreSQL"]
  },
  {
    id: "orders",
    name: "Orders Service",
    runtime: "Java 21 (Spring Boot 3.3)",
    endpoint: "http://localhost:8080/actuator/health",
    status: "healthy",
    uptime: "99.95%",
    latencyMs: 42,
    lastChecked: "Just now",
    dependencies: ["PostgreSQL", "Catalog API", "Inventory API"]
  },
  {
    id: "database",
    name: "PostgreSQL Database",
    runtime: "PostgreSQL 16 (Alpine)",
    endpoint: "db:5432 (backend-net)",
    status: "healthy",
    uptime: "100.00%",
    latencyMs: 6,
    lastChecked: "Just now",
    dependencies: ["Docker Named Volume"]
  }
];

export const TRAFFIC_TREND_DATA = [
  { time: "00:00", requests: 420, visitors: 110, latency: 22, errorRate: 0.05 },
  { time: "03:00", requests: 280, visitors: 75, latency: 19, errorRate: 0.02 },
  { time: "06:00", requests: 560, visitors: 140, latency: 24, errorRate: 0.04 },
  { time: "09:00", requests: 1450, visitors: 390, latency: 38, errorRate: 0.12 },
  { time: "12:00", requests: 2100, visitors: 580, latency: 45, errorRate: 0.18 },
  { time: "15:00", requests: 1890, visitors: 510, latency: 40, errorRate: 0.15 },
  { time: "18:00", requests: 1680, visitors: 440, latency: 34, errorRate: 0.09 },
  { time: "21:00", requests: 1220, visitors: 320, latency: 29, errorRate: 0.07 }
];

export const HTTP_STATUS_DISTRIBUTION = [
  { status: "200 OK", count: 8840, percentage: 94.2, color: "#219ebc" },
  { status: "301/304 Cached", count: 320, percentage: 3.4, color: "#8ecae6" },
  { status: "404 Not Found", count: 180, percentage: 1.9, color: "#ffb703" },
  { status: "500/502 Error", count: 45, percentage: 0.5, color: "#fb8500" }
];

export const LATENCY_PERCENTILES = [
  { time: "10:00", p50: 21, p95: 72, p99: 165 },
  { time: "11:00", p50: 25, p95: 85, p99: 182 },
  { time: "12:00", p50: 31, p95: 98, p99: 210 },
  { time: "13:00", p50: 28, p95: 91, p99: 194 },
  { time: "14:00", p50: 24, p95: 80, p99: 178 },
  { time: "15:00", p50: 23, p95: 76, p99: 170 },
  { time: "16:00", p50: 22, p95: 74, p99: 168 }
];

export const RESOURCE_UTILIZATION = [
  { time: "10:00", cpu: 32, memory: 48, disk: 41 },
  { time: "11:00", cpu: 44, memory: 53, disk: 41 },
  { time: "12:00", cpu: 58, memory: 61, disk: 42 },
  { time: "13:00", cpu: 51, memory: 58, disk: 42 },
  { time: "14:00", cpu: 42, memory: 54, disk: 42 },
  { time: "15:00", cpu: 38, memory: 52, disk: 42 },
  { time: "16:00", cpu: 35, memory: 51, disk: 42 }
];

export const TOP_API_ENDPOINTS = [
  { method: "GET", path: "/api/products", service: "Catalog", rpm: 480, avgLatency: "24ms", errorRate: "0.02%" },
  { method: "GET", path: "/api/inventory/:sku", service: "Inventory", rpm: 320, avgLatency: "16ms", errorRate: "0.00%" },
  { method: "POST", path: "/api/orders", service: "Orders", rpm: 140, avgLatency: "48ms", errorRate: "0.45%" },
  { method: "GET", path: "/api/orders/:id", service: "Orders", rpm: 110, avgLatency: "32ms", errorRate: "0.00%" },
  { method: "POST", path: "/api/inventory/:sku/adjust", service: "Inventory", rpm: 45, avgLatency: "22ms", errorRate: "0.00%" }
];

export const CONTAINER_FLEET = [
  { id: "c-01", name: "shoplite-frontend", image: "shoplite/frontend:v1.2.4", status: "running", port: "3000:80", restarts: 0, cpu: "1.2%", mem: "42MB" },
  { id: "c-02", name: "shoplite-catalog", image: "shoplite/catalog:v1.2.4", status: "running", port: "4000:4000", restarts: 0, cpu: "2.8%", mem: "84MB" },
  { id: "c-03", name: "shoplite-inventory", image: "shoplite/inventory:v1.1.0", status: "running", port: "5000:5000", restarts: 0, cpu: "0.8%", mem: "28MB" },
  { id: "c-04", name: "shoplite-orders", image: "shoplite/orders:v1.0.8", status: "running", port: "8080:8080", restarts: 1, cpu: "4.5%", mem: "240MB" },
  { id: "c-05", name: "shoplite-postgres", image: "postgres:16-alpine", status: "running", port: "5432 (int)", restarts: 0, cpu: "2.1%", mem: "115MB" }
];

export const DEPLOYMENT_HISTORY = [
  {
    id: "dep-104",
    workflow: "EC2 Production CD",
    commit: "6ccfc5f",
    branch: "main",
    author: "Emaan Humayun",
    status: "success",
    duration: "2m 14s",
    deployedAt: "2026-11-23 11:46:00",
    imageTag: "sha-6ccfc5f"
  },
  {
    id: "dep-103",
    workflow: "CI / Trivy Vulnerability Scan",
    commit: "e768940",
    branch: "feature/project-structure",
    author: "Ishtiaq Ahmad",
    status: "success",
    duration: "1m 45s",
    deployedAt: "2026-11-23 10:55:00",
    imageTag: "sha-e768940"
  },
  {
    id: "dep-102",
    workflow: "CI / Test & Build",
    commit: "35b9a2b",
    branch: "main",
    author: "Emaan Humayun",
    status: "success",
    duration: "1m 32s",
    deployedAt: "2026-11-23 09:30:00",
    imageTag: "sha-35b9a2b"
  }
];

export const TRIVY_SECURITY_FINDINGS = [
  { id: "CVE-2024-21538", severity: "HIGH", pkg: "cross-spawn", service: "catalog-service", installed: "7.0.3", fixed: "7.0.5", status: "Audited" },
  { id: "CVE-2024-37890", severity: "MEDIUM", pkg: "ws", service: "frontend", installed: "8.17.0", fixed: "8.17.1", status: "Resolved" },
  { id: "CVE-2024-4067", severity: "MEDIUM", pkg: "micromatch", service: "catalog-service", installed: "4.0.5", fixed: "4.0.8", status: "Audited" },
  { id: "CVE-2024-28849", severity: "LOW", pkg: "follow-redirects", service: "frontend", installed: "1.15.5", fixed: "1.15.6", status: "Patched" }
];

export const ACTIVE_ALERTS = [
  {
    id: "alt-01",
    severity: "warning",
    title: "Inventory Level Below Safety Buffer",
    service: "Inventory Service",
    message: "SKU SHP-FTW-05 is completely out of stock. Stock replenishment recommended.",
    timestamp: "18m ago",
    acknowledged: false
  },
  {
    id: "alt-02",
    severity: "info",
    title: "SSL Certificate Auto-Renewal Scheduled",
    service: "Nginx Gateway",
    message: "Certbot cron job verification scheduled in 14 days. Current Let's Encrypt certificate valid.",
    timestamp: "2h ago",
    acknowledged: true
  }
];

export const USER_ACCOUNTS = [
  { id: "usr-01", name: "Emaan Humayun", email: "emaan@cloudcrafters.internal", role: "super_admin", status: "active", lastActive: "Just now" },
  { id: "usr-02", name: "Ishtiaq Ahmad", email: "ishtiaq@cloudcrafters.internal", role: "super_admin", status: "active", lastActive: "5m ago" },
  { id: "usr-03", name: "Sarah Jenkins", email: "sarah.j@shoplite.com", role: "admin", status: "active", lastActive: "1h ago" },
  { id: "usr-04", name: "David Chen", email: "david.c@shoplite.com", role: "admin", status: "suspended", lastActive: "3d ago" }
];

export const CUSTOMER_DIRECTORY = [
  { id: "CUST-101", name: "Sophia Montgomery", email: "sophia.m@example.com", ordersCount: 4, totalSpend: 1845.00, status: "VIP", joined: "2026-04-12" },
  { id: "CUST-102", name: "Marcus Sterling", email: "m.sterling@domain.co.uk", ordersCount: 6, totalSpend: 3120.00, status: "VIP", joined: "2026-03-01" },
  { id: "CUST-103", name: "Elena Rostova", email: "elena.rostova@design.org", ordersCount: 2, totalSpend: 734.24, status: "Regular", joined: "2026-08-15" },
  { id: "CUST-104", name: "Julian Vance", email: "julian.vance@techcorp.io", ordersCount: 1, totalSpend: 209.80, status: "New", joined: "2026-11-20" },
  { id: "CUST-105", name: "Camille Laurent", email: "c.laurent@paris.fr", ordersCount: 3, totalSpend: 890.60, status: "Regular", joined: "2026-06-22" }
];
