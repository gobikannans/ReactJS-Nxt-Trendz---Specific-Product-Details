import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productItemData: [],
    similarProductData: [],
    count: 1,
  }

  componentDidMount() {
    this.getProductData()
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    style: data.style,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = this.getFormattedData(data)
      const similarProductsDetails = data.similar_products.map(eachProduct =>
        this.getFormattedData(eachProduct),
      )
      console.log(updatedData)
      console.log(similarProductsDetails)
      this.setState({
        productItemData: updatedData,
        similarProductData: similarProductsDetails,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onIncrement = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  onDecrement = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  similarProductItem = () => {
    const {similarProductData} = this.state

    return (
      <div className="similar-product-container">
        <h1 className="similar-product-heading">Similar Products</h1>
        <ul className="similar-product-list-container">
          {similarProductData.map(eachProduct => (
            <SimilarProductItem details={eachProduct} key={eachProduct.id} />
          ))}
        </ul>
      </div>
    )
  }

  productItem = () => {
    const {productItemData, count} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productItemData

    return (
      <>
        <div className="product-data-container">
          <img src={imageUrl} alt="product" className="product-details-img" />
          <div className="products-details">
            <h1 className="product-title">{title}</h1>
            <p className="price-detail-price">Rs {price}/-</p>
            <div className="rating-reviews">
              <div className="rating-detail-container">
                <p className="rating-detail">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-img"
                />
              </div>
              <p>{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <p className="product-description">
              <span className="span-el">Available: </span>
              {availability}
            </p>
            <p className="product-description">
              <span className="span-el">Brand: </span>
              {brand}
            </p>
            <hr className="product-hr-line" />
            <div className="button-container">
              <button
                type="button"
                className="product-btn-style"
                onClick={this.onDecrement}
                testid="minus"
              >
                <BsDashSquare className="btn-icon" />
              </button>
              <p className="product-description">{count}</p>
              <button
                type="button"
                className="product-btn-style"
                onClick={this.onIncrement}
                testid="plus"
              >
                <BsPlusSquare className="btn-icon" />
              </button>
            </div>
            <button type="button" className="product-cart-btn-style">
              ADD TO CART
            </button>
          </div>
        </div>
        {this.similarProductItem()}
      </>
    )
  }

  renderProductLoaderView = () => (
    <div testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderProductFailureView = () => (
    <div className="product-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="product-failure-error-img"
      />
      <h1 className="product-failure-error-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="failure-error-btn-style">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderProductDetailView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.productItem()
      case apiStatusConstants.failure:
        return this.renderProductFailureView()
      case apiStatusConstants.inProgress:
        return this.renderProductLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="product-detail-bg-container">
          {this.renderProductDetailView()}
        </div>
      </div>
    )
  }
}

export default ProductItemDetails
