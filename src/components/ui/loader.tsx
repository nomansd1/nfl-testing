export default function Loader() {
  return (
    <div className="preloader">
      <div className="center">
        <div className="spinner">
          <div className="blob top"></div>
          <div className="blob bottom"></div>
          <div className="blob left"></div>
          <div className="blob move-blob"></div>
        </div>
      </div>
    </div>
  )
}