import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN || ''; // <- обязательно поставь свой токен в env

const DATA_FILE = path.join(__dirname, 'data.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

async function ensureStorage() {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    try {
        await fs.access(DATA_FILE);
    } catch {
        const initial = {
            users: [],
            bookings: [],
            tracks: [],
            schedule: [
                { type: 'Open hours', text: '10:00 — 22:00' },
                { type: 'Kids group', text: 'Mon/Wed 18:00' }
            ],
            prices: [
                { name: '1 посещение', price: '600 ₽' },
                { name: 'Месяц', price: '4000 ₽' }
            ],
            news: [
                { id: 'n1', title: 'Новая секция трасс', date: new Date().toISOString(), text: 'Добавили 10 новых трасс.' }
            ]
        };
        await fs.writeFile(DATA_FILE, JSON.stringify(initial, null, 2), 'utf8');
    }
}
await ensureStorage();

async function readData() {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw);
}
async function writeData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Проверка подписи Telegram initData
function checkTelegramAuth(initData) {
    // initData is an object with many fields and hash
    const { hash, ...data } = initData;
    const arr = Object.keys(data).sort().map(k => `${k}=${data[k]}`);
    const checkString = arr.join('\n');

    if (!BOT_TOKEN) {
        console.warn('BOT_TOKEN not set — telegram auth check skipped (insecure)');
        return false;
    }

    const secretKey = crypto.createHash('sha256').update(BOT_TOKEN).digest();
    const hmac = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');
    return hmac === hash;
}

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static(path.join(__dirname, 'public')));

// multer for file uploads (track images)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const safe = file.originalname.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\.-]/g, '');
        cb(null, `${Date.now()}-${safe}`);
    }
});
const upload = multer({ storage });

// AUTH endpoint
// frontend should send initData object (Telegram.WebApp.initData or initDataUnsafe)
// Example body: { initData: { id: '...', first_name: '...', hash: '...', ... } }
app.post('/auth', async (req, res) => {
    try {
        const { initData } = req.body;
        if (!initData || typeof initData !== 'object') return res.status(400).json({ ok: false, error: 'no initData' });

        const ok = checkTelegramAuth(initData);
        if (!ok) return res.status(403).json({ ok: false, error: 'invalid signature' });

        const data = await readData();
        const user = {
            id: initData.id,
            user: initData,
            lastSeen: new Date().toISOString()
        };
        // save or update
        const existing = data.users.find(u => String(u.id) === String(initData.id));
        if (existing) {
            existing.user = initData;
            existing.lastSeen = user.lastSeen;
        } else {
            data.users.push(user);
        }
        await writeData(data);
        return res.json({ ok: true, user: initData });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ ok: false, error: 'server error' });
    }
});

// Bookings
app.post('/api/book', async (req, res) => {
    try {
        const { name, phone, date, time, type = 'group', note, telegramId } = req.body;
        if (!name || !phone || !date || !time) return res.status(400).json({ ok: false, error: 'missing fields' });
        const data = await readData();
        const booking = {
            id: 'b' + Date.now(),
            name, phone, date, time, type, note: note || '', telegramId: telegramId || null,
            createdAt: new Date().toISOString()
        };
        data.bookings.push(booking);
        await writeData(data);
        return res.json({ ok: true, booking });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ ok: false, error: 'server error' });
    }
});

// Get tracks
app.get('/api/tracks', async (req, res) => {
    const data = await readData();
    res.json({ ok: true, tracks: data.tracks });
});

// Upload track - supports multipart image + JSON fields (points as JSON string)
app.post('/api/tracks', upload.single('image'), async (req, res) => {
    try {
        const { name = 'Без названия', grade = '5a', gym = '', city = '', country = '', author = 'Аноним', points } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : (req.body.imageUrl || '');
        const data = await readData();
        const track = {
            id: 't' + Date.now(),
            name,
            grade,
            gym,
            city,
            country,
            author,
            points: points ? JSON.parse(points) : [],
            imageUrl,
            createdAt: new Date().toISOString()
        };
        data.tracks.push(track);
        await writeData(data);
        res.json({ ok: true, track });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: 'server error' });
    }
});

// schedule/prices/news
app.get('/api/schedule', async (req, res) => {
    const data = await readData();
    res.json({ ok: true, schedule: data.schedule });
});
app.get('/api/prices', async (req, res) => {
    const data = await readData();
    res.json({ ok: true, prices: data.prices });
});
app.get('/api/news', async (req, res) => {
    const data = await readData();
    res.json({ ok: true, news: data.news });
});

app.get('/api/ping', (req, res) => res.json({ ok: true }));

// SPA fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
    if (!BOT_TOKEN) console.warn('WARNING: BOT_TOKEN env var not set. Telegram auth will fail.');
});