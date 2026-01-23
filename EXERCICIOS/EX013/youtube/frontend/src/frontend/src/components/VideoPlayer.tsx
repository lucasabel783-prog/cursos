export function VideoPlayer({ src }: { src: string }) {
  return (
    <video controls autoPlay>
      <source src={src} type="video/mp4" />
    </video>
  );
}