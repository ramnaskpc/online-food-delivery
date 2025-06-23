import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDeleteForever } from 'react-icons/md';
import { toast } from 'react-toastify';
import { backendUrl } from '../../App';
import './List.css';

const List = ({ token }) => {
  const [list, setList] = useState([]);

 const fetchList = async () => {
  try {
    const response = await axios.get(backendUrl + '/api/product/list', {
      headers: {token}
    });

    if (response.data.success) {
      setList(response.data.products);
      console.log("Product list fetched:", response.data.products);
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.log(error)
    toast.error(response.data.message);
  }
};

useEffect(()=>{
    fetchList()
},[])

  
   const removeProduct = async (_id) => {
  try {
    const response = await axios.post(backendUrl +'/api/product/remove/',{_id}, {
      headers: {token},
    });

    if (response.data.success) {
      toast.success(response.data.message);
      console.log(response.data.message);
      await fetchList();
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};



  

  useEffect(() => {
    fetchList();
  },[]);

  return (
    <div>
      <p className='product-title'>Product List</p>
      <div className='product-list-container'>
        <div className='product-table-title'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='action-title'>Action</b>
        </div>

       {list.length === 0 ? (
  <p style={{ textAlign: 'center', marginTop: '1rem' }}>No products found.</p>
) : (
  list.map((item, index) => (
    <div key={index} className='product-row'>
      <img
        src={item.image}
        alt={item.name}
        className='product-image'
      />
      <p>{item.name}</p>
      <p>{item.category}</p>
      <p>₹{item.price}</p>
      <MdDeleteForever
        className='product-action'
        onClick={() => removeProduct(item._id)}
        title="Delete Product"
      />
    </div>
  ))
)}

      </div>
    </div>
  );
};

export default List;
