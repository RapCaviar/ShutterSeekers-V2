// Mouse Position Tracker Script (combined with Image handling)
const fileInput = document.getElementById("fileUpload");
const dragDropArea = document.getElementById("dragDropArea");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const moreButton = document.getElementById("moreButton");
const saveButton = document.getElementById("saveButton");
const fname = document.getElementById("fname");
const saveForm = document.getElementById("saveForm");
const savedText = document.getElementById("savedText");

let images = [];
let currentIndex = 0;

// Function to display the current image
const displayImage = (index, isCover = false) => {
    if (images.length === 0) return;

    const file = images[index];
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;

        // Create a canvas to resize the image
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        img.onload = () => {
            // Set canvas dimensions to 1/20th of the original image size
            canvas.width = img.width / 20;
            canvas.height = img.height / 20;

            // Draw the resized image on the canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Create a new image element with the resized image data
            const resizedImg = document.createElement("img");
            resizedImg.src = canvas.toDataURL("image/png");
            resizedImg.style.maxWidth = "100%"; // Ensure it fits within the box
            resizedImg.style.height = "auto";

            // Clear the dragDropArea and only display the current image
            dragDropArea.innerHTML = ""; // Clear previous content
            dragDropArea.appendChild(resizedImg);

            // Add text below the first image
            const text = document.createElement("p");
            text.textContent = isCover ? "This will be your cover" : "";
            dragDropArea.appendChild(text);
        };
    };

    reader.onerror = (err) => {
        console.error("Error reading file:", err);
        alert("An error occurred while reading the file.");
    };

    reader.readAsDataURL(file);
};

// Function to handle file input change
const handleFileInputChange = () => {
    const files = Array.from(fileInput.files);

    if (files.length > 0) {
        images.push(...files); // Add the newly uploaded files to the images array

        displayImage(0, true); // Display the first image as the cover image

        updateNavigationButtons();
    }
};

// Function to update the visibility of navigation buttons
const updateNavigationButtons = () => {
    if (images.length > 1) {
        prevButton.style.display = "block";
        nextButton.style.display = "block";
        moreButton.style.display = "block";
    } else {
        moreButton.style.display = "block";
        prevButton.style.display = "none";
        nextButton.style.display = "none";
    }
};

// Explanation function to handle form submission and save text
const explanation = (event) => {
    event.preventDefault(); 
    var exp = fname.value;
    sessionStorage.setItem("p1_reason", exp);

    const imagePromises = images.map((file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    });

    Promise.all(imagePromises)
        .then((encodedImages) => {
            sessionStorage.setItem("p1_images", JSON.stringify(encodedImages));
            alert(exp);
            savedText.value = exp; // Set the hidden input value
            saveForm.submit(); // Submit the hidden form
        })
        .catch((error) => {
            console.error("Error encoding images:", error);
            alert("An error occurred while processing the images.");
        });
};

saveButton.addEventListener("click", explanation);

// Event listener for file input change
fileInput.addEventListener("change", (event) => {
    event.stopImmediatePropagation(); // Stop the event from being called twice
    handleFileInputChange();
});

// Event listener for drag-and-drop area
dragDropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dragDropArea.classList.add("dragover");
});

dragDropArea.addEventListener("dragleave", () => {
    dragDropArea.classList.remove("dragover");
});

dragDropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dragDropArea.classList.remove("dragover");

    const files = e.dataTransfer.files;
    if (files.length === 0) {
        alert("No files selected.");
        return;
    }

    const imageFiles = Array.from(files).filter(file => file.type.startsWith("image/"));
    if (imageFiles.length === 0) {
        alert("Only image files are allowed.");
        return;
    }

    images.push(...imageFiles); // Add dropped images to the existing array
    displayImage(0, true); // Display the cover image
    updateNavigationButtons(); // Update the buttons after images are added
});

// Event listener for "more" button click to open file input dialog
moreButton.addEventListener("click", (event) => {
    event.stopImmediatePropagation(); // Stop the event from being called twice
    fileInput.click(); // Open file dialog on click
});

// Event listeners for navigation buttons (prev/next)
prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        displayImage(currentIndex);
    }
});

nextButton.addEventListener("click", () => {
    if (currentIndex < images.length - 1) {
        currentIndex++;
        displayImage(currentIndex);
    }
});

// Mouse move event to show coordinates
document.addEventListener('mousemove', function(e) {
    const coordinates = document.getElementById('coordinates');
    coordinates.textContent = `X: ${e.clientX}, Y: ${e.clientY}`;
});

const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resize canvas when window is resized
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let currentCircle = null;

// Click event to create a circle and handle navigation to index.html
canvas.addEventListener('click', function(e) {
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if the click is within the current circle
    if (currentCircle) {
        const dx = x - currentCircle.x;
        const dy = y - currentCircle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If clicked inside the circle, redirect to index.html
        if (distance <= 20) {
            window.location.href = 'index.html';
            return;
        }
    }

    // Clear the previous circle if it exists
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw a new red circle at the mouse click location
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI, true);
    ctx.fillStyle = '#FF0000';
    ctx.fill();
    ctx.closePath();

    // Store the current circle's position
    currentCircle = { x, y };
});
