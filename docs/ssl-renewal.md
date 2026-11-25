# ShopLite SSL Certificate Renewal Automation

This document details the automated SSL certificate renewal pipeline for the ShopLite e-commerce platform using **Certbot / Let's Encrypt** and **Bash automation**.

---

## 1. Overview

- **Script Path:** `scripts/renew-ssl.sh`
- **Target Domain:** Configurable (defaults to `cloudcrafters-shoplite.duckdns.org` via `$SSL_DOMAIN`)
- **Certificate Path:** `/etc/letsencrypt/live/<domain>/fullchain.pem`
- **Execution Log:** `/var/log/shoplite/ssl-renewal.log`
- **Renewal Threshold:** Automatically renews when certificate has less than **30 days** of validity remaining.
- **Web Server Reload:** Triggers automated reload of the `shoplite-frontend` Nginx Docker container or systemd Nginx service upon successful renewal.

---

## 2. Usage & Manual Execution

Make the script executable:
```bash
chmod +x scripts/renew-ssl.sh
```

### Dry Run (Safe Test without reaching Let's Encrypt rate limits)
```bash
sudo ./scripts/renew-ssl.sh --dry-run
```

### Normal Check / Execution
```bash
sudo ./scripts/renew-ssl.sh
```

### Force Renewal
```bash
sudo ./scripts/renew-ssl.sh --force
```

---

## 3. Automated Scheduling (Cron Job)

To run the renewal check automatically twice daily (recommended by Let's Encrypt), add the following entry to the root crontab:

```bash
sudo crontab -e
```

Add this line:
```cron
# ShopLite SSL Certificate Renewal Automation (Runs daily at 03:00 and 15:00 UTC)
0 3,15 * * * /bin/bash /opt/shoplite/scripts/renew-ssl.sh >> /var/log/shoplite/ssl-renewal.log 2>&1
```

---

## 4. Security & Error Handling

- **Idempotent:** Does not issue renewals if the certificate is valid for more than 30 days.
- **Fail-safe:** Logs all execution outputs with UTC ISO-8601 timestamps.
- **Zero-Downtime:** Uses `nginx -s reload` rather than `restart` so active connections are gracefully handled.
