const Loader = ({ text }: { text: string }) => {
  return (
    <div className="loader-container" dir="auto">
      <span>{text}</span>
      <span className="loader"></span>
    </div>
  );
};

export default Loader;
