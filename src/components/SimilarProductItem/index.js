import './index.css'

const SimilarProductItem = props => {
  const {details} = props
  const {imageUrl, title, brand, price, rating} = details

  return (
    <li className="similar-product-list">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-img"
      />
      <p className="similar-title">{title}</p>
      <p className="similar-brand">by {brand}</p>
      <div className="similar-price-rating">
        <div>
          <p className="similar-price">Rs {price}/-</p>
        </div>
        <div className="similar-rating-container">
          <p className="similar-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-img"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
