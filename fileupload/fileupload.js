// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage: storage });
// app.post('/upload', upload.single('image'), (req, res) => {
//     if (req.file) {
//         res.json({ imageUrl: `http://localhost:5000/uploads/${req.file.filename}` });
//     } else {
//         res.status(400).json({ error: 'No file uploaded' });
//     }
// });
