import { useEffect } from "react"
import { Link } from "react-router-dom"

export default function Home() {
  useEffect(() => {
    document.title = "eCommerce | Home"
  }, []);
  
  return (
    <>
      <div>Home</div>
      <div className="hero">
        <h1>Discover the latest</h1>
        <h2>Lorem ipsum dolor sit amet, consectetur adipiscing</h2>
        <div className="hero-buttons">
          <Link to="/products"><button>Shop Now</button></Link>
          <Link to="/categories"><button className="button-secondary">Categories</button></Link>
        </div>
      </div>
      <div className="featured">
          <div className="section-title">
            <h2>Featured Products</h2>
            <p>Discover apparel from a wide variety of brands</p>
          </div>
          <div className="featured-products">
            {/* these are samples for testing */}
            <div className="product-card" style={{ width: "300px", height: "400px", backgroundImage: "url('https://placehold.co/300x400')"}}></div>
            <div className="product-card" style={{ width: "300px", height: "400px", backgroundImage: "url('https://placehold.co/300x400')"}}></div>
            <div className="product-card" style={{ width: "300px", height: "400px", backgroundImage: "url('https://placehold.co/300x400')"}}></div>
          </div>
          <Link to="/products"><button>View All Products</button></Link>
      </div>
      <div className="categories">
          <div className="section-title">
            <h2>Shop By Category</h2>
            <p>Browse our collections and find what you're looking for</p>
          </div>
          <div className="category-cards">
            {/* these are samples for testing */}
            <div className="category-card" style={{ width: "300px"}}>
              <img src="https://placehold.co/300x350" alt="Category 1" />
              <div className="category-card-text">
                <h3>Category title here</h3>
                <p>Shop the latest styles in men’s fashion, from casual fits to classic looks.</p>
              </div>
            </div>
            <div className="category-card" style={{ width: "300px"}}>
              <img src="https://placehold.co/300x350" alt="Category 1" />
              <div className="category-card-text">
                <h3>Category title here</h3>
                <p>Shop the latest styles in men’s fashion, from casual fits to classic looks.</p>
              </div>
            </div>
            <div className="category-card" style={{ width: "300px"}}>
              <img src="https://placehold.co/300x350" alt="Category 1" />
              <div className="category-card-text">
                <h3>Category title here</h3>
                <p>Shop the latest styles in men’s fashion, from casual fits to classic looks.</p>
              </div>
            </div>
            <div className="category-card" style={{ width: "300px"}}>
              <img src="https://placehold.co/300x350" alt="Category 1" />
              <div className="category-card-text">
                <h3>Category title here</h3>
                <p>Shop the latest styles in men’s fashion, from casual fits to classic looks.</p>
              </div>
            </div>
          </div>
      </div>
      <div>Footer</div>
    </>
  )
}
