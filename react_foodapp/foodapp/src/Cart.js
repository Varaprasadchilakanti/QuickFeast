import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Cart({ items, cart, setCart }) {
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(''); // Start with no default value
  const [orderPlaced, setOrderPlaced] = useState(false);

  const totalBill = Object.keys(cart).reduce((total, itemId) => {
    const item = items.find(item => item.id === Number(itemId));
    return total + (item.price * cart[itemId]);
  }, 0);
  const maintenanceCharge = 1;
  const gst = 0.05 * totalBill;
  const finalTotal = totalBill + maintenanceCharge + gst;

  const handleOrderPlacement = () => {

    if (totalBill === 0) {
        alert("Please select at least one item to place the order.");
        return;
    }

    if (!address.trim()) {
      alert("Please enter a delivery address.");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    // Logic to place order can go here
     // Display alert and set orderPlaced to true
    alert("Order Successfully Placed!");
    setOrderPlaced(true);
   
    // Optionally reset the cart and address if needed
    setCart({});
    setAddress('');
    setPaymentMethod(''); // Reset payment method to default

    // Make the success message disappear after 5 seconds
    setTimeout(() => {
        setOrderPlaced(false);
      }, 5000); // 5 seconds
  };

  return (
    <div className="container mt-3"> {/* Reduced top margin */}
    {/* Welcome Note */}
    <h3 className="text-center mb-4">Welcome to Your Cart!</h3> {/* Adjusted bottom margin */}
    
    {/* Add image above the heading */}
        <img 
            src="https://edeliveryapp.com/wp-content/uploads/2021/12/factors-which-influence-the-consumer-to-use-an-online-food-delivery-system.jpg" 
            alt="Food Delivery Service" 
            className="w-100 mx-auto d-block"  // Full width, centered
            style={{ 
                width: '100%', 
                height: 'auto', 
                objectFit: 'cover', 
                borderRadius: '45px', 
                paddingBottom: '15px'  // Add padding only below the image
            }}
        />
      <div className="card p-4 shadow-sm rounded">
        <div className="row">
          {/* Selected Items section with card styling */}
          <div className="col-md-8">
            <div className="card p-3 shadow-sm rounded">
              <h4>Selected Items:</h4>
              <ul className="list-group">
                {Object.keys(cart).map(itemId => {
                  const item = items.find(item => item.id === Number(itemId));
                  return (
                    <li className="list-group-item" key={itemId}>
                      {item.name} - {cart[itemId]} x ${item.price} = ${(item.price * cart[itemId]).toFixed(2)}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Billing Details section with card styling */}
          <div className="col-md-4 mb-4">
            <div className="card p-3 shadow-sm rounded">
              <h4>Billing Details</h4>
              <p>Total: ${totalBill.toFixed(2)}</p>
              <p>Maintenance & Service Charge: ${maintenanceCharge.toFixed(2)}</p>
              <p>GST (5%): ${gst.toFixed(2)}</p>
              <h5>Final Total: ${finalTotal.toFixed(2)}</h5>
              <div className="form-group">
                <label htmlFor="address">Delivery Address:</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                />
              </div>
              <div className="form-group mt-2">
                <label>Payment Method:</label>
                <select
                  className="form-control"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  value={paymentMethod}
                  required
                >
                  <option value="" disabled>Select Payment Method</option>
                  <option value="cod">Cash on Delivery</option>
                  <option value="online">Online Payment</option>
                </select>
              </div>
              <button onClick={handleOrderPlacement} className="btn btn-primary mt-3">Place Order</button>
              {orderPlaced && <div className="alert alert-success mt-3">Order Successfully Placed!</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;