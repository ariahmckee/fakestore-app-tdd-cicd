import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import ProductCatalog from "../components/ProductCatalog";

function Home() {
  const [showCatalog, setShowCatalog] = useState(false);

  useEffect(() => {
    const resetHome = () => setShowCatalog(false);

    window.addEventListener("reset-home", resetHome);

    return () => window.removeEventListener("reset-home", resetHome);
  }, []);

  return (
    <>
      <div className="hero-container text-center text-white">
        <div className="hero-overlay">
          <h1>Welcome to FakeStore</h1>
          <p>Handcrafted goods, curated just for you</p>

          {!showCatalog && (
            <Button onClick={() => setShowCatalog(true)}>Shop Now</Button>
          )}
        </div>
      </div>

      {showCatalog && <ProductCatalog />}
    </>
  );
}

export default Home;
