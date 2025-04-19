#!/bin/bash

# Create videos directory if it doesn't exist
mkdir -p public/videos

# Download the video using curl
curl -L "https://cdn.pixabay.com/vimeo/328880246/skateboard-25298.mp4" -o "public/videos/skate-video.mp4"

echo "Video downloaded successfully!"
