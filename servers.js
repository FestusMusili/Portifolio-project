const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const mime = require('mime');

const uri = "mongodb+srv://salaaron2:sala4492@denis.kbbmsou.mongodb.net/dbname?retryWrites=true&w=majority";



app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public/admin/'));


// Middleware to set the correcst MIME type for static files
app.use((req, res, next) => {
  const filePath = req.url.split('?')[0]; // Remove query parameters from URL
  const mimeType = mime.getType(filePath);

  if (mimeType) {
    res.set('Content-Type', mimeType);
  }

  next();
});

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost/denis', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) =>
    console.error('Error connecting to MongoDB:', error)
  );
  
// Create a car schema
const carSchema = new mongoose.Schema({
  maker: String,
  model: String,
  year: Number,
  images: [String],
  price: Number,
  category: String,
  shape: String,
  mileage: String,
  engine: String,
  description:String,
});

// Create a car model
const Car = mongoose.model('Car', carSchema);

// Create a storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/admin/uploads'); 
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

// Create the multer middleware using the storage configuration
const upload = multer({ storage: storage });

// Middleware











// Handle PUT request for updating a car
app.put('/cars/:id', upload.array('images'), function (req, res) {
  const carId = req.params.id;
  const { maker, model, year, price, shape, description, engine, category, mileage } = req.body;
  const imagePaths = req.files.map(file => file.path);

  // Find the car by its ID and update the fields
  Car.findByIdAndUpdate(carId, {
    maker,
    model,
    year,
    price,
    shape,
    description,
    engine,
    category,
    mileage,
    images: imagePaths
  }, { new: true })
    .then(updatedCar => {
      if (updatedCar) {
        console.log('Car updated:', updatedCar);
        res.json(updatedCar);
      } else {
        console.error('Car not found');
        res.status(404).json({ error: 'Car not found' });
      }
    })
    .catch(error => {
      console.error('Error updating car:', error);
      res.status(500).json({ error: 'Error updating car' });
    });
});


// Handle GET request for retrieving all cars


// Fetching reviews for admin from the database









// Start the server
app.listen(3005, function () {
  console.log('Server listening on port 3005');
});
