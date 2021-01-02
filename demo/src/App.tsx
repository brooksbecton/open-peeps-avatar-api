import React from "react";

const App = () => {
  const serverRoot = "http://localhost:8081";

  const [heads, setHeads] = React.useState<string[]>([]);
  const [faces, setFaces] = React.useState<string[]>([]);
  const [selectedHead, setSelectedHead] = React.useState("");
  const [selectedFace, setSelectedFace] = React.useState("");
  const [isShowingCopyAlert, setIsShowingCopyAlert] = React.useState(false);
  const getAvailableOptions = async () => {
    const availableOptions = await fetch(
      `${serverRoot}/api/images/info`
    ).then((r) => r.json());

    return availableOptions;
  };

  React.useEffect(() => {
    getAvailableOptions().then((options) => {
      setFaces(options.faces);
      setHeads(options.heads);
    });
  }, []);

  React.useEffect(() => {
    if (heads.length > 0) {
      setSelectedHead(heads[0]);
    }
  }, [heads]);
  React.useEffect(() => {
    if (faces.length > 0) {
      setSelectedFace(faces[0]);
    }
  }, [faces]);

  React.useEffect(() => {
    if (isShowingCopyAlert) {
      const timer = setTimeout(() => {
        setIsShowingCopyAlert(false);
      }, 3000);
      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [isShowingCopyAlert]);

  const fallbackCopyTextToClipboard = (text: string) => {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand("copy");
      var msg = successful ? "successful" : "unsuccessful";
      console.log("Fallback: Copying text command was " + msg);
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }

    document.body.removeChild(textArea);
  };
  const copyTextToClipboard = (text: string) => {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(
      function () {},
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  };

  const handleFaceSelect = React.useCallback(
    (e) => {
      setSelectedFace(e.target.value);
    },
    [setSelectedFace]
  );
  const handleHeadSelect = React.useCallback(
    (e) => {
      setSelectedHead(e.target.value);
    },
    [setSelectedHead]
  );

  const handleCopy = React.useCallback(() => {
    copyTextToClipboard(
      `${serverRoot}/api/images/?face=${selectedFace}&head=${selectedHead}`
    );

    setIsShowingCopyAlert(true);
  }, [selectedFace, selectedHead]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h1>Open Peeps Avatar API</h1>
        <p>
          Open Peeps is A hand-drawn illustration library. This API provides a
          way to dynamically request different avatar images.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: 25,
            padding: 10,
          }}
        >
          {selectedFace && selectedHead && (
            <img
              style={{ width: "100%" }}
              src={`${serverRoot}/api/images/?face=${selectedFace}&head=${selectedHead}`}
              alt={`Open Peeps ${selectedHead} head with ${selectedFace} face`}
            />
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingTop: "1rem",
            paddingBottom: "1rem",
          }}
        >
          <div
            style={{
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            <pre
              style={{ display: "inline" }}
            >{`${serverRoot}/api/images/?face=`}</pre>
            <mark>{selectedFace}</mark>
            <pre style={{ display: "inline" }}>{`&head=`}</pre>
            <mark>{selectedHead}</mark>
          </div>
          <button onClick={handleCopy}>Copy</button>
        </div>
      </div>

      <h2>Options</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <div>
          <h3>Faces</h3>
          <ul style={{ display: "flex", flexDirection: "column" }}>
            {faces.map((f) => (
              <label key={f}>
                <input
                  checked={f === selectedFace}
                  type="radio"
                  name="face"
                  value={f}
                  onChange={handleFaceSelect}
                />
                {f}
              </label>
            ))}
          </ul>
        </div>
        <div>
          <h3>Heads</h3>
          <ul style={{ display: "flex", flexDirection: "column" }}>
            {heads.map((f) => (
              <label key={f}>
                <input
                  checked={f === selectedHead}
                  type="radio"
                  name="head"
                  value={f}
                  onChange={handleHeadSelect}
                />
                {f}
              </label>
            ))}
          </ul>
        </div>
      </div>
      {isShowingCopyAlert && (
        <div
          style={{
            backgroundColor: "salmon",
            display: "flex",
            flexDirection: "row",
            position: "absolute",
            left: 20,
            bottom: 20,
            borderRadius: 25,
            padding: 10,
          }}
        >
          <img
            style={{ width: 150 }}
            src="images/jeeves.png"
            alt="A older man that looks like a butler"
          />
          <p style={{ fontFamily: "Times New Roman" }}>
            Sir, your text has been copied.
          </p>
        </div>
      )}
    </div>
  );
};
export default App;
