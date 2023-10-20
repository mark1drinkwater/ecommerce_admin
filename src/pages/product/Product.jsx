import { Link, useLocation } from "react-router-dom";
import "./product.css";
import Chart from "../../components/chart/Chart";
import { Publish } from "@material-ui/icons";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { userRequest } from "../../requestMethods";
import { getProducts, updateProduct } from "../../redux/apiCalls";
import { useDispatch } from 'react-redux';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebase';

export default function Product() {
  const location = useLocation();
  const productId = location.pathname.split("/")[2];
  const [pStats, setPStats] = useState([]);

  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState();
  const [uploadStatus, setUploadStatus] = useState("");
  const [product, setProduct] = useState();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setInputs(prev => {
      return { ...inputs, [e.target.name]: e.target.value }
    });
  }

  useEffect( async () => {
    const users = (await userRequest.get("/products?category=all")).data;

    const userTemp = users.find((product) => product._id === productId);
    setProduct(userTemp);
  }, [dispatch]);

  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await userRequest.get("orders/income?pid=" + productId);
        const list = res.data.sort((a, b) => {
          return a._id - b._id
        })
        list.map((item) =>
          setPStats((prev) => [
            ...prev,
            { name: MONTHS[item._id - 1], Sales: item.total },
          ])
        );
      } catch (err) {
        console.log(err);
      }
    };
    getStats();
  }, [productId, MONTHS]);

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
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log('File available at', downloadURL);
          const product = { ...inputs, image: downloadURL, inStock: inputs.inStock === "true", categories: category };
          await updateProduct(productId, product, dispatch);
          // FORCE refresh of products list stored in redux
          await getProducts(dispatch);
          // Re-direct user back to products page
          window.location.href = ("/products");
        });
      }
    );
  }

  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Product</h1>
        <Link to="/newproduct">
          <button className="productAddButton">Create</button>
        </Link>
      </div>
      <div className="productTop">
        <div className="productTopLeft">
          <Chart data={pStats} dataKey="Sales" title="Sales Performance" />
        </div>
        <div className="productTopRight">
          <div className="productInfoTop">
            <img src={product?.image} alt="" className="productInfoImg" />
            <span className="productName">{product?.title}</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">id:</span>
              <span className="productInfoValue">{product?._id}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">sales:</span>
              <span className="productInfoValue">5123</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">in stock:</span>
              <span className="productInfoValue">{product?.inStock ? "Yes" : "No"}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
        <form className="productForm">
          <div className="productFormLeft">
            <label>Product Name</label>
            <input type="text" placeholder={product?.title} name="title" onChange={handleChange} />
            <label>Product Description</label>
            <input type="text" placeholder={product?.description} name="description" onChange={handleChange} />
            <label>Price</label>
            <input type="text" placeholder={product?.price} name="price" onChange={handleChange} />
            <div className="addProductItem">
              <label>Category</label>
              <input name="category" type="text" placeholder={product?.categories?.toString()} onChange={handleCategories} />
            </div>
            <label>In Stock</label>
            <select name="inStock" id="idStock" defaultValue={product?.inStock} onChange={handleChange} >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="productFormRight">
            <div className="productUpload">
              <img src={product?.image} alt="" className="productUploadImg" />
              <label for="file">
                <Publish />
              </label>
              <input type="file" id="file" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
            </div>
            <button className="productButton" onClick={handleClick}>Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}