import { Swirl } from "./components/swirl";

export default () => {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
      </head>
      <body
        style={{
          top: 0,
          left: 0,
          position: "fixed",
          width: "100vw",
          height: "100vh",
          backgroundColor: "black",
          margin: 0,
        }}
      >
        <Swirl particleCount={300} variant="none" radiusVariation={20}   />

      </body>
    </>
  );
};
