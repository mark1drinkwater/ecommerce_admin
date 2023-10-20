import { useDispatch } from 'react-redux';
import { useState } from 'react';
import "./newProduct.css";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebase';
import { addProduct } from '../../redux/apiCalls';

export default function NewProduct() {
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState();
  const [uploadStatus, setUploadStatus] = useState("");
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setInputs(prev => {
      return { ...inputs, [e.target.name]: e.target.value }
    });
  }

  const handleCategories = (e) => {
    setCategory(e.target.value.split(","));
  }

  const handleClick = (e) => {
    e.preventDefault();
    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);
    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');

        setUploadStatus(` Uploading: ${progress.toFixed(1)}%`)

        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log("Upload failed", error)
        setUploadStatus('Upload failed')
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) =>  {
          console.log('File available at', downloadURL);
          const product = { ...inputs, image: downloadURL, inStock: inputs.inStock === "true", categories: category  };
          await addProduct(product, dispatch);
          window.location.href= ("/products");
        });
      }
    );
  }

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New Product</h1>
      <form className="addProductForm">
        <div className="addProductItem">
          <label id="imageLabel">Image {uploadStatus}</label>
          <input name="image" type="file" id="file" onChange={e => setFile(e.target.files[0])} />
        </div>
        <div className="addProductItem">
          <label>Title</label>
          <input name="title" type="text" placeholder="Title" onChange={handleChange} />
        </div>
        <div className="addProductItem">
          <label>Description</label>
          <input name="description" type="text" placeholder="Description..." onChange={handleChange} />
        </div>
        <div className="addProductItem">
          <label>Price</label>
          <input name="price" type="number" placeholder="100" onChange={handleChange} />
        </div>
        <div className="addProductItem">
          <label>Category</label>
          <input name="category" type="text" placeholder="jeans,skirts" onChange={handleCategories} />
        </div>
        <div className="addProductItem">
          <label>Stock</label>
          <select name="inStock" onChange={handleChange}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <button onClick={handleClick} className="addProductButton">Create</button>
      </form>
    </div>
  );
}
