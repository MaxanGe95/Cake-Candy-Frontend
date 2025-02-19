import Button from "./Button";
import Video from "../assets/video.mp4";
import './Start.css'

export default function Start() {
  return (
    <div className="background-video">
      <video autoPlay loop muted>
        <source src={Video} type="video/mp4" />
        <source src={Video} type="video/ogg" />
      </video>
      <div className="content text-white h-screen w-screen flex flex-col justify-end">
        <div className="max-w-lg mx-auto text-center flex flex-col gap-4 mb-5">
          <h2 className="text-4xl">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          </h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio sunt
            nobis, ad, quas quam consequatur sit impedit labore deleniti
            molestiae ut vitae ullam repellat. Ratione, nostrum. Ut excepturi
            praesentium ipsum?
          </p>
          <Button>Discover</Button>
        </div>
      </div>
    </div>
  );
}
