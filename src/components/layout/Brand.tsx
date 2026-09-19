import Image from "next/image";

export default function Brand() {
  return (
    <div className="brand">
      <div className="brand-logo">
        <Image
          src="/aqlogo.svg"
          alt="AQ Distribuciones"
          width={190}
          height={190}
          priority
        />
      </div>
    </div>
  );
}