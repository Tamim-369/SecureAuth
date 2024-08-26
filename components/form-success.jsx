const FormSuccess = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-emerald-200 p-3 my-2 rounded-md flex items-center gap-x-2 text-sm text-emerald-600">
      {/* success icon */}
      <svg
        className="h-4 w-4 fill-emerald-600"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path d="M256 512a256 256 0 100-512 256 256 0 100 512zm113-303L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
      </svg>
      <p>{message}</p>
    </div>
  );
};

export default FormSuccess;
