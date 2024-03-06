// Import the Cloudinary library and the 'dotenv' module for environment variables
const cloudinary = require('cloudinary').v2;
const path = require('path');
require('dotenv').config({path : path.resolve(__dirname , '..' , '.env')});
// Configure the Cloudinary SDK with your Cloudinary credentials
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});
// // Define an async function to upload a video to Cloudinary
// async function uploadVideo(videoPath, options) {
//   return new Promise((resolve, reject) => {
//     // Use the Cloudinary uploader method to upload the video
//     cloudinary.uploader.upload(videoPath, options, (error, result) => {
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
// // Usage example:
// const video = 'FORYOU.mp4';
// (async () => {
//   try {
//     // Define the options object with various upload parameters
//     const options = {
//       resource_type: "video", 
//       public_id: "myfolder/mysubfolder/dog_closeup",
//       chunk_size: 6000000,
//       eager: [
//         { width: 1280, height: 720, crop: "pad" },
//         { width: 160, height: 100, crop: "crop", gravity: "south" },
//       ],
//       eager_async: true,
//       eager_notification_url: "https://mysite.example.com/notify_endpoint",
//     };

//     // Call the uploadVideo function and wait for the result using 'await'
//     const result = await uploadVideo(video, options);
//     console.log(result);
//     // You can use 'result' data here or return it, depending on your use case.
//   } catch (error) {
//     console.error('Error uploading video:', error);
//   }
// })();
// const video1 = 'bell.mp4';
// cloudinary.uploader.upload(video1, { 
//   resource_type: "video", 
//   public_id: "WIDEO/Videos/bell",
//   chunk_size: 6000000,
//   eager: [
//     { width: 1280, height: 720, crop: "pad" },
//     { width: 160, height: 100, crop: "crop", gravity: "south" },
//   ],
//   eager_async: true,
//   eager_notification_url: "https://wideo-app.netlify.com/videos",
// })
// .then(result => console.log(result))
// .catch(error => console.error(error));
// const video2 = 'C in 100 Seconds.mp4';
// cloudinary.uploader.upload(video2, { 
//   resource_type: "video", 
//   public_id: "WIDEO/Videos/C in 100 Seconds",
//   chunk_size: 6000000,
//   eager: [
//     { width: 1280, height: 720, crop: "pad" },
//     { width: 160, height: 100, crop: "crop", gravity: "south" },
//   ],
//   eager_async: true,
//   eager_notification_url: "https://wideo-app.netlify.com/videos",
// })
// .then(result => console.log(result))
// .catch(error => console.error(error));
// const video3 = 'Cars Movie Edit.mp4';
// cloudinary.uploader.upload(video3, { 
//   resource_type: "video", 
//   public_id: "WIDEO/Videos/Cars Movie Edit",
//   chunk_size: 6000000,
//   eager: [
//     { width: 1280, height: 720, crop: "pad" },
//     { width: 160, height: 100, crop: "crop", gravity: "south" },
//   ],
//   eager_async: true,
//   eager_notification_url: "https://wideo-app.netlify.com/videos",
// })
// .then(result => console.log(result))
// .catch(error => console.error(error));
const video4 = 'Flying A Plane Through Tunnels World First.mp4';
cloudinary.uploader.upload(video4, { 
  resource_type: "video", 
  public_id: "WIDEO/Videos/Flying A Plane Through Tunnels World First",
  chunk_size: 6000000,
  eager: [
    { width: 1280, height: 720, crop: "pad" },
    { width: 160, height: 100, crop: "crop", gravity: "south" },
  ],
  eager_async: true,
  eager_notification_url: "https://wideo-app.netlify.com/videos",
})
.then(result => console.log(result))
.catch(error => console.error(error));

// const video5 = 'Peaceful.mp4';
// cloudinary.uploader.upload(video4, { 
//   resource_type: "video", 
//   public_id: "WIDEO/Videos/Peaceful",
//   chunk_size: 6000000,
//   eager: [
//     { width: 1280, height: 720, crop: "pad" },
//     { width: 160, height: 100, crop: "crop", gravity: "south" },
//   ],
//   eager_async: true,
//   eager_notification_url: "https://wideo-app.netlify.com/videos",
// })
// .then(result => console.log(result))
// .catch(error => console.error(error));

// const video6 = 'Red Car.mp4';
// cloudinary.uploader.upload(video4, { 
//   resource_type: "video", 
//   public_id: "WIDEO/Videos/Red Car",
//   chunk_size: 6000000,
//   eager: [
//     { width: 1280, height: 720, crop: "pad" },
//     { width: 160, height: 100, crop: "crop", gravity: "south" },
//   ],
//   eager_async: true,
//   eager_notification_url: "https://wideo-app.netlify.com/videos",
// })
// .then(result => console.log(result))
// .catch(error => console.error(error));