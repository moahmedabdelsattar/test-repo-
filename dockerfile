# استخدام نسخة Alpine لتقليل الحجم وتحسين الأداء
FROM node:18-alpine

# تحديد مجلد العمل
WORKDIR /app

# نسخ ملفات التعريف أولاً لعمل Caching للـ Layers
COPY package*.json ./

# تثبيت المكتبات (dependencies)
RUN npm install

# نسخ كود المشروع بالكامل
COPY . .

# المطابقة مع المنفذ الموجود في كود التطبيق (8000)
EXPOSE 8000

# تشغيل التطبيق
CMD [ "npm", "start" ]