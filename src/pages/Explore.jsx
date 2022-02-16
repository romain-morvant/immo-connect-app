import { Link } from "react-router-dom";
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'

function Explore() {
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Quel type de bien recherchez vous ?</p>
      </header>
      <main>
        {/* Slider */}
        <p className="exploreCategoryHeading">Categories</p>
        <div className="exploreCategories">
          <Link to={'/category/rent'}>
            <img src={rentCategoryImage}
              alt="Biens en location"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">Biens en location</p>
          </Link>
          <Link to={'/category/sale'}>
            <img src={sellCategoryImage}
              alt="Biens en vente"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">Biens en vente</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Explore;
