import Spinner from "./Spinner";

function FullPageSpinner() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        height: "100vh",
        width: "100%",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Spinner fill="white" fontSize="2rem" />
    </div>
  );
}

export default FullPageSpinner;
