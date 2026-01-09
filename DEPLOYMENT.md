# Panduan Deployment KopiKu ke Debian Server

## Prasyarat Server

1. **Node.js** (v18+)
2. **MongoDB** (atau gunakan MongoDB Atlas)
3. **PM2** (process manager)
4. **Nginx** (reverse proxy)

## Langkah Deployment

### 1. Siapkan Server Debian

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

### 2. Siapkan Direktori Upload

```bash
# Buat direktori upload di luar project
sudo mkdir -p /var/www/kopi-potonoro/uploads

# Set ownership ke user yang menjalankan Node.js
sudo chown -R $USER:$USER /var/www/kopi-potonoro

# Set permissions
chmod 755 /var/www/kopi-potonoro/uploads
```

### 3. Clone & Build Project

```bash
# Clone repository
cd /var/www
git clone <your-repo-url> kopiku-app
cd kopiku-app

# Install dependencies
npm install

# Create .env.local from example
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

### 4. Konfigurasi Environment (.env.local)

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/kopiku

# Production settings
NODE_ENV=production
UPLOAD_DIR=/var/www/kopi-potonoro/uploads

# Tambahkan key lain sesuai kebutuhan
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=xxx
# CLERK_SECRET_KEY=xxx
# MIDTRANS_SERVER_KEY=xxx
# NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=xxx
```

### 5. Build Aplikasi

```bash
npm run build
```

### 6. Jalankan dengan PM2

```bash
# Start aplikasi
pm2 start npm --name "kopiku" -- start

# Auto-start saat reboot
pm2 startup
pm2 save
```

### 7. Konfigurasi Nginx

Buat file: `/etc/nginx/sites-available/kopiku`

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Increase max upload size
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/kopiku /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 8. (Opsional) SSL dengan Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Struktur Path Gambar

### Development
- Upload ke: `{project}/public/uploads/`
- URL: `/uploads/filename.jpg`

### Production
- Upload ke: `/var/www/kopi-potonoro/uploads/`
- URL: `/api/uploads/filename.jpg` (served via API)

## Maintenance

### Backup Uploads
```bash
# Backup folder upload
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz /var/www/kopi-potonoro/uploads
```

### Logs
```bash
# Lihat logs
pm2 logs kopiku

# Restart aplikasi
pm2 restart kopiku
```

### Update Aplikasi
```bash
cd /var/www/kopi-potonoro-app
git pull
npm install
npm run build
pm2 restart kopiku
```

## Troubleshooting

### Gambar tidak muncul
1. Cek permission folder upload: `ls -la /var/www/kopi-potonoro/uploads`
2. Cek UPLOAD_DIR di .env.local
3. Cek logs: `pm2 logs kopiku`

### Permission denied
```bash
sudo chown -R $USER:$USER /var/www/kopi-potonoro
chmod 755 /var/www/kopi-potonoro/uploads
```
