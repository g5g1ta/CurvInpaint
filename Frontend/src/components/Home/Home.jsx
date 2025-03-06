import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from '../../api';
import "../Home/Home.css";
import SearchBar from "../SearchBar/SearchBar";
import { handleSearchData } from "../UserList/UserList";

function Home() {
    let navigate = useNavigate();

    const [image, setImage] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); 
    const [users, setUsers] = useState([]);

    const [currentCategory, setCurrentCategory] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = {
        "inpainting": [
            "https://i.postimg.cc/tTxkF0hZ/Dog-And-ABee.jpg",
            "https://i.postimg.cc/Vs3Qy17T/inpainted-image-8.png"
        ],
        "stable-diffusion": [
            "https://i.postimg.cc/kMKLKJtq/Capture.png",
            "https://i.postimg.cc/j2489jzf/Capture-PNG-3.png"
        ]
    };

  
    const generateMatrixEffect = () => {
        const matrix = document.querySelector(".matrix-rain");
        for (let i = 0; i < 100; i++) {
            let span = document.createElement("span");
            span.innerText = Math.random() > 0.5 ? "1" : "0";
            span.style.left = `${Math.random() * 100}vw`;
            span.style.animationDuration = `${Math.random() * 3 + 2}s`;
            matrix.appendChild(span);
        }
    };

    useEffect(() => {
        generateMatrixEffect();
        
    }, []);

   
    const showImages = (category) => {
        setCurrentCategory(category);
        setCurrentIndex(0);
    };

   
    const prevImage = () => {
        if (currentCategory) {
            setCurrentIndex(
                (prevIndex) =>
                    prevIndex > 0 ? prevIndex - 1 : images[currentCategory].length - 1
            );
        }
    };

    const nextImage = () => {
        if (currentCategory) {
            setCurrentIndex(
                (prevIndex) =>
                    prevIndex < images[currentCategory].length - 1 ? prevIndex + 1 : 0
            );
        }
    };

    const scrollToSection = (sectionId) => {
        document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
        if (sectionId === "stable-diffusion") {
            navigate("/generate");
        }
        if (sectionId === "inpainting") {
            navigate("/inpaint");
        }
    };

    
    const displayedImage = currentCategory ? images[currentCategory][currentIndex] : null;

    const handleInput = async (input) => {
        setSearchQuery(input)
        const response = await api.get(`api/GetUserByName/?username=${input}`)
        navigate('/users', { state: { searchData: response.data } });

    }
    return (
        <div className="home-container">
            {/* Matrix Rain Effect */}
            <div className="matrix-rain" style={{ backgroundColor: "black" }}></div>

            <header>Stable Diffusion & Inpainting</header>

            {/* Search bar */}
            <div className="search-bar">
                <SearchBar onSave = {handleInput}></SearchBar>
            </div>

            <div className="nav-buttons">
                <button onClick={() => scrollToSection("stable-diffusion")}>
                    Try Stable Diffusion
                </button>
                <button onClick={() => scrollToSection("inpainting")}>
                    Try Inpainting
                </button>
            </div>

            <div className="info-section" id="stable-diffusion">
                <h2>What is Stable Diffusion?</h2>
                <p>
                    Stable Diffusion is a cutting-edge AI model designed for generating high-quality images from text descriptions. It operates
                    using a diffusion-based process, where an image starts as random noise and is gradually refined into a coherent picture based
                    on the given prompt. Unlike traditional generative models, Stable Diffusion is highly efficient and can run on consumer-grade
                    GPUs, making it accessible to a wider audience. It supports various applications, including art generation, photorealistic
                    rendering, and creative design. Additionally, its open-source nature allows developers to fine-tune the model for specific
                    tasks, leading to continuous advancements in AI-driven image creation.
                </p>
            </div>

            <div className="info-section" id="inpainting">
                <h2>What is Inpainting?</h2>
                <p>
                    Inpainting is an advanced AI-powered image editing technique that reconstructs missing or unwanted parts of an image with
                    remarkable accuracy. Using deep learning algorithms, inpainting analyzes the surrounding pixels to generate realistic
                    replacements, seamlessly blending them into the original image. This technology is widely used for tasks such as removing
                    unwanted objects, restoring old or damaged photos, and editing images without leaving visible traces. Inpainting is
                    particularly useful for creative and professional applications, enabling artists, designers, and photographers to enhance
                    visuals effortlessly. By leveraging AI, inpainting offers a powerful tool for content restoration and digital image
                    manipulation.
                </p>
            </div>

            <div className="main-container">
        <div className="sidebar">
          <button onClick={() => showImages('inpainting')}>Inpainting</button>
          <button onClick={() => showImages('stable-diffusion')}>Stable Diffusion</button>
          <button
            id="go-button"
            className="go-button"
            onClick={() => alert(`${currentCategory} functionality goes here`)}
          >
            Go
          </button>
        </div>

        <div className="image-container1" id="image-container1" style={{ display: currentCategory ? 'flex' : 'none' }}>
          <button className="arrow left" onClick={prevImage}>
            &#9665;
          </button>
          {/* Ensure displayedImage exists before rendering */}
          {displayedImage ? (
            <img id="displayed-image" src={displayedImage} alt="Displayed Image" />
          ) : (
            <p>No images available</p> // Fallback text if no image
          )}
          <button className="arrow right" onClick={nextImage}>
            &#9655;
          </button>
        </div>
            </div>
        </div>
    );
}

export default Home;
