import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Contact = () => {
    const [email, setEmail] = useState('');
    const [query, setQuery] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading state

        try {
            const response = await axios.post('http://localhost:3002/queries', { id: email, query });
            if (response.status === 200) {
                setMessage('Your query has been submitted successfully!');
                setEmail('');
                setQuery('');
            }
        } catch (error) {
            console.error('Error submitting query:', error);
            setMessage('There was an error submitting your query. Please try again later.');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="container mt-3">
            <h2 className="text-center mb-4">Contact Us</h2>
            <p className="lead text-center">Welcome to QuickFeast, where your culinary delight is our top priority.</p>
            {/* Add image above the heading */}
        <img 
            src="https://static.vecteezy.com/system/resources/previews/004/942/838/original/technical-support-icon-in-robotic-hand-customer-help-tech-support-customer-service-business-and-technology-concept-illustration-vector.jpg" 
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
            <p className="lead text-center">We look forward to serving you and making your dining experience extraordinary.</p>
            <div className="card p-4 shadow-sm rounded">
                <p><strong>About the Company:</strong> At QuickFeast, we are committed to bringing exceptional meals right to your doorstep. Our unwavering dedication to quality and service ensures that each culinary experience is memorable. With a focus on diverse, gourmet delights tailored to satisfy every palate, we aim to transform every meal into a delightful journey. QuickFeast embodies excellence in food delivery, offering a seamless and delightful dining experience for our customers.</p>
                <p><strong>Company Vision:</strong> Our vision is to become the premier food delivery service by prioritizing quality, convenience, and exceptional customer satisfaction. We strive to elevate each dining experience, delivering gourmet meals that bring joy and delight right to your doorstep. Through innovation and dedication, we aim to set new standards in the food delivery industry, ensuring every meal is a memorable culinary journey.</p>
                <p><strong>Services Provided:</strong> We offer an extensive array of food options, encompassing local delicacies and international cuisines, all meticulously prepared and delivered fresh and hot. Experience the QuickFeast difference with each and every order. Our dedicated support team is always available to assist with any inquiries or issues, ensuring an exceptional dining experience every time.</p>
                <div className="card p-4 shadow-sm rounded">
                    <h4>Contact Details:</h4>
                    <p><strong>Owner/Founder:</strong> Ch Vara Prasad</p>
                    <p><strong>Email:</strong> support@quickfeast.com</p>
                    <p><strong>Phone:</strong> +1234567890</p>
                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Query:</label>
                            <textarea
                                className="form-control"
                                placeholder="What's on your mind today?"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                    {message && <p className="mt-3 alert alert-info">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default Contact;
