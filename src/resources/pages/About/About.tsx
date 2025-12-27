import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    document.title = "About Page";
  }, []);

  return (
    <>
      <div className="w-full max-w-7xl py-6 mx-auto">
        <p className="text-6xl pb-6">BDNX - A Global Promise</p>
        <p className="text-4xl pb-6">Better Quality for Better Living.</p>
        <p className="pb-6">BDNX was created with a simple vision: to make authentic products accessible to everyone. By collaborating with trusted suppliers and eliminating unnecessary intermediaries, we offer a transparent shopping experience that delivers real value and quality straight to our customers. From everyday essentials to unique global finds, we uphold quality and fairness in everything we do.</p>
        <p className="pb-6">Our vision is to serve communities worldwide with products they can trust and values they can feel.</p>
        <p>BDNX Sustainability Focus:</p>
        <ul className="list-disc list-inside">
          <li>
            Real and non-toxic raw materials.
          </li>
          <li>
            Ethical supplier partnerships.
          </li>
          <li>
            Priority on Eco-Friendly Packaging.
          </li>
        </ul>
      </div>
    </>
  );
}
