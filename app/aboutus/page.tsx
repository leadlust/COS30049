export default function AboutUs() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">About Us</h1>
        {/* Left Section */}
        <div>
          <h2 className="text-xl font-bold flex items-center mb-4">
            <span className="text-gray-300 text-2xl mr-2">|</span> The Project
          </h2>
          <p className="text-gray-300">
          ChainSwitches was created in 2025, with the aim to provide an insight into the financial markets using our algorhithm and cutting-edge technology,  
          which help the users to benefit from the seamless design of the websites, and also aid the users from making financial decisions and managing transaction.
          </p>
        </div>
        {/* Right Section (Image or Additional Content) */}
        <div>
          <img
            src="/images/project-image.jpg"
            alt="Project Image"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
  );
}
