import GatherList from "../components/gathers/GatherList";

const Home = () => {
  class Page {
    description = `This a valorant community`;
    h1 = "Welcome to Valorant Israel";
    h2 = `Players`;
    image = "./images/bgHome.jpg";
  }
  const page = new Page();

  return (
    <>
      <div className="home-container card shadow p-3 mb-5 bg-dark rounded p-4 text-center home-container w-100">
        <h1>{page.h1}</h1>
        <p> {page.description} </p>
        <h2> {page.h2} </h2>
        <img style={{ width: "80%" }} src={page.image} alt="" />
      </div>
      <div className="home-container card shadow p-3 mb-5 bg-dark rounded p-4 text-center home-container w-100">
        <GatherList />
      </div>
    </>
  );
};

export default Home;
