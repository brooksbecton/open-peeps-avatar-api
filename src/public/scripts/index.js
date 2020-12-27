"use strict";

const App = () => {
  const [heads, setHeads] = React.useState([]);
  const [faces, setFaces] = React.useState([]);
  const [selectedHead, setSelectedHead] = React.useState("");
  const [selectedFace, setSelectedFace] = React.useState("");
  const getAvailableOptions = async () => {
    const availableOptions = await fetch("/api/images/info").then((r) =>
      r.json()
    );

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

  return (
    <div>
      <h1>Open Peeps API Demo</h1>
      <div>
        <div className="picker">
          <h2>Menu</h2>
          <h3>Faces</h3>
          {faces.map((f) => {
            return (
              <label key={f}>
                <input
                  checked={f === selectedFace}
                  label={f}
                  type="radio"
                  name="face"
                  value={f}
                  onChange={handleFaceSelect}
                />
                {f}
              </label>
            );
          })}
          <h3>Heads</h3>
          {heads.map((h) => {
            return (
              <label key={h}>
                <input
                  checked={h === selectedHead}
                  label={h}
                  type="radio"
                  name="head"
                  value={h}
                  onChange={handleHeadSelect}
                />
                {h}
              </label>
            );
          })}
        </div>
        <div className="preview">
          <h2>Preview</h2>
          {selectedFace !== "" && selectedHead !== "" && (
            <img
              src={`/api/images?head=${selectedHead}&face=${selectedFace}`}
              alt={`preview of ${selectedHead} head and ${selectedFace} face`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const domContainer = document.querySelector("#app");
ReactDOM.render(React.createElement(App), domContainer);
