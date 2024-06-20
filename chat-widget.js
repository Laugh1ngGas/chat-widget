(function () {
  document.head.insertAdjacentHTML(
    "beforeend",
    '<link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.16/tailwind.min.css" rel="stylesheet">'
  );

  // Inject the CSS
  const style = document.createElement("style");
  style.innerHTML = `
  .hidden {
    display: none;
  }
  #chat-widget-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    flex-direction: column;
  }
  #chat-popup {
    height: 70vh;
    max-height: 70vh;
    transition: all 0.3s;
    overflow: hidden;
  }
  @media (max-width: 768px) {
    #chat-popup {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      max-height: 100%;
      border-radius: 0;
    }
  }
  `;

  document.head.appendChild(style);

  // Chat widget container
  const chatWidgetContainer = document.createElement("div");
  chatWidgetContainer.id = "chat-widget-container";
  document.body.appendChild(chatWidgetContainer);

  // Inject the HTML
  chatWidgetContainer.innerHTML = `
    <div id="chat-bubble" class="w-16 h-16 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center cursor-pointer text-3xl">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    </div>
    <div id="chat-popup" class="hidden absolute bottom-20 right-0 w-96 bg-white rounded-md shadow-md flex flex-col transition-all text-sm">
      <div id="chat-header" class="flex justify-between items-center p-4 bg-gray-800 text-white rounded-t-md">
        <h3 class="m-0 text-lg">Chat Widget</h3>
        <button id="close-popup" class="bg-transparent border-none text-white cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div id="chat-messages" class="flex-1 p-4 overflow-y-auto"></div>
      <div id="chat-input-container" class="p-4 border-t border-gray-200">
        <div class="flex space-x-4 items-center">
          <button id="dropdown-menu" class="p-1.5 hover:bg-gray-100 flex cursor-pointer border border-gray-300 rounded-md outline-none">
            <svg id="dropdown-icon" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 lucide-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </button>
          <input type="text" id="chat-input" class="flex-1 border border-gray-300 rounded-md px-4 py-2 outline-none w-3/4" placeholder="Type your message...">
          <button id="chat-submit" class="bg-gray-800 hover:bg-gray-700 text-white rounded-md p-1.5 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send-horizontal">
              <path d="m3 3 3 9-3 9 19-9Z"/>
              <path d="M6 12h16"/>
            </svg>
          </button>
        </div>

        <div id="dropdown-content" class="hidden absolute bottom-14 left-0 border border-gray-300 rounded-md bg-white shadow-lg">
          <button id="open-camera" class="w-full p-2 flex items-center space-x-2 hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-camera">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>
            </svg>
            <span>Take a picture</span>
          </button>
          <button id="open-file" class="w-full p-2 flex items-center space-x-2 hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-plus">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
              <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
              <path d="M9 15h6"/>
              <path d="M12 18v-6"/>
            </svg>
            <span>Upload picture</span>
          </button>
        </div>
      </div>
      <div id="camera-modal" class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center hidden">
        <div class="relative w-4/5 h-4/5 flex items-center justify-center">
          <video id="camera-video" class="w-full h-full object-cover border border-gray-800 rounded-md" autoplay playsinline></video>
          <button id="take-picture" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 hover:text-gray-300 bg-transparent text-white p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle">
            <circle cx="12" cy="12" r="10"/>
            </svg>
          </button>
          <button id="switch-camera" class="absolute bottom-8 left-1/2 transform translate-x-20 hover:text-gray-300 bg-transparent text-white p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </svg>
          </button>
        </div>
        <button id="close-camera" class="absolute top-4 right-4 hover:text-gray-300 text-white p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  `;

  // Event listeners
  const chatInput = document.getElementById("chat-input");
  const chatSubmit = document.getElementById("chat-submit");
  const chatMessages = document.getElementById("chat-messages");
  const chatBubble = document.getElementById("chat-bubble");
  const chatPopup = document.getElementById("chat-popup");
  const closePopup = document.getElementById("close-popup");
  const dropdownMenu = document.getElementById("dropdown-menu");
  const dropdownIcon = document.getElementById("dropdown-icon");
  const dropdownContent = document.getElementById("dropdown-content");

  const openCamera = document.getElementById("open-camera");
  const openFile = document.getElementById("open-file");

  const cameraModal = document.getElementById("camera-modal");
  const cameraVideo = document.getElementById("camera-video");
  const takePictureButton = document.getElementById("take-picture");
  const switchCameraButton = document.getElementById("switch-camera");
  const closeCamera = document.getElementById("close-camera");

  chatSubmit.addEventListener("click", function () {
    const message = chatInput.value.trim();
    if (!message) return;

    chatMessages.scrollTop = chatMessages.scrollHeight;

    chatInput.value = "";

    onUserRequest(message);
  });

  chatInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      chatSubmit.click();
    }
  });

  chatBubble.addEventListener("click", function () {
    togglePopup();
  });

  closePopup.addEventListener("click", function () {
    togglePopup();
  });

  dropdownMenu.addEventListener("click", function () {
    toggleDropdown();
  });

  switchCameraButton.addEventListener("click", function () {
    switchCamera();
  });

  document.addEventListener("click", function (event) {
    const isClickInside =
      dropdownMenu.contains(event.target) ||
      dropdownContent.contains(event.target);
    if (!isClickInside && !dropdownContent.classList.contains("hidden")) {
      closeDropdown();
    }
  });

  openFile.addEventListener("click", function () {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = "image/*";
    input.onchange = function (event) {
      const file = event.target.files[0];
      if (file) {
        uploadFile(file);
      }
    };
    input.click();
  });

  openCamera.addEventListener("click", function () {
    openCameraDialog();
  });

  closeCamera.addEventListener("click", function () {
    closeCameraDialog();
  });

  takePictureButton.addEventListener("click", function () {
    takePicture();
  });

  // Functions

  function toggleDropdown() {
    dropdownContent.classList.toggle("hidden");

    if (dropdownContent.classList.contains("hidden")) {
      dropdownIcon.innerHTML = `
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      `;
      dropdownIcon.classList.remove("lucide-x");
      dropdownIcon.classList.add("lucide-plus");
    } else {
      dropdownIcon.innerHTML = `
        <path d="M18 6L6 18" />
        <path d="M6 6l12 12" />
      `;
      dropdownIcon.classList.remove("lucide-plus");
      dropdownIcon.classList.add("lucide-x");
    }
  }

  function openCameraDialog() {
    getMediaDevices().then((devices) => {
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      if (videoDevices.length > 0) {
        currentDeviceId = videoDevices[0].deviceId;
        startCamera(currentDeviceId);
      }
    });
  }

  function closeCameraDialog() {
    if (currentStream) {
      const tracks = currentStream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    cameraVideo.srcObject = null;
    cameraModal.classList.add("hidden");
  }

  function startCamera(deviceId) {
    const constraints = {
      video: { deviceId: { exact: deviceId } },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        currentStream = stream;
        cameraVideo.srcObject = stream;
        cameraModal.classList.remove("hidden");
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });
  }

  function switchCamera() {
    getMediaDevices().then((devices) => {
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      if (videoDevices.length > 1) {
        const currentIndex = videoDevices.findIndex(
          (device) => device.deviceId === currentDeviceId
        );
        const nextIndex = (currentIndex + 1) % videoDevices.length;
        currentDeviceId = videoDevices[nextIndex].deviceId;
        startCamera(currentDeviceId);
      }
    });
  }

  function getMediaDevices() {
    return navigator.mediaDevices.enumerateDevices();
  }

  function takePicture() {
    const canvas = document.createElement("canvas");
    canvas.width = cameraVideo.videoWidth;
    canvas.height = cameraVideo.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL("image/png");

    displayImageInChat(imageUrl);

    closeCameraDialog();

    setTimeout(function () {
      reply("Picture received.");
    }, 1000);
  }

  function uploadFile(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const imageUrl = event.target.result;

      displayImageInChat(imageUrl);

      setTimeout(function () {
        reply("Picture received.");
      }, 1000);
    };
    reader.readAsDataURL(file);
  }

  function closeDropdown() {
    dropdownContent.classList.add("hidden");
    dropdownIcon.innerHTML = `
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    `;
    dropdownIcon.classList.remove("lucide-x");
    dropdownIcon.classList.add("lucide-plus");
  }

  function reply(message) {
    const chatMessages = document.getElementById("chat-messages");
    const replyElement = document.createElement("div");
    replyElement.className = "flex mb-3";
    replyElement.innerHTML = `
    <div class="bg-gray-200 text-black rounded-lg py-2 px-4 max-w-[70%]">
      ${message}
    </div>
  `;
    chatMessages.appendChild(replyElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function displayImageInChat(imageUrl) {
    const messageElement = document.createElement("div");
    messageElement.className = "flex justify-start mb-3";
    messageElement.innerHTML = `
      <div class="flex items-center space-x-2">
        <img src="${imageUrl}" class="rounded-lg max-w-[70%]">
      </div>
    `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function togglePopup() {
    const chatPopup = document.getElementById("chat-popup");
    chatPopup.classList.toggle("hidden");
    if (!chatPopup.classList.contains("hidden")) {
      document.getElementById("chat-input").focus();
    }
  }

  function onUserRequest(message) {
    console.log("User request:", message);

    const messageElement = document.createElement("div");
    messageElement.className = "flex justify-end mb-3";
    messageElement.innerHTML = `
      <div class="bg-gray-800 text-white rounded-lg py-2 px-4 max-w-[70%]">
        ${message}
      </div>
    `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    chatInput.value = "";

    setTimeout(function () {
      reply("Hello! There is no AI yet.");
    }, 1000);
  }

  function reply(message) {
    const chatMessages = document.getElementById("chat-messages");
    const replyElement = document.createElement("div");
    replyElement.className = "flex mb-3";
    replyElement.innerHTML = `
      <div class="bg-gray-200 text-black rounded-lg py-2 px-4 max-w-[70%]">
        ${message}
      </div>
    `;
    chatMessages.appendChild(replyElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
})();
