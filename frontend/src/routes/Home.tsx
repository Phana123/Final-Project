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
      <h1>{page.h1}</h1>
      <p> {page.description} </p>
      <h2> {page.h2} </h2>
      <img style={{ width: "80%" }} src={page.image} alt="" />
    </>
  );
};

export default Home;
