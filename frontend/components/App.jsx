import CubeWithLineTexture from "./CubeWithLineTexture";

export default function App({ home }) {
  console.log("Home", home);

  return (
    // <div className="tw-text-5xl tw-text-red-600 tw-border tw-border-red-500 tw-flex tw-gap-5">
    //   Test Three js
    //   <div className="tw-text-5xl tw-text-red-600 tw-border tw-border-red-500 tw-flex tw-gap-5">
    //     Hello
    //   </div>
    //   <div className="tw-w-10 tw-text-5xl tw-text-red-600 tw-border tw-border-green-500 tw-flex tw-gap-5">
    //     <CubeWithLineTexture />
    //   </div>
    // </div>
    <div className="tw-flex tw-justify-center tw-items-center tw-h-screen">
      Test Three js
      {/* <div className="tw-w-64 tw-h-64">
        <CubeWithLineTexture />
      </div> */}
      <div style={{ width: "50vw", height: "50vh" }}>
        <CubeWithLineTexture />
      </div>
    </div>
  );
}
