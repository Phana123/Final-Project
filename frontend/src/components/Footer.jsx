const Footer = () => {
  return (
    <>
      <div className="d-flex align-items-center justify-content-center p-5 bg-dark">
        <footer>
          <br />
          <div className="container">
            <div className="row">
              <div className="col item social">
                <a href="">
                  <img
                    style={{ width: "7%" }}
                    src="./images/svg/discord.svg"
                    alt=""
                  />
                </a>
              </div>
            </div>

            <br />
            <p className="copyright text-white">Copyright @ Madigital © 2023</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Footer;
