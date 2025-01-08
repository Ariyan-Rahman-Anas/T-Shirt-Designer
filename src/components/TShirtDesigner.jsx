import { useState, useRef } from "react";
import tShirt from "./../assets/TShirt.png";
import tShirtLogo from "./../assets/logo.png";

const TShirtDesigner = () => {
    const [logo, setLogo] = useState(tShirtLogo);
    const [position, setPosition] = useState({ x: 75, y: 105 });
    const [size, setSize] = useState(60);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setLogo(imageUrl);
        }
    };

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setPosition({ x, y });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleResize = (delta) => {
        setSize((prevSize) => Math.max(50, prevSize + delta));
    };

    return (
        <div
            className="p-6 flex flex-col items-center"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div className="flex flex-col md:flex-row items-end gap-4 ">
                {/* T-Shirt Designer */}
                <div
                    ref={containerRef}
                    className="relative w-[300px] h-[400px] bg-gray-300 rounded-lg overflow-hidden shadow-lg"
                    style={{
                        backgroundImage: `url(${tShirt})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    {/* Logo */}
                    {logo && (
                        <div
                            className="absolute"
                            style={{
                                top: `${position.y}px`,
                                left: `${position.x}px`,
                                width: `${size}px`,
                                height: "auto",
                                cursor: "move",
                            }}
                            onMouseDown={handleMouseDown}
                        >
                            <img
                                src={logo}
                                alt="Uploaded Logo"
                                className="w-full h-auto"
                                draggable="false"
                            />
                        </div>
                    )}
                </div>
                {/* Upload Logo */}
                <div className="border border-blue-500 rounded-lg">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                    />
                </div>
            </div>

            {/* Controls */}
            {logo && (
                <div className="mt-4 flex items-center gap-4">
                    <button
                        onClick={() => handleResize(10)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Increase Size
                    </button>
                    <button
                        onClick={() => handleResize(-10)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Decrease Size
                    </button>
                </div>
            )}
        </div>
    );
};

export default TShirtDesigner;