import React, { useState } from 'react';
import upload_img from "../../assets/upload_img.png";
import "./Add.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";
import { backendUrl } from "../../App";

const Add = ({ token }) => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("All");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      if (image) formData.append("image", image);

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Product added successfully!");
        setName("");
        setDescription("");
        setPrice("");
        setImage(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='form-container'>
      <div>
        <p className='form-label'>Upload Image</p>
        <div className='image_upload_container'>
          <label htmlFor='image'>
            <img src={!image ? upload_img : URL.createObjectURL(image)} alt="" className='img-preview' />
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden />
          </label>
        </div>

        <div className="form-group">
          <p className="form-label">Product Name</p>
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='form-input' placeholder='Enter Product Name' required />
        </div>
      </div>

      <div className="form-group">
        <p className="form-label">Product Description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='form-input' placeholder='Type Product Description' required></textarea>
      </div>

      <div className="form-group-horizontal">
        <div>
          <p className="form-label">Product Category</p>
          <select onChange={(e) => setCategory(e.target.value)} value={category} className='form-select'>
            <option value="All">All</option>
            <option value="Ice cream">Ice cream</option>
            <option value="Pizza">Pizza</option>
            <option value="Rice">Rice</option>
            <option value="Chicken">Chicken</option>
            <option value="Noodles">Noodles</option>
            <option value="Pasta">Pasta</option>
            <option value="Drinks">Drinks</option>
          </select>
        </div>

        <div>
          <p className="form-label">Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} type="number" placeholder='30' className='form-input price-input' />
        </div>
      </div>

      <button type='submit' className='submit-btn'>ADD PRODUCT</button>
    </form>
  );
};

export default Add;
