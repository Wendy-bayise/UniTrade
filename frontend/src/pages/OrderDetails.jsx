import './OrderDetails.css'
import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import WirelessHeadphones from '../assets/Wireless Headphones.png'
import MechanicalKeyboard from '../assets/Mechanical Keyboard.png'

function OrderDetails() {
  const { id } = useParams()

  return (
    <div className="order-order-page">
      <Link to="/cart" className="order-back-link">← Back to My Orders</Link>

      <div className="order-order-header">
        <div>
          <h1>Order #{id || 'UT-2026-00123'} <span className="order-badge">Meetup Pending</span></h1>
          <p className="order-order-date">Placed on 14 August 2026 at 10:30 AM</p>
        </div>
        <div className="order-header-btns">
        </div>
      </div>

      <div className="order-card">
        <h2>Order Status</h2>
        <div className="order-timeline">
          <div className="order-step order-done">
            <div className="order-circle">✓</div>
            <p><b>Order Placed</b><br/>14 Aug, 10:30 AM</p>
          </div>
          <div className="order-line order-done"></div>
          <div className="order-step order-done">
            <div className="order-circle">✓</div>
            <p><b>Accepted</b><br/>14 Aug, 12:15 PM</p>
          </div>
          <div className="order-line order-done"></div>
          <div className="order-step order-done">
            <div className="order-circle">✓</div>
            <p><b>Meetup Arranged</b><br/>14 Aug, 02:40 PM</p>
          </div>
          <div className="order-line"></div>
          <div className="order-step">
            <div className="order-circle"></div>
            <p><b>Delivered</b><br/>Pending</p>
          </div>
        </div>
        <div className="order-info-banner">
           Next step: Arrange a meetup with the seller to collect your items. <br/>
        </div>
      </div>

      <div className="order-grid">
        <div>
          <div className="order-card">
            <h2>Items in this order (2)</h2>
            <div className="order-item">
              <img src={WirelessHeadphones} alt="Wireless Headphones" />
              <div className="order-item-info">
                <p className="order-item-name">Wireless Headphones</p>
                <p className="order-item-sub">Sold by Thabo M • Condition: Like New</p>
                <Link to="/messages" className="order-msg-btn"> Message Seller</Link>
              </div>
              <div className="order-item-price">R250.00</div>
            </div>
            <div className="order-item">
              <img src={MechanicalKeyboard} alt="Mechanical Keyboard" />
              <div className="order-item-info">
                <p className="order-item-name">Mechanical Keyboard</p>
                <p className="order-item-sub">Sold by Thabo M • Condition: Used</p>
                <Link to="/messages" className="order-msg-btn"> Message Seller</Link>
              </div>
              <div className="order-item-price">R200.00</div>
            </div>
            <div className="order-safe-banner">
             Shopping on UniTrade is safe <br/>
              <span>Your payment is secure and we’ll only release it to the seller once you receive your item.</span>
            </div>
          </div>
        </div>

        <div>
          <div className="order-card">
            <h3>Order Summary</h3>
            <div className="order-summary-row"><span>Subtotal (2 items)</span><span>R450.00</span></div>
            <div className="order-summary-row"><span>Delivery Fee</span><span>FREE</span></div>
            <div className="order-summary-total"><span>Total</span><span>R450.00</span></div>
          </div>

          <div className="order-card">
            <h3> Meetup Details</h3>
            <p><b>Campus Pickup</b></p>
            <p>District Six Campus<br/>Student Centre - Collection Point<br/>Cape Town, 8000</p>
            <button className="order-btn-outline-small">Change Pickup Details</button>
          </div>

          <div className="order-card">
            <h3>Payment Information</h3>
            <div className="order-pay-row"><span>Payment Method</span><span>EFT</span></div>
            <div className="order-pay-row"><span>Payment Status</span><span>Paid ✓</span></div>
            <div className="order-pay-row"><span>Payment Date</span><span>14 August 2026 at 10:30 AM</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails