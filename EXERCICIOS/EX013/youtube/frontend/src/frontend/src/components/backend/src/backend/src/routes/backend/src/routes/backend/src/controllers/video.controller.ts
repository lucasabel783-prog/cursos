export function getVideos(req, res) {
  res.json([
    { id: 1, title: "Meu vídeo", views: 1000 }
  ]);
}