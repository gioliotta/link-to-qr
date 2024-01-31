import { useState } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const MY_PORTFOLIO = "https://gioliotta.online",
    [input, setInput] = useState(""),
    [link, setLink] = useState(MY_PORTFOLIO),
    [lastLink, setLastLink] = useState(""),
    [loadQR, setLoadQR] = useState(false),
    regexURL = new RegExp(
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
    );

  function generateQR() {
    //? El load es simulado, el QR se genera de manera instantánea, pero decidí colocarlo para que haya un pequeño feedback, ya que el QR cambia tan veloz que sin el load tal vez el usuario no se percata de que se creó.
    if (!input) {
      toast.error("Please enter a link");
      return;
    }

    if (link == lastLink) {
      toast.error("The QR has already been generated");
      return;
    }

    if (input.match(regexURL)) {
      setLoadQR(true);
      setLink(input);
      setLastLink(input);
      const time = setTimeout(() => {
        setLoadQR(false);
        toast.success("QR generated correctly");
      }, 1500);
      return () => clearTimeout(time);
    } else {
      toast.error("Invalid link");
      return;
    }
  }

  function cleanInput() {
    if (!input) return;
    setInput("");
    setLink(MY_PORTFOLIO);
  }

  function donwloadQR() {
    if (!input) {
      toast.error("Input is empty");
      return;
    }

    html2canvas(document.body.querySelector("#capture"))
      .then(canvas => {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "qrcode.png";
        link.click();
      })
      .catch(err => console.error(`Error in download: ${err.message}`));
  }

  async function pasteUrl() {
    const url = await navigator.clipboard.readText();
    setInput(url);
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Toaster position="top-rigth" reverseOrder={false} />
      <main className="flex flex-col gap-y-8 items-center justify-start h-full w-full sm:w-[420px] font-mono px-4 pt-6 pb-6 rounded-lg bg-gray-200  border-2 border-gray-600">
        <div className="flex flex-col w-full justify-center items-center gap-y-2">
          <h1 className="text-4xl sm:text-5xl text-balance font-bold text-center w-full text-gray-600">
            <span className="text-blue-700">Link</span> to{" "}
            <span className="text-black">QR</span>
          </h1>
          <p className="text-gray-700 text-lg text-center text-pretty">
            Enter a link to generate a QR code
          </p>
        </div>

        <div className="flex flex-col w-full space-y-4">
          <div className="flex flex-col w-full justify-center items-center gap-y-4">
            <div className="relative w-full flex flex-coljustify-center items-center">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                className="w-full text-md sm:text-lg pl-4 placeholder-gray-500 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 py-2 text-blue-700"
                placeholder="Enter your link here"
                type="url"
              />
              <DeleteLink onClick={cleanInput} />
              <button
                onClick={pasteUrl}
                className="text-md sm:text-lg absolute cursor-pointer duration-75 bg-slate-500 px-2 py-1 rounded-md text-white top-2.7 right-1.5 hover:bg-slate-400"
              >
                Paste
              </button>
            </div>
            <button
              onClick={generateQR}
              className="w-full self-center py-2 font-semibold rounded-lg text-white capitalize text-xl md:text-2xl duration-75 border bg-gray-900 hover:scale-95 hover:bg-gray-800 "
              type="button"
            >
              generate QR
            </button>
          </div>

          <div
            id="capture"
            className="w-max self-center grid place-items-center h-auto p-3 bg-[#fffdf6]"
          >
            {loadQR ? (
              <Loading />
            ) : (
              <QRCode
                className="self-center h-auto aspect-[1/1]"
                value={link}
                size={200}
                color="#0000FF"
                level="L"
              />
            )}
          </div>

          <button
            onClick={donwloadQR}
            className="w-[230px] self-center py-2 text-xl font-semibold border-2 border-green-300 bg-green-400 rounded-md duration-75 hover:bg-green-300"
          >
            Download
          </button>
        </div>
      </main>

      <a
        rel="noreferrer"
        href={MY_PORTFOLIO}
        target="_blank"
        className="text-slate-300 text-md sm:text-lg hover:text-white cursor-pointer w-full text-center pt-4"
        title="gioliotta contact"
      >
        Created with ❤️ by <u>gioliotta</u>
      </a>
    </div>
  );
}

const Loading = () => (
  <div
    role="status"
    className="self-center w-[200px] h-[200px] flex justify-center items-center"
  >
    <svg
      className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
      viewBox="0 0 100 101"
      fill="none"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
    <span className="sr-only text-black text-xl">Loading...</span>
  </div>
);

const DeleteLink = ({ onClick }) => (
  <svg
    onClick={onClick}
    className="w-7 h-7 absolute top-2.3 right-20 duration-75 cursor-pointer hover:scale-110"
    viewBox="0 0 24 24"
    fill="#ff4949"
  >
    <path
      d="M4 7H20"
      stroke="#ff4949"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 10L7.70141 19.3578C7.87432 20.3088 8.70258 21 9.66915 21H14.3308C15.2974 21 16.1257 20.3087 16.2986 19.3578L18 10"
      stroke="#ff4949"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
      stroke="#ff4949"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default App;
