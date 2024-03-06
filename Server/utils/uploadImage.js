const cloudinary = require('cloudinary').v2;
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
// Configure the Cloudinary SDK with your Cloudinary credentials
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// // Define an async function to upload an image to Cloudinary
// async function uploadImage(imagePath, publicId) {
//   return new Promise((resolve, reject) => {
//     // Use the Cloudinary uploader method to upload the image
//     cloudinary.uploader.upload(imagePath, { public_id: publicId }, (error, result) => {
//       // The callback function handles the response from Cloudinary
//       if (error) {
//         // If there's an error during the upload, reject the promise with the error
//         reject(error);
//       } else {
//         // If the upload is successful, resolve the promise with the result data
//         resolve(result);
//       }
//     });
//   });
// }
// // Usage :
// const image = './background.jpg';
// const publicId = 'background';

// (async () => {
//   try {
//     // Call the uploadImage function and wait for the result using 'await'
//     const result = await uploadImage(image, publicId);
//     console.log(result);
//     // You can use 'result' data here or return it, depending on your use case.
//   } catch (error) {
//     console.error('Error uploading image:', error);
//   }
// })();

const image1 = 'AsliPunjabi.png';
cloudinary.uploader.upload(image1, { folder:"restaurants", width:250, crop:"scale", public_id: "AsliPunjabi" }, function(error, result) {
  console.log(result);
});

// const image2 = './cars.webp';
// cloudinary.uploader.upload(image2, { public_id: "cars" }, function(error, result) {
//   console.log(result);
// });
// const image3 = 'aeroplane.png';
// cloudinary.uploader.upload(image3, { public_id: "Aeroplane" }, function(error, result) {
//   console.log(result);
// });
// const image4 = './redcar.png';
// cloudinary.uploader.upload(image4, { public_id: "redcar" }, function(error, result) {
//   console.log(result);
// });
// const image5 = './peaceful.png';
// cloudinary.uploader.upload(image4, { public_id: "peacefulsound" }, function(error, result) {
//   console.log(result);
// });
// const image6 = './bell.png';
// cloudinary.uploader.upload(image4, { public_id: "bell" }, function(error, result) {
//   console.log(result);
// });