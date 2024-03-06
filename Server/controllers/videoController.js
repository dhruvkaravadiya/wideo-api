const Video = require("../models/Video");
const User = require("../models/User");
const cloudinary = require("cloudinary");

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//get video
async function getVideo(req, res) {
  const video = await Video.findById(req.params.id);
  res.status(200).send(video);
}

//upload a video
async function addVideo(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: "Authorization failed" });
  }
  console.log("Add video method called");
  if (!req.files || !req.files.photo || !req.files.video) {
    return res
      .status(400)
      .json({ error: "Both image and video files are required." });
  }

  const filephoto = req.files.photo;
  const filevideo = req.files.video;
  console.log("Files got from local");
  try {
    const photoresult = await cloudinary.v2.uploader.upload(
      filephoto.tempFilePath,
      {
        folder: "WIDEO_IMAGES",
        width: 150,
        public_id: "WIDEO/Images/" + filephoto.name,
        resource_type: "image",
      }
    );
      console.log("Photo uploaded to cloudinary");
    const videoresult = await cloudinary.v2.uploader.upload(
      filevideo.tempFilePath,
      {
        resource_type: "video",
        public_id: "WIDEO/Videos/" + filevideo.name,
        chunk_size: 6000000,
        eager: [
          { width: 1280, height: 720, crop: "pad" },
          { width: 160, height: 100, crop: "crop", gravity: "south" },
        ],
        eager_async: true,
        eager_notification_url: "https://wideo-client.vercel.app/",
      }
    );
            console.log("Video uploaded to cloudinary");

    const newVideo = new Video({
      user: {
        id: req.user.id,
        name: req.user.name,
      },
      title: req.body.title,
      description: req.body.description,
      imgUrl: photoresult.secure_url,
      videoUrl: videoresult.secure_url,
    });
    
    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error saving video" });
  }
}

//edit video
async function editVideo(req, res) {
  console.log(req.user.id);
  const video = await Video.findById(req.params.id);
  if (!video) {
    return res.status(404).send("Video Not Found");
  }
  console.log(video.user.id);

  if (video.user.id == req.user.id) {
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).send(updatedVideo);
  } else {
    return res.status(403).send("You can update only your video");
  }
}

//delete video
async function deleteVideo(req, res) {
  const video = await Video.findById(req.params.id);
  if (!video) {
    return res.status(404).send("Video Not Found");
  }
  if (req.user.id == video.user.id) {
    await Video.findByIdAndDelete(req.params.id);
    return res.status(200).send("Video has been deleted");
  } else {
    return res.status(403).send("You can delete only your video");
  }
}

//increase view
async function addView(req, res) {
  await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
  res.status(200).send("Video View Increased");
}

//get random videos
async function getRandomVideos(req, res) {
  const randomVideos = await Video.aggregate([{ $sample: { size: 40 } }]);
  res.status(200).send(randomVideos);
}

//get trending videos
async function getTrendingVideos(req, res) {
  const trendingVideos = await Video.find().sort({ views: -1 });
  res.status(200).send(trendingVideos);
}

//get subscribed channel's video
async function getSubscribedVideos(req, res) {
  const user = await User.findById(req.user.id);
  const subscribedChannels = user.subscribedChannels;
  const list = await Promise.all(
    subscribedChannels.map((user) => {
      return Video.find({ userId: user.id });
    })
  );
  res.status(200).send(list.flat().sort((a, b) => b.createdAt - a.createdAt));
}

//get video by title
async function searchVideosByTitle(req, res) {
  const results = req.query.search_query;
  const videos = await Video.find({
    title: {
      $regex: results,
      $options: "i",
    },
  });
  res.send(videos);
}

//get video by tag
async function getVideosByTags(req, res) {
  const tags = req.query.tags.split(",");
  const videos = await Video.find({ tags: { $in: tags } }).limit(20);
  res.send(videos);
}

//get video by ID (Remove this function, just used for debuggin the original functions)
async function getVideosByUserID(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userVideoIds = user.videos;
    const userVideos = await Video.find({ _id: { $in: userVideoIds } });
    res.status(200).json(userVideos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

//like a video
async function like(req, res) {
  const id = req.user.id;
  if (!id) {
    return res.status(400).send("Id not given");
  }
  const videoId = req.params.id;
  if (!videoId) {
    return res.status(400).send("Video ID missing");
  }
  await Video.findByIdAndUpdate(videoId, {
    $addToSet: { likes: id },
    $pull: { dislikes: id },
  });
  res.status(200).send("Liked the Video");
}

//remove a like
async function removeLike(req,res){
  const userId = req.user.id;
  if(!userId){
    return res.status(400).send("Id not given");
  }
  const videoId = req.params.id;
  if(!videoId){
    return res.status(400).send("Video Id missing");
  }
  await Video.findByIdAndUpdate(
    { _id: videoId },
    { $pull: { likes: userId } },
    { new: true }
  );
  return res.status(200).send("Like Removed");
}

//remove a dislike
async function removeDislike(req,res){
  const userId = req.user.id;
  if(!userId){
    return res.status(400).send("Id not given");
  }
  const videoId = req.params.id;
  if(!videoId){
    return res.status(400).send("Video Id missing");
  }
  await Video.findByIdAndUpdate(
    { _id: videoId },
    { $pull: { dislikes: userId } },
    { new: true }
  );
  return res.status(200).send("Dislike Removed");
}

//dislike a video
async function dislike(req, res) {
  const id = req.user.id;
  if (!id) {
    return res.status(400).send("Id not given");
  }
  const videoId = req.params.id;
  if (!videoId) {
    return res.status(400).send("Video ID missing");
  }
  await Video.findByIdAndUpdate(videoId, {
    $addToSet: { dislikes: id },
    $pull: { likes: id },
  });
  res.status(200).send("DisLiked the Video");
}
module.exports = {
  addVideo,
  editVideo,
  deleteVideo,
  getVideo,
  addView,
  getTrendingVideos,
  getRandomVideos,
  getSubscribedVideos,
  searchVideosByTitle,
  getVideosByTags,
  getVideosByUserID,
  like,
  removeLike,
  removeDislike,
  dislike,
};
